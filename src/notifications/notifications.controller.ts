import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@UseGuards(TenantGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto, @Req() req) {
    createNotificationDto.tenantId = req.tenantId;
    return this.notificationsService.create(createNotificationDto);
  }

  @Post('send-sms')
  sendSMS(@Body() body: { recipient: string; message: string; clientId?: string }) {
    return this.notificationsService.sendSMS(body.recipient, body.message, body.clientId);
  }

  @Post('send-whatsapp')
  sendWhatsApp(@Body() body: { recipient: string; message: string; clientId?: string }) {
    return this.notificationsService.sendWhatsApp(body.recipient, body.message, body.clientId);
  }

  @Post('send-email')
  sendEmail(@Body() body: { recipient: string; subject: string; message: string; clientId?: string }) {
    return this.notificationsService.sendEmail(body.recipient, body.subject, body.message, body.clientId);
  }


  @Get()
  findAll(@Query('status') status: string, @Query('type') type: string, @Req() req) {
    if (status) {
      return this.notificationsService.findByStatus(status, req.tenantId);
    }
    if (type) {
      return this.notificationsService.findByType(type, req.tenantId);
    }
    return this.notificationsService.findAll(req.tenantId);
  }


  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.notificationsService.findOne(id, req.tenantId);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto, @Req() req) {
    return this.notificationsService.update(id, updateNotificationDto, req.tenantId);
  }


  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.notificationsService.remove(id, req.tenantId);
  }

  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string) {
    return this.notificationsService.findByClient(clientId);
  }

  @Get('recipient/:recipient')
  findByRecipient(@Param('recipient') recipient: string) {
    return this.notificationsService.findByRecipient(recipient);
  }
}
