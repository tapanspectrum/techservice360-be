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
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll(): Promise<any> {
    return this.userModel.find({});
  }

  async findOne(id: string): Promise<any> {
    const user = await this.userModel.findOne({ _id: id }).lean(); // ✅ await added

    console.log('user', user);

    if (!user) {
      throw new NotFoundException('User not found'); // Now this will correctly trigger
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

  async update(id: string, updateUserDto: UpdateUserDto) {
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

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
