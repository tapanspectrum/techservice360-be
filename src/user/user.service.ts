import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Ticket, TicketDocument } from '../tickets/schemas/ticket.schema';
import { Repair, RepairDocument } from '../repairs/schemas/repair.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationStatus, NotificationType } from '../notifications/dto/create-notification.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    @InjectModel(Repair.name) private repairModel: Model<RepairDocument>,
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    const savedUser = await user.save();

    await this.notificationsService.create({
      type: NotificationType.EMAIL,
      recipient: savedUser.email,
      message: `User created successfully: ${savedUser.name}`,
      status: NotificationStatus.PENDING,
      clientId: savedUser.clientId?.toString(),
      referenceId: (savedUser as any)._id.toString(),
      template: 'user-create',
    });

    return savedUser;
  }

  findAll(currentUserId: string): Promise<any> {
    if (!currentUserId) {
      return this.userModel.find({});
    }

    return this.userModel.find({ _id: { $ne: currentUserId } });
  }

  async getAvailableTechs(search?: string): Promise<any[]> {
    const query: any = { role: 'technician' };

    if (search?.trim()) {
      const pattern = search.trim();
      query.$or = [
        { name: { $regex: pattern, $options: 'i' } },
        { email: { $regex: pattern, $options: 'i' } },
        { phone: { $regex: pattern, $options: 'i' } },
      ];
    }

    const techUsers = await this.userModel
      .find(query)
      .select('_id name email phone role')
      .sort({ name: 1 })
      .lean()
      .exec();

    const activeStatuses = ['open', 'in_progress'];

    const [ticketAssignments, repairAssignments] = await Promise.all([
      this.ticketModel
        .distinct('assignedTo', {
          assignedTo: { $exists: true, $ne: '' },
          status: { $in: activeStatuses },
        })
        .exec(),
      this.repairModel
        .distinct('assignedTo', {
          assignedTo: { $exists: true, $ne: '' },
          status: { $in: activeStatuses },
        })
        .exec(),
    ]);

    const assignedTechSet = new Set(
      [...ticketAssignments, ...repairAssignments]
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim().toLowerCase()),
    );

    return techUsers.filter((tech) => {
      const techName = tech.name?.trim().toLowerCase();
      const techEmail = tech.email?.trim().toLowerCase();

      return !(assignedTechSet.has(techName) || assignedTechSet.has(techEmail));
    });
  }

  async findOne(id: string): Promise<any> {
    const user = await this.userModel.findOne({ _id: id }).lean(); // ✅ await added

    console.log('user', user);

    if (!user) {
      throw new NotFoundException('User not found'); // Now this will correctly trigger
    }

    return user;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    return this.updateUserDocument(id, updateProfileDto);
  }

  async updateAdmin(id: string, updateUserAdminDto: UpdateUserAdminDto) {
    return this.updateUserDocument(id, updateUserAdminDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.updateUserDocument(id, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  private async updateUserDocument(
    id: string,
    payload: Partial<UpdateProfileDto & UpdateUserAdminDto & UpdateUserDto>,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updates = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    user.set(updates);
    return user.save();
  }
}
