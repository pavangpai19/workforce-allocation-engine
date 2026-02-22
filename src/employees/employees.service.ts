import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('employees')
      .select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async create(body: any) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          name: body.name,
          email: body.email,
          weekly_capacity_hours: body.weekly_capacity_hours,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return data;
  }
}