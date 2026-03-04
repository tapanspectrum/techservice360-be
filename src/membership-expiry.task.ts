// src/tasks/membership-expiry.task.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user/schemas/user.schema';

@Injectable()
export class MembershipExpiryTask {
  private readonly logger = new Logger(MembershipExpiryTask.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleMembershipExpiry() {
    console.log('Running membership expiry task...');
    const now = new Date();
    const expiredUsers = await this.userModel.find({
      membershipExpiresAt: { $lte: now },
      membership: { $ne: 'free' },
    });

    // for (const user of expiredUsers) {
    //   user.membership = 'free';
    //   user.membershipExpiresAt = null;
    //   await user.save();
    // }

    this.logger.log(`✅ Downgraded ${expiredUsers.length} expired users.`);
  }
}
