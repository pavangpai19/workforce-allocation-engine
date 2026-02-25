import { Controller, Get, Query } from '@nestjs/common';
import { DeliveryProbabilityService } from './delivery-probability.service';

@Controller('allocations')
export class DeliveryProbabilityController {
  constructor(private readonly service: DeliveryProbabilityService) {}

  @Get('delivery-probability')
  async predict(@Query('employee_id') employee_id: string) {
    return this.service.predict(employee_id);
  }
}