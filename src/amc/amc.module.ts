import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AmcService } from './amc.service';
import { AmcController } from './amc.controller';
import { Amc, AmcSchema } from './schemas/amc.schema';
import { Client, ClientSchema } from '../clients/schemas/client.schema';
import { Tenant, TenantSchema } from '../tenant/schemas/tenant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Amc.name, schema: AmcSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
  ],
  controllers: [AmcController],
  providers: [AmcService],
  exports: [AmcService],
})
export class AmcModule {}
