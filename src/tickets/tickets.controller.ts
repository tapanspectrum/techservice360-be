import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  private resolveAppLinkFromHeaders(req: any): string | undefined {
    const rawValue = req?.headers?.['x-frontend-url'] || req?.headers?.origin || req?.headers?.referer;
    if (!rawValue) {
      return undefined;
    }

    const raw = Array.isArray(rawValue) ? rawValue[0] : String(rawValue);

    try {
      const normalized = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
      const parsed = new URL(normalized);
      return parsed.origin;
    } catch {
      return undefined;
    }
  }

  // @UseGuards(TenantGuard)
  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Req() req) {
    const userRole = req.user?.role;
    const appLink = this.resolveAppLinkFromHeaders(req);
    console.log('User Role:', userRole);
    if (userRole !== 'admin') {
      createTicketDto.tenantId = req.tenantId;
    }
    return this.ticketsService.create(createTicketDto, userRole, appLink);
  }

  @Get()
  findAll(@Query('status') status: string, @Req() req) {
    const userRole = req.user?.role;
    console.log('User Role:', userRole);
    if (status && userRole !== 'admin') {
      return this.ticketsService.findByStatus(status, req.tenantId, userRole);
    }
    return this.ticketsService.findAll(req.tenantId='', userRole);
  }

  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string, @Req() req) {
    return this.ticketsService.findByClient(clientId, req.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userRole = req.user?.role;
    return this.ticketsService.findOne(id, req.tenantId, userRole);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto, @Req() req) {
    const userRole = req.user?.role;
    const appLink = this.resolveAppLinkFromHeaders(req);
    return this.ticketsService.update(id, updateTicketDto, req.tenantId, userRole, appLink);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.ticketsService.remove(id, req.tenantId);
  }
}
