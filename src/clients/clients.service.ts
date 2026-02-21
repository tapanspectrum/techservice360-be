import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class ClientsService {
  constructor(@InjectModel(User.name) private readonly clientModel: Model<User>) {}

  get model() {
    return this.clientModel;
  }



  create(createClientDto: CreateClientDto, userRole?: string) {
    if (userRole !== 'admin' && !createClientDto.tenantId) throw new Error('tenantId is required');
    const createdClient = new this.clientModel(createClientDto);
    return createdClient.save();
  }



  findAll(tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.clientModel.find({}).exec();
    }
    return this.clientModel.find({ tenantId }).exec();
  }



  findOne(id: string, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.clientModel.findById(id).exec();
    }
    return this.clientModel.findOne({ _id: id, tenantId }).exec();
  }



  update(id: string, updateClientDto: UpdateClientDto, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.clientModel.findByIdAndUpdate(id, updateClientDto, { new: true }).exec();
    }
    return this.clientModel.findOneAndUpdate({ _id: id, tenantId }, updateClientDto, { new: true }).exec();
  }



  remove(id: string, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.clientModel.findByIdAndDelete(id).exec();
    }
    return this.clientModel.findOneAndDelete({ _id: id, tenantId }).exec();
  }
}
