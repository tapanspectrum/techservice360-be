import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCctvDto } from './dto/create-cctv.dto';
import { UpdateCctvDto } from './dto/update-cctv.dto';
import { Cctv, CctvDocument } from './schemas/cctv.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationStatus, NotificationType } from '../notifications/dto/create-notification.dto';

@Injectable()
export class CctvService {
  constructor(
    @InjectModel(Cctv.name) private readonly cctvModel: Model<CctvDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createCctvDto: CreateCctvDto) {
    const cctv = new this.cctvModel(createCctvDto);
    const savedCctv = await cctv.save();

    await this.notificationsService.create({
      type: NotificationType.EMAIL,
      recipient: 'system',
      message: `CCTV created at location: ${savedCctv.location}`,
      status: NotificationStatus.PENDING,
      clientId: savedCctv.clientId?.toString(),
      referenceId: (savedCctv as any)._id.toString(),
      template: 'cctv-create',
    });

    return savedCctv;
  }

  findAll() {
    return this.cctvModel.find().populate({
      path: 'tenantId',
      select: '_id name email',
    }).populate({
      path: 'clientId',
      select: '_id name email',
    }).exec();
  }

  findOne(id: string) {
    return this.cctvModel.findById(id).populate({
      path: 'tenantId',
      select: '_id name email',
    }).populate({
      path: 'clientId',
      select: '_id name email',
    }).exec();
  }

  update(id: string, updateCctvDto: UpdateCctvDto) {
    return this.cctvModel.findByIdAndUpdate(id, updateCctvDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.cctvModel.findByIdAndDelete(id).exec();
  }
}
