import { Controller, Get, Query } from '@nestjs/common';
import { AllocationIntelligenceService } from './allocation-intelligence.service';

@Controller('allocations')
export class AllocationIntelligenceController {
  constructor(
    private readonly intelligenceService: AllocationIntelligenceService,
  ) {}

  @Get('suggestions')
  async suggest(
    @Query('required_hours') required_hours: string,
    @Query('week_start_date') week_start_date: string,
  ) {
    return this.intelligenceService.suggestEmployees(
      Number(required_hours),
      week_start_date,
    );
  }
}