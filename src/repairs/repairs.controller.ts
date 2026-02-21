import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { RepairsService } from './repairs.service';

@Controller('repairs')
export class RepairsController {
  constructor(private readonly repairsService: RepairsService) {}

  @Get()
  findAll(@Req() req) {
    return this.repairsService.findAll(req.tenantId);
  }

  @Post()
  create(@Body() createRepairDto, @Req() req) {
    createRepairDto.tenantId = req.tenantId;
    return this.repairsService.create(createRepairDto);
  }
}
