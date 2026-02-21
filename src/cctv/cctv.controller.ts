import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { CctvService } from './cctv.service';

@Controller('cctv')
export class CctvController {
  constructor(private readonly cctvService: CctvService) {}

  @Get()
  findAll(@Req() req) {
    return this.cctvService.findAll(req.tenantId);
  }

  @Post()
  create(@Body() createCctvDto, @Req() req) {
    createCctvDto.tenantId = req.tenantId;
    return this.cctvService.create(createCctvDto);
  }
}
