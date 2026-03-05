import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAmcProductDto } from './dto/create-amc-product.dto';
import { UpdateAmcProductDto } from './dto/update-amc-product.dto';
import { AmcProduct, AmcProductDocument } from './schemas/amc-product.schema';

@Injectable()
export class AmcService {
  private static readonly FIXED_AMC_PERCENTAGE = 5;

  constructor(
    @InjectModel(AmcProduct.name)
    private readonly amcProductModel: Model<AmcProductDocument>,
  ) {}

  private computeAmcAmount(productPrice: number): number {
    return Number(
      ((productPrice * AmcService.FIXED_AMC_PERCENTAGE) / 100).toFixed(2),
    );
  }

  create(createAmcProductDto: CreateAmcProductDto) {
    const amcAmount = this.computeAmcAmount(createAmcProductDto.productPrice);

    const product = new this.amcProductModel({
      ...createAmcProductDto,
      amcPercentage: AmcService.FIXED_AMC_PERCENTAGE,
      amcAmount,
    });

    return product.save();
  }

  findAll() {
    return this.amcProductModel.find().exec();
  }

  findOne(id: string) {
    return this.amcProductModel.findById(id).exec();
  }

  async update(id: string, updateAmcProductDto: UpdateAmcProductDto) {
    const current = await this.amcProductModel.findById(id).exec();
    if (!current) {
      return null;
    }

    const nextPrice = updateAmcProductDto.productPrice ?? current.productPrice;
    const amcAmount = this.computeAmcAmount(nextPrice);

    return this.amcProductModel
      .findByIdAndUpdate(
        id,
        {
          ...updateAmcProductDto,
          amcPercentage: AmcService.FIXED_AMC_PERCENTAGE,
          amcAmount,
        },
        { new: true },
      )
      .exec();
  }

  remove(id: string) {
    return this.amcProductModel.findByIdAndDelete(id).exec();
  }
}
