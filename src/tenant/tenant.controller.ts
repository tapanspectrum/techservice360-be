import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto, @Req() req) {
    const userRole = req.user?.role;
    // Only admin can create new tenants
    if (userRole !== 'admin') {
      throw new HttpException('Only admin users can create tenants', HttpStatus.FORBIDDEN);
    }
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  findAll(@Req() req) {
    const userRole = req.user?.role;
    const tenantId = req.tenantId;
    return this.tenantService.findAll(tenantId, userRole);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.tenantService.findByEmail(email);
  }

  @Get('search/:name')
  findByName(@Param('name') name: string) {
    return this.tenantService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userRole = req.user?.role;
    const tenantId = req.tenantId;
    return this.tenantService.findOne(id, tenantId, userRole);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto, @Req() req) {
    const userRole = req.user?.role;
    const tenantId = req.tenantId;
    return this.tenantService.update(id, updateTenantDto, tenantId, userRole);
  }

  @Put(':id')
  updateFull(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto, @Req() req) {
    const userRole = req.user?.role;
    const tenantId = req.tenantId;
    return this.tenantService.update(id, updateTenantDto, tenantId, userRole);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userRole = req.user?.role;
    // Only admin can delete tenants
    if (userRole !== 'admin') {
      throw new HttpException('Only admin users can delete tenants', HttpStatus.FORBIDDEN);
    }
    const tenantId = req.tenantId;
    return this.tenantService.remove(id, tenantId, userRole);
  }
}
