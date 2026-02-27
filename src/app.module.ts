import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AllocationsController } from './allocations.controller';
import { AllocationsService } from './allocations.service';

import { AllocationIntelligenceService } from './allocation-intelligence.service';
import { AllocationIntelligenceController } from './allocation-intelligence.controller';

import { AllocationFairnessService } from './allocation-fairness/allocation-fairness.service';
import { AllocationFairnessController } from './allocation-fairness/allocation-fairness.controller';

import { AutoAllocationService } from './auto-allocation/auto-allocation.service';
import { AutoAllocationController } from './auto-allocation/auto-allocation.controller';

import { AllocationRiskService } from './allocation-risk/allocation-risk.service';
import { AllocationRiskController } from './allocation-risk/allocation-risk.controller';

import { AllocationOutcomeService } from './allocation-outcome/allocation-outcome.service';
import { AllocationOutcomeController } from './allocation-outcome/allocation-outcome.controller';

import { AllocationForecastService } from './allocation-forecast/allocation-forecast.service';
import { AllocationForecastController } from './allocation-forecast/allocation-forecast.controller';

import { DeliveryProbabilityService } from './delivery-probability/delivery-probability.service';
import { DeliveryProbabilityController } from './delivery-probability/delivery-probability.controller';

import { HiringSignalService } from './hiring-signal/hiring-signal.service';
import { HiringSignalController } from './hiring-signal/hiring-signal.controller';

import { DecisionEngineService } from '../intelligence/decision-engine.service';

@Module({
  imports: [SupabaseModule],
  controllers: [
    AllocationsController,
    AllocationIntelligenceController,
    AllocationFairnessController,
    AutoAllocationController,
    AllocationRiskController,
    AllocationOutcomeController,
    AllocationForecastController,
    DeliveryProbabilityController,
    HiringSignalController,
  ],
  providers: [
    AllocationsService,
    AllocationIntelligenceService,
    AllocationFairnessService,
    AutoAllocationService,
    AllocationRiskService,
    AllocationOutcomeService,
    AllocationForecastService,
    DeliveryProbabilityService,
    HiringSignalService,
    DecisionEngineService,
  ],
})
export class AllocationsModule {}