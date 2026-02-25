import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class AllocationForecastService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async forecastNextWeek(week_start_date: string) {
    const supabase = this.supabaseService.getClient();

    // employees
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('*');
    if (empError) throw new Error(empError.message);

    // allocations up to selected week
    const { data: allocations, error: allocError } = await supabase
      .from('allocations')
      .select('*')
      .lte('week_start_date', week_start_date);
    if (allocError) throw new Error(allocError.message);

    // build history per employee
    const historyMap: Record<string, number[]> = {};
    allocations?.forEach((a: any) => {
      if (!historyMap[a.employee_id]) historyMap[a.employee_id] = [];
      historyMap[a.employee_id].push(a.allocated_hours);
    });

    const forecast = employees.map((emp: any) => {
      const history = historyMap[emp.id] || [];

      // avg + trend
      const avg =
        history.length > 0
          ? history.reduce((s: number, v: number) => s + v, 0) / history.length
          : 0;

      const last = history.length ? history[history.length - 1] : 0;
      const prev = history.length > 1 ? history[history.length - 2] : last;

      const trend = last - prev; // simple week-over-week delta
      const predicted_hours = Math.max(0, avg + trend);

      const capacity = emp.weekly_capacity_hours;
      const utilization_next_week = capacity
        ? predicted_hours / capacity
        : 0;

      let overload_risk = 'LOW';
      if (utilization_next_week > 1) overload_risk = 'CRITICAL';
      else if (utilization_next_week > 0.85) overload_risk = 'HIGH';
      else if (utilization_next_week > 0.6) overload_risk = 'MEDIUM';

      return {
        employee_id: emp.id,
        employee_name: emp.name,
        predicted_hours_next_week: Math.round(predicted_hours),
        capacity,
        utilization_next_week: Number(utilization_next_week.toFixed(2)),
        overload_risk,
      };
    });

    // team-level gap
    const total_predicted = forecast.reduce(
      (s, e) => s + e.predicted_hours_next_week,
      0,
    );
    const total_capacity = employees.reduce(
      (s: number, e: any) => s + (e.weekly_capacity_hours || 0),
      0,
    );

    const capacity_gap = total_capacity - total_predicted;
    const staffing_signal =
      capacity_gap < 0
        ? 'SHORTAGE'
        : capacity_gap < total_capacity * 0.15
        ? 'TIGHT'
        : 'HEALTHY';

    return {
      week_start_date,
      team_summary: {
        total_predicted_hours: total_predicted,
        total_capacity,
        capacity_gap,
        staffing_signal,
      },
      employee_forecast: forecast.sort(
        (a, b) => b.utilization_next_week - a.utilization_next_week,
      ),
    };
  }
}