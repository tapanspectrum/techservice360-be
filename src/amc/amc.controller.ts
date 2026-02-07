import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AmcService } from './amc.service';
import { CreateAmcDto } from './dto/create-amc.dto';
import { UpdateAmcDto } from './dto/update-amc.dto';

@Controller('amc')
export class AmcController {
  constructor(private readonly amcService: AmcService) {}

  @Post()
  create(@Body() createAmcDto: CreateAmcDto) {
    return this.amcService.create(createAmcDto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    if (status) {
      return this.amcService.findByStatus(status);
    }
    return this.amcService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amcService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAmcDto: UpdateAmcDto) {
    return this.amcService.update(id, updateAmcDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.amcService.remove(id);
  }

  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string) {
    return this.amcService.findByClient(clientId);
  }
}
