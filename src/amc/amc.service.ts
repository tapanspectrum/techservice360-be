import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAmcDto } from './dto/create-amc.dto';
import { UpdateAmcDto } from './dto/update-amc.dto';
import { Amc } from './schemas/amc.schema';

@Injectable()
export class AmcService {
  constructor(@InjectModel(Amc.name) private readonly amcModel: Model<Amc>) {}

  get model() {
    return this.amcModel;
  }


  create(createAmcDto: CreateAmcDto) {
    if (!createAmcDto.tenantId) throw new Error('tenantId is required');
    const createdAmc = new this.amcModel(createAmcDto);
    return createdAmc.save();
  }


  findAll(tenantId: string) {
    return this.amcModel.find({ tenantId }).exec();
  }


  findOne(id: string, tenantId: string) {
    return this.amcModel.findOne({ _id: id, tenantId }).exec();
  }


  update(id: string, updateAmcDto: UpdateAmcDto, tenantId: string) {
    return this.amcModel.findOneAndUpdate({ _id: id, tenantId }, updateAmcDto, { new: true }).exec();
  }


  remove(id: string, tenantId: string) {
    return this.amcModel.findOneAndDelete({ _id: id, tenantId }).exec();
  }


  findByClient(clientId: string, tenantId: string) {
    return this.amcModel.find({ clientId, tenantId }).exec();
  }


  findByStatus(status: string, tenantId: string) {
    return this.amcModel.find({ status, tenantId }).exec();
  }
}
