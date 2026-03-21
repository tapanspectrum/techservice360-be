import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { Repair, RepairDocument } from './schemas/repair.schema';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class RepairsService {
  constructor(
    @InjectModel(Repair.name) private readonly repairModel: Model<RepairDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private isObjectId(value?: string): boolean {
    return !!value && Types.ObjectId.isValid(value);
  }

  private toIdString(value: any): string | undefined {
    return value?.toString?.() || value;
  }

  private async enrichRepairs(repairs: any[]) {
    if (!repairs?.length) {
      return [];
    }

    const userIds = new Set<string>();
    const assignedIdentifiers = new Set<string>();

    for (const repair of repairs) {
      const tenantId = this.toIdString(repair.tenantId);
      const clientId = this.toIdString(repair.clientId);
      const assignedToRaw = repair.assignedTo?.trim?.();

      if (tenantId && this.isObjectId(tenantId)) userIds.add(tenantId);
      if (clientId && this.isObjectId(clientId)) userIds.add(clientId);

      if (this.isObjectId(assignedToRaw)) {
        userIds.add(assignedToRaw);
      } else if (assignedToRaw) {
        assignedIdentifiers.add(assignedToRaw);
      }
    }

    const usersById = new Map<string, any>();
    if (userIds.size > 0) {
      const users = await this.userModel
        .find({ _id: { $in: Array.from(userIds) } })
        .select('_id name email')
        .lean()
        .exec();
      users.forEach((user) => usersById.set(user._id.toString(), user));
    }

    const usersByIdentifier = new Map<string, any>();
    if (assignedIdentifiers.size > 0) {
      const identifiers = Array.from(assignedIdentifiers);
      const users = await this.userModel
        .find({ $or: [{ email: { $in: identifiers } }, { name: { $in: identifiers } }] })
        .select('_id name email')
        .lean()
        .exec();

      users.forEach((user) => {
        if (user.email) usersByIdentifier.set(user.email, user);
        if (user.name) usersByIdentifier.set(user.name, user);
      });
    }

    return repairs.map((repair) => {
      const tenantId = this.toIdString(repair.tenantId);
      const clientId = this.toIdString(repair.clientId);
      const assignedToRaw = repair.assignedTo?.trim?.();

      const tenantUser = tenantId ? usersById.get(tenantId) : undefined;
      const clientUser = clientId ? usersById.get(clientId) : undefined;
      const assignedUser = this.isObjectId(assignedToRaw)
        ? usersById.get(assignedToRaw)
        : usersByIdentifier.get(assignedToRaw);

      return {
        ...repair,
        tenant: tenantUser
          ? { id: tenantUser._id.toString(), name: tenantUser.name }
          : null,
        client: clientUser
          ? { id: clientUser._id.toString(), name: clientUser.name }
          : null,
        assignedToUser: assignedUser
          ? { id: assignedUser._id.toString(), name: assignedUser.name }
          : null,
      };
    });
  }

  private async enrichRepair(repair: any) {
    if (!repair) {
      return repair;
    }

    const [enriched] = await this.enrichRepairs([repair]);
    return enriched;
  }

  async create(createRepairDto: CreateRepairDto) {
    const repair = new this.repairModel(createRepairDto);
    const created = await repair.save();
    return this.enrichRepair(created.toObject());
  }

  async findAll() {
    const repairs = await this.repairModel.find().lean().exec();
    return this.enrichRepairs(repairs);
  }

  async findOne(id: string) {
    const repair = await this.repairModel.findById(id).lean().exec();
    return this.enrichRepair(repair);
  }

  async update(id: string, updateRepairDto: UpdateRepairDto) {
    const updated = await this.repairModel
      .findByIdAndUpdate(id, updateRepairDto, { new: true })
      .lean()
      .exec();

    return this.enrichRepair(updated);
  }

  async remove(id: string) {
    const deleted = await this.repairModel.findByIdAndDelete(id).lean().exec();
    return this.enrichRepair(deleted);
  }
}
