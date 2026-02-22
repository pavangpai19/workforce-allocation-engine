import { Controller, Get, Post, Body } from '@nestjs/common';
import { AllocationsService } from './allocations.service';

@Controller('allocations')
export class AllocationsController {
  constructor(private readonly allocationsService: AllocationsService) {}

  @Get()
  async findAll() {
    return this.allocationsService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.allocationsService.create(body);
  }
}