import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Tenant, TenantSchema } from '../tenants/schemas/tenant.schema';
import { Client, ClientSchema } from '../clients/schemas/client.schema';
import { Cctv, CctvSchema } from '../cctv/schemas/cctv.schema';
import { Repair, RepairSchema } from '../repairs/schemas/repair.schema';
import { Inventory, InventorySchema } from '../inventory/schemas/inventory.schema';
import { Ticket, TicketSchema } from '../tickets/schemas/ticket.schema';
import { Report, ReportSchema } from '../reports/schemas/report.schema';
import {
  Notification,
  NotificationSchema,
} from '../notifications/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tenant.name, schema: TenantSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Cctv.name, schema: CctvSchema },
      { name: Repair.name, schema: RepairSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Ticket.name, schema: TicketSchema },
      { name: Report.name, schema: ReportSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
