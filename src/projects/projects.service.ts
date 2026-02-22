import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async create(body: any) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          name: body.name,
          project_priority: body.project_priority,
          estimated_total_hours: body.estimated_total_hours,
          start_date: body.start_date,
          end_date: body.end_date,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return data;
  }
}