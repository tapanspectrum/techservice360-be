import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAmcProductDto } from './dto/create-amc-product.dto';
import { UpdateAmcProductDto } from './dto/update-amc-product.dto';
import { AmcProduct, AmcProductDocument } from './schemas/amc-product.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationStatus, NotificationType } from '../notifications/dto/create-notification.dto';

@Injectable()
export class AmcService {
  private static readonly FIXED_AMC_PERCENTAGE = 5;

  constructor(
    @InjectModel(AmcProduct.name)
    private readonly amcProductModel: Model<AmcProductDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createAmcProductDto: CreateAmcProductDto) {
    const product = new this.amcProductModel({
      ...createAmcProductDto,
      amcPercentage: AmcService.FIXED_AMC_PERCENTAGE,
    });

    const savedProduct = await product.save();

    await this.notificationsService.create({
      type: NotificationType.EMAIL,
      recipient: 'system',
      message: `AMC reminder setup for product ID: ${savedProduct.productId}`,
      status: NotificationStatus.PENDING,
      clientId: savedProduct.clientId?.toString(),
      referenceId: (savedProduct as any)._id.toString(),
      template: 'amc-reminder-create',
    });

    return savedProduct;
  }

  findAll() {
    return this.amcProductModel
      .find()
      .populate({
        path: 'clientId',
        select: '_id name email',
      })
      .exec();
  }

  async findOne(id: string) {
    const product = await this.amcProductModel
      .findById(id)
      .populate({
        path: 'clientId',
        select: '_id name email',
      })
      .exec();

    if (!product) {
      throw new NotFoundException('AMC product not found');
    }

    return product;
  }

  async update(id: string, updateAmcProductDto: UpdateAmcProductDto) {
    const product = await this.amcProductModel
      .findByIdAndUpdate(
        id,
        {
          ...updateAmcProductDto,
          amcPercentage: AmcService.FIXED_AMC_PERCENTAGE,
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!product) {
      throw new NotFoundException('AMC product not found');
    }

    return product;
  }

  async remove(id: string) {
    const product = await this.amcProductModel.findByIdAndDelete(id).exec();

    if (!product) {
      throw new NotFoundException('AMC product not found');
    }

    return product;
  }
}
