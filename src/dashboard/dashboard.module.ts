import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dashboard, DashboardSchema } from './schemas/dashboard.schema';
import { ClientsModule } from '../clients/clients.module';
import { AmcModule } from '../amc/amc.module';
import { BillingModule } from '../billing/billing.module';
import { TicketsModule } from '../tickets/tickets.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CctvModule } from '../cctv/cctv.module';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Tenant, TenantSchema } from '../tenant/schemas/tenant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
      { name: User.name, schema: UserSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
    ClientsModule,
    AmcModule,
    BillingModule,
    TicketsModule,
    InventoryModule,
    CctvModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
