import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
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
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: any, @Query('status') status?: string, @Query('type') type?: string) {
    return this.notificationsService.findForUser(req.user, { status, type });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch('mark-all-read')
  @UseGuards(AuthGuard('jwt'))
  markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsReadForUser(req.user);
  }

  @Patch(':id/check')
  @UseGuards(AuthGuard('jwt'))
  markAsChecked(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsCheckedForUser(req.user, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete('clear-all')
  @UseGuards(AuthGuard('jwt'))
  clearAll(@Req() req: any) {
    return this.notificationsService.clearAllForUser(req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }

  @Get('client/:clientId')
  @UseGuards(AuthGuard('jwt'))
  findByClient(@Req() req: any, @Param('clientId') clientId: string) {
    return this.notificationsService.findByClientForUser(req.user, clientId);
  }

  @Get('recipient/:recipient')
  @UseGuards(AuthGuard('jwt'))
  findByRecipient(@Req() req: any, @Param('recipient') recipient: string) {
    return this.notificationsService.findByRecipientForUser(req.user, recipient);
  }
}
