import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}  
  
  @Post()
  create(@Body() createClientDto: CreateClientDto, @Req() req) {
    const userRole = req.user?.role;
    const userId = req.user?._id || req.user?.id;
    console.log('User Role:', userRole, 'User ID:', userId);
    if (userRole !== 'admin') {
      createClientDto.tenantId = req.tenantId;
    }
    return this.clientsService.create(createClientDto, userRole, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req) {
    const userRole = req.user?.role;
    const tenantId = userRole !== 'admin' ? req.tenantId : null;
    return this.clientsService.findAll(tenantId, userRole);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userRole = req.user?.role;
    const tenantId = userRole !== 'admin' ? req.tenantId : null;
    return this.clientsService.findOne(id, tenantId, userRole);
  }


  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @Req() req) {
    const userRole = req.user?.role;
    const userId = req.user?._id || req.user?.id;
    const tenantId = userRole !== 'admin' ? req.tenantId : null;
    return this.clientsService.update(id, updateClientDto, tenantId, userRole, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userRole = req.user?.role;
    return this.clientsService.remove(id, req.tenantId, userRole);
  }
}
