import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private mapUserToTenant(user: any) {
    return {
      _id: user._id,
      name: user.name,
      code: this.buildBaseCode(user.name),
      contactEmail: user.email,
      contactPhone: user.phone,
      address: user.address,
      isActive: user.isVerified ?? true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private buildBaseCode(name: string): string {
    const parts = (name || '').match(/[A-Za-z]+|\d+/g) || [];
    const initials = parts
      .filter((part) => /^[A-Za-z]+$/.test(part))
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    const digits = parts
      .filter((part) => /^\d+$/.test(part))
      .join('');

    const base = `${initials}${digits}`.replace(/[^A-Z0-9]/g, '');
    return base || 'TENANT';
  }

  private generateTemporaryPassword() {
    return `Tenant@${Date.now()}aA`;
  }

  async create(createTenantDto: CreateTenantDto) {
    if (!createTenantDto.contactEmail) {
      throw new BadRequestException('contactEmail is required to create tenant user');
    }

    const user = new this.userModel({
      name: createTenantDto.name,
      email: createTenantDto.contactEmail,
      password: this.generateTemporaryPassword(),
      role: 'tenant',
      phone: createTenantDto.contactPhone,
      address: createTenantDto.address,
      isVerified: createTenantDto.isActive ?? true,
    });

    const created = await user.save();
    return this.mapUserToTenant(created.toObject());
  }

  async findAll() {
    const users = await this.userModel
      .find({ role: 'tenant' })
      .select('_id name email phone address isVerified createdAt updatedAt')
      .lean()
      .exec();

    return users.map((user) => this.mapUserToTenant(user));
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findOne({ _id: id, role: 'tenant' })
      .select('_id name email phone address isVerified createdAt updatedAt')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('Tenant not found');
    }

    return this.mapUserToTenant(user);
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    const updates: Record<string, any> = {};

    if (updateTenantDto.name !== undefined) updates.name = updateTenantDto.name;
    if (updateTenantDto.contactEmail !== undefined) updates.email = updateTenantDto.contactEmail;
    if (updateTenantDto.contactPhone !== undefined) updates.phone = updateTenantDto.contactPhone;
    if (updateTenantDto.address !== undefined) updates.address = updateTenantDto.address;
    if (updateTenantDto.isActive !== undefined) updates.isVerified = updateTenantDto.isActive;

    const user = await this.userModel
      .findOneAndUpdate({ _id: id, role: 'tenant' }, updates, {
        new: true,
        runValidators: true,
      })
      .select('_id name email phone address isVerified createdAt updatedAt')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('Tenant not found');
    }

    return this.mapUserToTenant(user);
  }

  async remove(id: string) {
    const user = await this.userModel
      .findOneAndDelete({ _id: id, role: 'tenant' })
      .select('_id name email phone address isVerified createdAt updatedAt')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('Tenant not found');
    }

    return this.mapUserToTenant(user);
  }
}
