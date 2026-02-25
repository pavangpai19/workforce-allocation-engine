import { Controller, Get, Query } from '@nestjs/common';
import { AllocationRiskService } from './allocation-risk.service';

@Controller('allocations')
export class AllocationRiskController {
  constructor(private readonly riskService: AllocationRiskService) {}

  @Get('risk')
  async risk(@Query('week_start_date') week_start_date: string) {
    return this.riskService.analyzeRisk(week_start_date);
  }
}