import { Controller, Get, Post, Body } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAll() {
    return this.skillsService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.skillsService.create(body);
  }

  @Post('assign')
  async assignSkill(@Body() body: any) {
    return this.skillsService.assignSkillToEmployee(body);
  }
}