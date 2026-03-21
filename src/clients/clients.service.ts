import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private mapUserToClient(user: any) {
    return {
      _id: user._id,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isActive: user.isVerified ?? true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private generateTemporaryPassword() {
    return `Client@${Date.now()}aA`;
  }

  async create(createClientDto: CreateClientDto) {
    if (!createClientDto.email) {
      throw new BadRequestException('email is required to create client user');
    }

    const user = new this.userModel({
      name: createClientDto.name,
      email: createClientDto.email,
      password: this.generateTemporaryPassword(),
      role: 'client',
      tenantId: createClientDto.tenantId,
      phone: createClientDto.phone,
      address: createClientDto.address,
      isVerified: createClientDto.isActive ?? true,
    });

    const created = await user.save();
    return this.mapUserToClient(created.toObject());
  }

  async findAll() {
    const users = await this.userModel
      .find({ role: 'client' })
      .select('_id tenantId name email phone address isVerified createdAt updatedAt')
      .lean()
      .exec();

    return users.map((user) => this.mapUserToClient(user));
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findOne({ _id: id, role: 'client' })
      .select('_id tenantId name email phone address isVerified createdAt updatedAt')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('Client not found');
    }

    return this.mapUserToClient(user);
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const updates: Record<string, any> = {};

    if (updateClientDto.tenantId !== undefined) updates.tenantId = updateClientDto.tenantId;
    if (updateClientDto.name !== undefined) updates.name = updateClientDto.name;
    if (updateClientDto.email !== undefined) updates.email = updateClientDto.email;
    if (updateClientDto.phone !== undefined) updates.phone = updateClientDto.phone;
    if (updateClientDto.address !== undefined) updates.address = updateClientDto.address;
    if (updateClientDto.isActive !== undefined) updates.isVerified = updateClientDto.isActive;

    const user = await this.userModel
      .findOneAndUpdate({ _id: id, role: 'client' }, updates, {
        new: true,
        runValidators: true,
      })
      .select('_id tenantId name email phone address isVerified createdAt updatedAt')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('Client not found');
    }

    return this.mapUserToClient(user);
  }

  async remove(id: string) {
    const user = await this.userModel
      .findOneAndDelete({ _id: id, role: 'client' })
      .select('_id tenantId name email phone address isVerified createdAt updatedAt')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('Client not found');
    }

    return this.mapUserToClient(user);
  }
}
