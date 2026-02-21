import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }


  async create(createUserDto: CreateUserDto, userRole?: string) {
    if (userRole !== 'admin' && !createUserDto.tenantId) throw new Error('tenantId is required');
    return this.userModel.create(createUserDto);
  }



  findAll(tenantId: string, userRole?: string): Promise<any> {
    if (userRole === 'admin') {
      return this.userModel.find({});
    }
    return this.userModel.find({ tenantId });
  }



  async findOne(id: string, tenantId: string, userRole?: string): Promise<any> {
    let user;
    if (userRole === 'admin') {
      user = await this.userModel.findById(id).lean();
    } else {
      user = await this.userModel.findOne({ _id: id, tenantId }).lean();
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // async update(id: string, updateUserDto: UpdateUserDto) {
  //   const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });

  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }

  //   return user;
  // }

  async update(id: string, updateUserDto: UpdateUserDto, tenantId: string, userRole?: string) {
    // 🧠 If membership is upgraded, auto-assign expiry
    if (updateUserDto.membership) {
      const membership = updateUserDto.membership.toLowerCase();

      // Example: add expiry for paid tiers
      const expiry = new Date();
      switch (membership) {
        case 'premium':
          expiry.setDate(expiry.getDate() + 30); // 30 days
          updateUserDto.membershipExpiresAt = expiry;
          break;

        case 'top':
          expiry.setDate(expiry.getDate() + 15); // 15 days
          updateUserDto.membershipExpiresAt = expiry;
          break;

        case 'platinum':
          expiry.setDate(expiry.getDate() + 60); // 60 days plan
          updateUserDto.membershipExpiresAt = expiry;
          break;

        default:
          updateUserDto.membershipExpiresAt = null; // free plan has no expiry
      }
    }



    let user;
    if (userRole === 'admin') {
      user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    } else {
      user = await this.userModel.findOneAndUpdate(
        { _id: id, tenantId },
        updateUserDto,
        { new: true }
      );
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }


  async remove(id: string, tenantId: string, userRole?: string) {
    let user;
    if (userRole === 'admin') {
      user = await this.userModel.findByIdAndDelete(id);
    } else {
      user = await this.userModel.findOneAndDelete({ _id: id, tenantId });
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
