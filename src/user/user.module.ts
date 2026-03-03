import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from './schemas/user.schema';
import { Ticket, TicketSchema } from '../tickets/schemas/ticket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
    PassportModule,

  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    MongooseModule,     // 👈 allows other modules to inject UserModel
    UserService,
  ],
})
export class UserModule { }
