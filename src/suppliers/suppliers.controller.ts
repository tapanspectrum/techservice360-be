import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  findAll(@Req() req) {
    return this.suppliersService.findAll(req.tenantId);
  }

  @Post()
  create(@Body() createSupplierDto, @Req() req) {
    createSupplierDto.tenantId = req.tenantId;
    return this.suppliersService.create(createSupplierDto);
  }
}
