import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly perfService: PerformanceService) {}

  @Post()
  async record(@Body() body: any) {
    return this.perfService.recordPerformance(body);
  }

  @Get('score')
  async getScore(@Query('employee_id') employee_id: string) {
    return this.perfService.getEmployeeScore(employee_id);
  }
}