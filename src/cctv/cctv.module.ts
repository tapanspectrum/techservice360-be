import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CctvController } from './cctv.controller';
import { CctvService } from './cctv.service';
import { Cctv, CctvSchema } from './schemas/cctv.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cctv.name, schema: CctvSchema }]), NotificationsModule],
  controllers: [CctvController],
  providers: [CctvService],
  exports: [CctvService],
})
export class CctvModule {}
