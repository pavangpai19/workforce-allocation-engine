import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeesModule } from './employees/employees.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { AllocationsModule } from './allocations/allocations.module';
import { PerformanceService } from './performance/performance.service';
import { PerformanceController } from './performance/performance.controller';
import { DecisionEngineService } from './intelligence/decision-engine/decision-engine.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    EmployeesModule,
    ProjectsModule,
    SkillsModule,
    AllocationsModule,
  ],
  providers: [PerformanceService, DecisionEngineService],
  controllers: [PerformanceController],
})
export class AppModule {}