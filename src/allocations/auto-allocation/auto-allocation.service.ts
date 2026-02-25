import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class AutoAllocationService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async autoAllocate(
    project_id: string,
    skill_name: string,
    required_hours: number,
    week_start_date: string,
  ) {
    const supabase = this.supabaseService.getClient();

    // 1️⃣ get skill
    const { data: skill } = await supabase
      .from('skills')
      .select('*')
      .eq('name', skill_name)
      .single();

    if (!skill) throw new Error('Skill not found');

    // 2️⃣ get employees with skill
    const { data: employeeSkills } = await supabase
      .from('employee_skills')
      .select('*')
      .eq('skill_id', skill.id);

    const employeeIds = employeeSkills.map((e: any) => e.employee_id);

    if (employeeIds.length === 0)
      throw new Error('No employees with this skill');

    // 3️⃣ employees data
    const { data: employees } = await supabase
      .from('employees')
      .select('*')
      .in('id', employeeIds);

    // 4️⃣ allocations for week
    const { data: allocations } = await supabase
      .from('allocations')
      .select('*')
      .eq('week_start_date', week_start_date);

    const allocationMap: any = {};
    allocations.forEach((a: any) => {
      allocationMap[a.employee_id] =
        (allocationMap[a.employee_id] || 0) + a.allocated_hours;
    });

    // 5️⃣ compute fairness + capacity
    const ranked = employees
      .map((emp: any) => {
        const allocated = allocationMap[emp.id] || 0;
        const capacity = emp.weekly_capacity_hours;
        const remaining = capacity - allocated;

        const utilization = allocated / capacity;

        let fairness_score = remaining / capacity;
        if (utilization > 1) fairness_score -= 1;
        if (utilization > 0.8) fairness_score -= 0.3;
        if (utilization < 0.3) fairness_score += 0.4;

        return {
          employee_id: emp.id,
          employee_name: emp.name,
          remaining,
          fairness_score,
        };
      })
      .filter((e) => e.remaining >= required_hours)
      .sort((a, b) => b.fairness_score - a.fairness_score);

    if (ranked.length === 0)
      throw new Error('No employee available with enough capacity');

    const selected = ranked[0];

    // 6️⃣ create allocation
    const { data: newAllocation, error } = await supabase
      .from('allocations')
      .insert([
        {
          employee_id: selected.employee_id,
          project_id,
          allocated_hours: required_hours,
          week_start_date,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return {
      message: 'Auto allocation successful',
      allocated_to: selected.employee_name,
      allocation: newAllocation,
    };
  }
}