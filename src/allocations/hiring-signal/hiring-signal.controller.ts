import { Controller, Get, Query } from '@nestjs/common';
import { HiringSignalService } from './hiring-signal.service';

@Controller('allocations')
export class HiringSignalController {
  constructor(private readonly service: HiringSignalService) {}

  @Get('hiring-signal')
  async signal(@Query('week_start_date') week_start_date: string) {
    return this.service.analyze(week_start_date);
  }
}