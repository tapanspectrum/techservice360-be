import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from './schemas/user.schema';
import { RolesGuard } from '../auth/roles.guard';
import { Ticket, TicketSchema } from '../tickets/schemas/ticket.schema';
import { Repair, RepairSchema } from '../repairs/schemas/repair.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Ticket.name, schema: TicketSchema },
      { name: Repair.name, schema: RepairSchema },
    ]),
    PassportModule,
    NotificationsModule,

  ],
  controllers: [UserController],
  providers: [UserService, RolesGuard],
  exports: [
    MongooseModule,     // 👈 allows other modules to inject UserModel
    UserService,
  ],
})
export class UserModule { }
