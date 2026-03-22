import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AmcController } from './amc.controller';
import { AmcService } from './amc.service';
import { AmcProduct, AmcProductSchema } from './schemas/amc-product.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AmcProduct.name, schema: AmcProductSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [AmcController],
  providers: [AmcService],
  exports: [AmcService],
})
export class AmcModule {}
