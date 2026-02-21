import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cctv } from './schemas/cctv.schema';
import { CreateCctvDto } from './dto/create-cctv.dto';

@Injectable()
export class CctvService {
  constructor(@InjectModel(Cctv.name) private readonly cctvModel: Model<Cctv>) {}

  get model() {
    return this.cctvModel;
  }

  findAll(tenantId: string) {
    return this.cctvModel.find({ tenantId }).exec();
  }

  create(createCctvDto: CreateCctvDto) {
    return this.cctvModel.create(createCctvDto);
  }
}
