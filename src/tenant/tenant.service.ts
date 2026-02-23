import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './schemas/tenant.schema';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const tenant = new this.tenantModel(createTenantDto);
    return tenant.save();
  }

  async findAll(tenantId?: string, userRole?: string): Promise<Tenant[]> {
    const query = {};
    
    // Non-admin users can only see their own tenant
    if (userRole !== 'admin' && tenantId) {
      query['_id'] = tenantId;
    }
    
    return this.tenantModel.find(query).exec();
  }

  async findOne(id: string, tenantId?: string, userRole?: string): Promise<Tenant | null> {
    const query: any = { _id: id };
    
    // Non-admin users can only access their own tenant
    if (userRole !== 'admin' && tenantId) {
      query._id = tenantId;
    }
    
    return this.tenantModel.findOne(query).exec();
  }

  async update(
    id: string,
    updateTenantDto: UpdateTenantDto,
    tenantId?: string,
    userRole?: string,
  ): Promise<Tenant | null> {
    const query: any = { _id: id };
    
    // Non-admin users can only update their own tenant
    if (userRole !== 'admin' && tenantId) {
      query._id = tenantId;
    }
    
    return this.tenantModel
      .findOneAndUpdate(query, updateTenantDto, { new: true })
      .exec();
  }

  async remove(id: string, tenantId?: string, userRole?: string): Promise<Tenant | null> {
    const query: any = { _id: id };
    
    // Non-admin users can only delete their own tenant
    if (userRole !== 'admin' && tenantId) {
      query._id = tenantId;
    }
    
    return this.tenantModel.findOneAndDelete(query).exec();
  }

  async findByEmail(email: string): Promise<Tenant | null> {
    return this.tenantModel.findOne({ email }).exec();
  }

  async findByName(name: string): Promise<Tenant[]> {
    return this.tenantModel.find({ name: { $regex: name, $options: 'i' } }).exec();
  }

  async updateUserCount(tenantId: string, increment: number): Promise<Tenant | null> {
    return this.tenantModel
      .findByIdAndUpdate(
        tenantId,
        { $inc: { currentUsers: increment } },
        { new: true },
      )
      .exec();
  }

  async updateStorageUsage(tenantId: string, bytes: number): Promise<Tenant | null> {
    return this.tenantModel
      .findByIdAndUpdate(
        tenantId,
        { $inc: { usedStorage: bytes } },
        { new: true },
      )
      .exec();
  }
}
