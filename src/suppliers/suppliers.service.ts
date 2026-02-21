import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(@InjectModel(User.name) private supplierModel: Model<User>) {}

  findAll(tenantId: string) {
    return this.supplierModel.find({ tenantId }).exec();
  }

  create(createSupplierDto: CreateSupplierDto) {
    return this.supplierModel.create(createSupplierDto);
  }
}
