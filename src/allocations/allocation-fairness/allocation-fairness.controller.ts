import { Controller, Get, Query } from '@nestjs/common';
import { AllocationFairnessService } from './allocation-fairness.service';

@Controller('allocations')
export class AllocationFairnessController {
  constructor(private readonly fairnessService: AllocationFairnessService) {}

  @Get('suggestions/fair')
  async fairSuggestions(
    @Query('required_hours') required_hours: string,
    @Query('week_start_date') week_start_date: string,
  ) {
    return this.fairnessService.getFairSuggestions(
      Number(required_hours),
      week_start_date,
    );
  }
}