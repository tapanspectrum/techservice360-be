import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@UseGuards(TenantGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}


  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto, @Req() req) {
    createInventoryDto.tenantId = req.tenantId;
    return this.inventoryService.create(createInventoryDto);
  }


  @Get()
  findAll(@Query('status') status: string, @Req() req) {
    if (status) {
      return this.inventoryService.findByStatus(status, req.tenantId);
    }
    return this.inventoryService.findAll(req.tenantId);
  }


  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.inventoryService.findOne(id, req.tenantId);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto, @Req() req) {
    return this.inventoryService.update(id, updateInventoryDto, req.tenantId);
  }


  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.inventoryService.remove(id, req.tenantId);
  }


  @Get('sku/:sku')
  findBySku(@Param('sku') sku: string, @Req() req) {
    return this.inventoryService.findBySku(sku, req.tenantId);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string, @Req() req) {
    return this.inventoryService.findByCategory(category, req.tenantId);
  }
}
