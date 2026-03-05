import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant, TenantDocument } from './schemas/tenant.schema';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>,
  ) {}

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

  private async generateUniqueCode(name: string): Promise<string> {
    const baseCode = this.buildBaseCode(name);
    let candidate = baseCode;
    let counter = 1;

    while (await this.tenantModel.exists({ code: candidate })) {
      counter += 1;
      candidate = `${baseCode}${counter}`;
    }

    return candidate;
  }

  async create(createTenantDto: CreateTenantDto) {
    const code = await this.generateUniqueCode(createTenantDto.name);
    const tenant = new this.tenantModel({
      ...createTenantDto,
      code,
    });
    return tenant.save();
  }

  findAll() {
    return this.tenantModel.find().exec();
  }

  findOne(id: string) {
    return this.tenantModel.findById(id).exec();
  }

  update(id: string, updateTenantDto: UpdateTenantDto) {
    return this.tenantModel
      .findByIdAndUpdate(id, updateTenantDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.tenantModel.findByIdAndDelete(id).exec();
  }
}
