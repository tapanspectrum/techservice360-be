import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { AmcService } from './amc.service';
import { CreateAmcDto } from './dto/create-amc.dto';
import { UpdateAmcDto } from './dto/update-amc.dto';

@UseGuards(TenantGuard)
@Controller('amc')
export class AmcController {
  constructor(private readonly amcService: AmcService) {}


  @Post()
  create(@Body() createAmcDto: CreateAmcDto, @Req() req) {
    createAmcDto.tenantId = req.tenantId;
    return this.amcService.create(createAmcDto);
  }


  @Get()
  findAll(@Query('status') status: string, @Req() req) {
    if (status) {
      return this.amcService.findByStatus(status, req.tenantId);
    }
    return this.amcService.findAll(req.tenantId);
  }


  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.amcService.findOne(id, req.tenantId);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAmcDto: UpdateAmcDto, @Req() req) {
    return this.amcService.update(id, updateAmcDto, req.tenantId);
  }


  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.amcService.remove(id, req.tenantId);
  }


  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string, @Req() req) {
    return this.amcService.findByClient(clientId, req.tenantId);
  }
}
