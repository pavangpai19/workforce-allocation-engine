import { Controller, Post, Body } from '@nestjs/common';
import { AllocationOutcomeService } from './allocation-outcome.service';

@Controller('allocations')
export class AllocationOutcomeController {
  constructor(private readonly outcomeService: AllocationOutcomeService) {}

  @Post('outcome')
  async outcome(@Body() body: any) {
    return this.outcomeService.recordOutcome(
      body.allocation_id,
      body.delivery_score,
      body.quality_score,
      body.completion_status,
    );
  }
}