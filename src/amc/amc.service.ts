import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAmcDto } from './dto/create-amc.dto';
import { UpdateAmcDto } from './dto/update-amc.dto';
import { Amc } from './schemas/amc.schema';
import { Client, ClientDocument } from '../clients/schemas/client.schema';
import { Tenant, TenantDocument } from '../tenant/schemas/tenant.schema';

@Injectable()
export class AmcService {
  constructor(
    @InjectModel(Amc.name) private readonly amcModel: Model<Amc>,
    @InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>
  ) {}

  get model() {
    return this.amcModel;
  }

  create(createAmcDto: CreateAmcDto, userRole?: string) {
    if (userRole !== 'admin' && !createAmcDto.tenantId) throw new BadRequestException('tenantId is required');
    const createdAmc = new this.amcModel(createAmcDto);
    return createdAmc.save();
  }

  private normalizeRefId(value: unknown): string | null {
    console.log('Normalizing reference ID:', value);
    if (!value) {
      return null;
    }
    if (typeof value === 'object' && value !== null && '_id' in (value as Record<string, unknown>)) {
      return String((value as { _id: unknown })._id);
    }
    return String(value);
  }

  private async mapAmcReferences<T extends { tenantId?: unknown; clientId?: unknown }>(items: T[]) {
    const tenantIds = Array.from(new Set(items.map((item) => this.normalizeRefId(item.tenantId)).filter((id): id is string => Boolean(id))));
    const clientIds = Array.from(new Set(items.map((item) => this.normalizeRefId(item.clientId)).filter((id): id is string => Boolean(id))));

    const [tenants, clients] = await Promise.all([
      this.tenantModel.find({ _id: { $in: tenantIds } }).select('_id name').lean().exec(),
      this.clientModel.find({ _id: { $in: clientIds } }).select('_id name').lean().exec(),
    ]);

    const tenantMap = new Map(tenants.map((tenant) => [String(tenant._id), { _id: String(tenant._id), name: tenant.name }]));
    const clientMap = new Map(clients.map((client) => [String(client._id), { _id: String(client._id), name: client.name }]));

    return items.map((item) => {
      const tenantRefId = this.normalizeRefId(item.tenantId);
      const clientRefId = this.normalizeRefId(item.clientId);

      return {
        ...item,
        tenantId: tenantRefId
          ? tenantMap.get(tenantRefId) ?? { _id: tenantRefId, name: null }
          : null,
        clientId: clientRefId
          ? clientMap.get(clientRefId) ?? { _id: clientRefId, name: null }
          : null,
      };
    });
  }

  async findAll(tenantId: string, userRole?: string) {
    const amcs = userRole === 'admin' ? await this.amcModel.find({}).lean().exec() : await this.amcModel.find({ tenantId }).lean().exec();
    return this.mapAmcReferences(amcs);
  }

  async findOne(id: string, tenantId: string, userRole?: string) {
    const amc = userRole === 'admin'
      ? await this.amcModel.findById(id).lean().exec()
      : await this.amcModel.findOne({ _id: id, tenantId }).lean().exec();

    if (!amc) {
      return amc;
    }

    const [mappedAmc] = await this.mapAmcReferences([amc]);
    return mappedAmc;
  }

  update(id: string, updateAmcDto: UpdateAmcDto, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.amcModel.findByIdAndUpdate(id, updateAmcDto, { new: true }).exec();
    }
    return this.amcModel.findOneAndUpdate({ _id: id, tenantId }, updateAmcDto, { new: true }).exec();
  }

  remove(id: string, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.amcModel.findByIdAndDelete(id).exec();
    }
    return this.amcModel.findOneAndDelete({ _id: id, tenantId }).exec();
  }

  findByClient(clientId: string, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.amcModel.find({ clientId }).exec();
    }
    return this.amcModel.find({ clientId, tenantId }).exec();
  }

  findByStatus(status: string, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.amcModel.find({ status }).exec();
    }
    return this.amcModel.find({ status, tenantId }).exec();
  }
}
