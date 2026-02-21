import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@UseGuards(TenantGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}


  @Post()
  create(@Body() createBillingDto: CreateBillingDto, @Req() req) {
    createBillingDto.tenantId = req.tenantId;
    return this.billingService.create(createBillingDto);
  }


  @Get()
  findAll(@Query('status') status: string, @Req() req) {
    if (status) {
      return this.billingService.findByStatus(status, req.tenantId);
    }
    return this.billingService.findAll(req.tenantId);
  }


  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.billingService.findOne(id, req.tenantId);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillingDto: UpdateBillingDto, @Req() req) {
    return this.billingService.update(id, updateBillingDto, req.tenantId);
  }


  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.billingService.remove(id, req.tenantId);
  }


  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string, @Req() req) {
    return this.billingService.findByClient(clientId, req.tenantId);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.billingService.findByProject(projectId);
  }
}
