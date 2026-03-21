import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCctvDto } from './dto/create-cctv.dto';
import { UpdateCctvDto } from './dto/update-cctv.dto';
import { Cctv, CctvDocument } from './schemas/cctv.schema';

@Injectable()
export class CctvService {
  constructor(
    @InjectModel(Cctv.name) private readonly cctvModel: Model<CctvDocument>,
  ) {}

  create(createCctvDto: CreateCctvDto) {
    const cctv = new this.cctvModel(createCctvDto);
    return cctv.save();
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
