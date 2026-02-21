import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@UseGuards(TenantGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}


  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Req() req) {
    const userRole = req.user?.role;
    if (userRole !== 'admin') {
      createTicketDto.tenantId = req.tenantId;
    }
    return this.ticketsService.create(createTicketDto, userRole);
  }


  @Get()
  findAll(@Query('status') status: string, @Req() req) {
    const userRole = req.user?.role;
    if (status && userRole !== 'admin') {
      return this.ticketsService.findByStatus(status, req.tenantId, userRole);
    }
    return this.ticketsService.findAll(req.tenantId, userRole);
  }


  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userRole = req.user?.role;
    return this.ticketsService.findOne(id, req.tenantId, userRole);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto, @Req() req) {
    const userRole = req.user?.role;
    return this.ticketsService.update(id, updateTicketDto, req.tenantId, userRole);
  }


  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.ticketsService.remove(id, req.tenantId);
  }


  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string, @Req() req) {
    return this.ticketsService.findByClient(clientId, req.tenantId);
  }
}
