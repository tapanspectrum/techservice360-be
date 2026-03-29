import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client, ClientDocument } from './schemas/client.schema';

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>) {}

  async create(createClientDto: CreateClientDto) {
    const client = new this.clientModel(createClientDto);
    return client.save();
  }

  async findAll() {
    return this.clientModel.find().exec();
  }

  async findOne(id: string) {
    const client = await this.clientModel.findById(id).exec();

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientModel
      .findByIdAndUpdate(id, updateClientDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async remove(id: string) {
    const client = await this.clientModel.findByIdAndDelete(id).exec();

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }
}
