import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { Tenant } from '../tenants/schemas/tenant.schema';
import { Client } from '../clients/schemas/client.schema';
import { Cctv } from '../cctv/schemas/cctv.schema';
import { Repair } from '../repairs/schemas/repair.schema';
import { Inventory } from '../inventory/schemas/inventory.schema';
import { Ticket } from '../tickets/schemas/ticket.schema';
import { Report } from '../reports/schemas/report.schema';
import { Notification } from '../notifications/schemas/notification.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(Cctv.name) private readonly cctvModel: Model<Cctv>,
    @InjectModel(Repair.name) private readonly repairModel: Model<Repair>,
    @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  private async statusCounts(
    model: Model<any>,
    statuses: string[],
    extraFilter: Record<string, any> = {},
  ) {
    const countPairs = await Promise.all(
      statuses.map(async (status) => [
        status,
        await model.countDocuments({ ...extraFilter, status }),
      ]),
    );

    return Object.fromEntries(countPairs);
  }

  async getStatsForRole(user: { role?: string; email?: string; name?: string }) {
    const role = user?.role || 'user';

    if (role === 'admin') {
      const [
        users,
        tenants,
        clients,
        cctv,
        tickets,
        repairs,
        inventoryItems,
        reports,
        notifications,
      ] = await Promise.all([
        this.userModel.countDocuments(),
        this.tenantModel.countDocuments(),
        this.clientModel.countDocuments(),
        this.cctvModel.countDocuments(),
        this.ticketModel.countDocuments(),
        this.repairModel.countDocuments(),
        this.inventoryModel.countDocuments(),
        this.reportModel.countDocuments(),
        this.notificationModel.countDocuments(),
      ]);

      const [ticketsByStatus, repairsByStatus, cctvByStatus, notificationsByStatus] =
        await Promise.all([
          this.statusCounts(this.ticketModel, [
            'open',
            'in_progress',
            'resolved',
            'closed',
          ]),
          this.statusCounts(this.repairModel, [
            'open',
            'in_progress',
            'resolved',
            'closed',
          ]),
          this.statusCounts(this.cctvModel, ['online', 'offline', 'maintenance']),
          this.statusCounts(this.notificationModel, [
            'pending',
            'sent',
            'failed',
            'delivered',
          ]),
        ]);

      return {
        role,
        overview: {
          users,
          tenants,
          clients,
          cctv,
          tickets,
          repairs,
          inventoryItems,
          reports,
          notifications,
        },
        breakdown: {
          ticketsByStatus,
          repairsByStatus,
          cctvByStatus,
          notificationsByStatus,
        },
      };
    }

    const userFilter = {
      assignedTo: { $in: [user?.email, user?.name].filter(Boolean) },
    };

    const [
      myTickets,
      myRepairs,
      openTickets,
      openRepairs,
      offlineCctv,
      lowStockItems,
      pendingNotifications,
    ] = await Promise.all([
      this.ticketModel.countDocuments(userFilter),
      this.repairModel.countDocuments(userFilter),
      this.ticketModel.countDocuments({ status: 'open' }),
      this.repairModel.countDocuments({ status: 'open' }),
      this.cctvModel.countDocuments({ status: 'offline' }),
      this.inventoryModel.countDocuments({
        $expr: { $lte: ['$quantity', '$reorderLevel'] },
      }),
      this.notificationModel.countDocuments({ status: 'pending' }),
    ]);

    return {
      role,
      overview: {
        myTickets,
        myRepairs,
        openTickets,
        openRepairs,
        offlineCctv,
        lowStockItems,
        pendingNotifications,
      },
    };
  }
}
