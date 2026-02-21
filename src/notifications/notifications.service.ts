import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {}


  create(createNotificationDto: CreateNotificationDto) {
    if (!createNotificationDto.tenantId) throw new Error('tenantId is required');
    const createdNotification = new this.notificationModel(createNotificationDto);
    return createdNotification.save();
  }


  findAll(tenantId: string) {
    return this.notificationModel.find({ tenantId }).exec();
  }


  findOne(id: string, tenantId: string) {
    return this.notificationModel.findOne({ _id: id, tenantId }).exec();
  }


  update(id: string, updateNotificationDto: UpdateNotificationDto, tenantId: string) {
    return this.notificationModel.findOneAndUpdate({ _id: id, tenantId }, updateNotificationDto, { new: true }).exec();
  }


  remove(id: string, tenantId: string) {
    return this.notificationModel.findOneAndDelete({ _id: id, tenantId }).exec();
  }


  findByStatus(status: string, tenantId: string) {
    return this.notificationModel.find({ status, tenantId }).exec();
  }


  findByType(type: string, tenantId: string) {
    return this.notificationModel.find({ type, tenantId }).exec();
  }

  findByClient(clientId: string) {
    return this.notificationModel.find({ clientId }).exec();
  }

  findByRecipient(recipient: string) {
    return this.notificationModel.find({ recipient }).exec();
  }

  sendSMS(recipient: string, message: string, clientId?: string) {
    const notification = new this.notificationModel({
      type: 'sms',
      recipient,
      message,
      status: 'pending',
      clientId,
    });
    return notification.save();
  }

  sendWhatsApp(recipient: string, message: string, clientId?: string) {
    const notification = new this.notificationModel({
      type: 'whatsapp',
      recipient,
      message,
      status: 'pending',
      clientId,
    });
    return notification.save();
  }

  sendEmail(recipient: string, subject: string, message: string, clientId?: string) {
    const notification = new this.notificationModel({
      type: 'email',
      recipient,
      subject,
      message,
      status: 'pending',
      clientId,
    });
    return notification.save();
  }
}
