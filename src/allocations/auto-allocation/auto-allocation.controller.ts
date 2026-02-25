import { Controller, Post, Body, Get } from '@nestjs/common';
import { AutoAllocationService } from './auto-allocation.service';

@Controller('allocations')
export class AutoAllocationController {
  constructor(private readonly autoService: AutoAllocationService) {}

  @Post('auto')
  async autoAllocate(@Body() body: any) {
    return this.autoService.autoAllocate(
      body.project_id,
      body.skill,
      body.required_hours,
      body.week_start_date,
    );
  }

  // TEMP debug route
  @Get('auto/test')
  async testAuto() {
    return 'Auto allocation endpoint active';
  }
}