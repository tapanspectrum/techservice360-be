import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { AmcService } from './amc.service';
import { CreateAmcDto } from './dto/create-amc.dto';
import { UpdateAmcDto } from './dto/update-amc.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('amc')
export class AmcController {
  constructor(private readonly amcService: AmcService) {}


  @Post()
  create(@Body() createAmcDto: CreateAmcDto, @Req() req) {
    const userRole = req.user?.role;
    if (userRole !== 'admin') {
      createAmcDto.tenantId = req.tenantId;
    }
    return this.amcService.create(createAmcDto, userRole);
  }


  @Get()
  findAll(@Query('status') status: string, @Req() req) {
    console.log('Received status query:', status);
    const userRole = req.user?.role;
    const tenantId = userRole !== 'admin' ? req.tenantId : null;
    if (status) {
      return this.amcService.findByStatus(status, tenantId, userRole);
    }
    return this.amcService.findAll(tenantId, userRole);
  }


  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userRole = req.user?.role;
    const tenantId = userRole !== 'admin' ? req.tenantId : null;
    return this.amcService.findOne(id, tenantId, userRole);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAmcDto: UpdateAmcDto, @Req() req) {
    const userRole = req.user?.role;
    const tenantId = userRole !== 'admin' ? req.tenantId : null;
    return this.amcService.update(id, updateAmcDto, tenantId, userRole);
  }


  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userRole = req.user?.role;
    const tenantId = userRole !== 'admin' ? req.tenantId : null;
    return this.amcService.remove(id, tenantId, userRole);
  }


  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string, @Req() req) {
    const userRole = req.user?.role;
    const tenantId = userRole !== 'admin' ? req.tenantId : null;
    return this.amcService.findByClient(clientId, tenantId, userRole);
  }
}
