import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { MongooseModule } from '@nestjs/mongoose';
// import { Supplier, SupplierSchema } from './schemas/supplier.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}
