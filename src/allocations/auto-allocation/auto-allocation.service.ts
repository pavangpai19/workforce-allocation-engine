import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { DecisionEngineService } from '../intelligence/decision-engine.service';

@Injectable()
export class AutoAllocationService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly decisionEngine: DecisionEngineService,
  ) {}

  async autoAllocate(
    project_id: string,
    skill_name: string,
    required_hours: number,
    week_start_date: string,
  ) {
    const supabase = this.supabaseService.getClient();

    // 1️⃣ Get skill
    const { data: skill } = await supabase
      .from('skills')
      .select('*')
      .eq('name', skill_name)
      .single();

    if (!skill) throw new Error('Skill not found');

    // 2️⃣ Employees with skill
    const { data: employeeSkills } = await supabase
      .from('employee_skills')
      .select('*')
      .eq('skill_id', skill.id);

    const employeeIds = employeeSkills.map((e: any) => e.employee_id);

    if (!employeeIds.length)
      throw new Error('No employees with this skill');

    // 3️⃣ Employee details
    const { data: employees } = await supabase
      .from('employees')
      .select('*')
      .in('id', employeeIds);

    // 4️⃣ Weekly allocations
    const { data: allocations } = await supabase
      .from('allocations')
      .select('*')
      .eq('week_start_date', week_start_date);

    const allocationMap: Record<string, number> = {};
    allocations?.forEach((a: any) => {
      allocationMap[a.employee_id] =
        (allocationMap[a.employee_id] || 0) + a.allocated_hours;
    });

    // 5️⃣ Performance records
    const { data: perfData } = await supabase
      .from('employee_performance')
      .select('*');

    const performanceMap: Record<string, any[]> = {};
    perfData?.forEach((p: any) => {
      if (!performanceMap[p.employee_id]) {
        performanceMap[p.employee_id] = [];
      }
      performanceMap[p.employee_id].push(p);
    });

    // 6️⃣ Rank employees
    const ranked = employees
      .map((emp: any) => {
        const allocated = allocationMap[emp.id] || 0;
        const capacity = emp.weekly_capacity_hours;
        const remaining = capacity - allocated;

        const perfRecords = performanceMap[emp.id] || [];

        const fairness = this.decisionEngine.computeFairness(
          allocated,
          capacity,
        );

        const performance =
          this.decisionEngine.computePerformance(perfRecords);

        const final_score =
          this.decisionEngine.computeFinalScore(fairness, performance);

        return {
          employee_id: emp.id,
          employee_name: emp.name,
          remaining,
          fairness,
          performance,
          final_score,
        };
      })
      .filter((e) => e.remaining >= required_hours)
      .sort((a, b) => b.final_score - a.final_score);

    if (!ranked.length)
      throw new Error('No employee available with enough capacity');

    const selected = ranked[0];

    // 7️⃣ Create allocation
    const { data: newAllocation, error } = await supabase
      .from('allocations')
      .insert([
        {
          employee_id: selected.employee_id,
          project_id,
          allocated_hours: required_hours,
          week_start_date,
          status: 'PROPOSED',
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return {
      message: 'Auto allocation successful',
      allocated_to: selected.employee_name,
      decision_breakdown: {
        fairness: selected.fairness,
        performance: selected.performance,
        final_score: selected.final_score,
      },
      allocation: newAllocation,
    };
  }
}