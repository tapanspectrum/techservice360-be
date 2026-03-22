import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationStatus } from './schemas/notification.schema';

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

  findForUser(user: any, filters: { status?: string; type?: string }) {
    const query: any = {
      isChecked: { $ne: true },
    };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (user?.role === 'admin') {
      return this.notificationModel.find(query).exec();
    }

    const userScopeQuery = this.buildUserScopeQuery(user);

    if (userScopeQuery._id === null) {
      return this.notificationModel.find({ _id: null }).exec();
    }

    return this.notificationModel.find({ ...query, ...userScopeQuery }).exec();
  }

  findOne(id: string) {
    return this.notificationModel.findById(id).exec();
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    if (updateNotificationDto.isChecked === true && !updateNotificationDto.status) {
      updateNotificationDto.status = NotificationStatus.READ;
    }

    return this.notificationModel.findByIdAndUpdate(id, updateNotificationDto, { new: true }).exec();
  }

  async markAsCheckedForUser(user: any, id: string) {
    const notification = await this.notificationModel.findById(id).exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (!this.canAccessNotification(user, notification)) {
      throw new ForbiddenException('You are not allowed to access this notification');
    }

    if (notification.isChecked) {
      return notification;
    }

    notification.isChecked = true;
    notification.status = NotificationStatus.READ;
    return notification.save();
  }

  async markAllAsReadForUser(user: any) {
    const scopeQuery = this.buildUserScopeQuery(user);
    const filter = user?.role === 'admin'
      ? { isChecked: { $ne: true } }
      : { ...scopeQuery, isChecked: { $ne: true } };

    const result = await this.notificationModel.updateMany(
      filter,
      {
        $set: {
          isChecked: true,
          status: NotificationStatus.READ,
        },
      },
    ).exec();

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  async clearAllForUser(user: any) {
    const scopeQuery = this.buildUserScopeQuery(user);
    const filter = user?.role === 'admin' ? {} : scopeQuery;
    const result = await this.notificationModel.deleteMany(filter).exec();

    return {
      deletedCount: result.deletedCount,
    };
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

  findByClientForUser(user: any, clientId: string) {
    if (user?.role === 'admin') {
      return this.findByClient(clientId);
    }

    const userClientIds = [user?.clientId, user?._id, user?.id].filter(Boolean).map((value) => value.toString());

    if (!userClientIds.includes(clientId)) {
      return this.notificationModel.find({ _id: null }).exec();
    }

    return this.notificationModel.find({ clientId, isChecked: { $ne: true } }).exec();
  }

  findByRecipientForUser(user: any, recipient: string) {
    if (user?.role === 'admin') {
      return this.findByRecipient(recipient);
    }

    const recipients = [user?.email, user?.phone].filter(Boolean);

    if (!recipients.includes(recipient)) {
      return this.notificationModel.find({ _id: null }).exec();
    }

    return this.notificationModel.find({ recipient, isChecked: { $ne: true } }).exec();
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

  private canAccessNotification(user: any, notification: Notification) {
    if (user?.role === 'admin') {
      return true;
    }

    const userClientIds = [user?.clientId, user?._id, user?.id]
      .filter(Boolean)
      .map((value) => value.toString());
    const recipients = [user?.email, user?.phone].filter(Boolean);
    const notificationClientId = notification.clientId?.toString();

    if (notificationClientId && userClientIds.includes(notificationClientId)) {
      return true;
    }

    return !!notification.recipient && recipients.includes(notification.recipient);
  }

  private buildUserScopeQuery(user: any) {
    const userClientIds = [user?.clientId, user?._id, user?.id]
      .filter(Boolean)
      .map((value) => value.toString());
    const recipients = [user?.email, user?.phone].filter(Boolean);
    const userScope: any[] = [];

    if (userClientIds.length > 0) {
      userScope.push({ clientId: { $in: userClientIds } });
    }

    if (recipients.length > 0) {
      userScope.push({ recipient: { $in: recipients } });
    }

    if (userScope.length === 0) {
      return { _id: null };
    }

    return { $or: userScope };
  }
}
