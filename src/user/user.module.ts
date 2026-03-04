import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from './schemas/user.schema';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,

  ],
  controllers: [UserController],
  providers: [UserService, RolesGuard],
  exports: [
    MongooseModule,     // 👈 allows other modules to inject UserModel
    UserService,
  ],
})
export class UserModule { }
