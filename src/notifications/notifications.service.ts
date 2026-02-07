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
    const createdNotification = new this.notificationModel(createNotificationDto);
    return createdNotification.save();
  }

  findAll() {
    return this.notificationModel.find().exec();
  }

  findOne(id: string) {
    return this.notificationModel.findById(id).exec();
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.notificationModel.findByIdAndUpdate(id, updateNotificationDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.notificationModel.findByIdAndDelete(id).exec();
  }

  findByStatus(status: string) {
    return this.notificationModel.find({ status }).exec();
  }

  findByType(type: string) {
    return this.notificationModel.find({ type }).exec();
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
