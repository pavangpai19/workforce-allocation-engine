import { Controller, Get, Query } from '@nestjs/common';
import { AllocationForecastService } from './allocation-forecast.service';

@Controller('allocations')
export class AllocationForecastController {
  constructor(private readonly forecastService: AllocationForecastService) {}

  @Get('forecast')
  async forecast(@Query('week_start_date') week_start_date: string) {
    return this.forecastService.forecastNextWeek(week_start_date);
  }
}