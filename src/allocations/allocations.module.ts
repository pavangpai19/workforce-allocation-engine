import { Module } from '@nestjs/common';
import { AllocationsController } from './allocations.controller';
import { AllocationsService } from './allocations.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { AllocationIntelligenceService } from './allocation-intelligence.service';
import { AllocationIntelligenceController } from './allocation-intelligence.controller';
import { AllocationFairnessService } from './allocation-fairness/allocation-fairness.service';
import { AllocationFairnessController } from './allocation-fairness/allocation-fairness.controller';
import { AutoAllocationService } from './auto-allocation/auto-allocation.service';
import { AutoAllocationController } from './auto-allocation/auto-allocation.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [AllocationsController, AllocationIntelligenceController, AllocationFairnessController, AutoAllocationController],
  providers: [AllocationsService, AllocationIntelligenceService, AllocationFairnessService, AutoAllocationService],
})
export class AllocationsModule {}