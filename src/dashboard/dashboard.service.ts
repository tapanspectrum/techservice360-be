import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { Client } from '../clients/schemas/client.schema';
import { Repair } from '../repairs/schemas/repair.schema';
import { Inventory } from '../inventory/schemas/inventory.schema';
import { Ticket } from '../tickets/schemas/ticket.schema';
import { Report } from '../reports/schemas/report.schema';
import { Notification } from '../notifications/schemas/notification.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(Repair.name) private readonly repairModel: Model<Repair>,
    @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>
  ) {}

  private async statusCounts(model: Model<any>, statuses: string[], extraFilter: Record<string, any> = {}) {
    const countPairs = await Promise.all(statuses.map(async (status) => [status, await model.countDocuments({ ...extraFilter, status })]));

    return Object.fromEntries(countPairs);
  }

  async getStatsForRole(user: { role?: string; email?: string; name?: string }) {
    const role = user?.role || 'tenant';

    if (role === 'admin') {
      const [users, admins, tenants, clients, suppliers, techs, tickets, repairs, inventoryItems, reports, notifications] = await Promise.all([
        this.userModel.countDocuments(),
        this.userModel.countDocuments({ role: 'admin' }),
        this.userModel.countDocuments({ role: 'tenant' }),
        this.userModel.countDocuments({ role: 'client' }),
        this.userModel.countDocuments({ role: 'supplier' }),
        this.userModel.countDocuments({ role: 'technician' }),
        this.ticketModel.countDocuments(),
        this.repairModel.countDocuments(),
        this.inventoryModel.countDocuments(),
        this.reportModel.countDocuments(),
        this.notificationModel.countDocuments(),
      ]);

      const [ticketsByStatus, repairsByStatus, notificationsByStatus] = await Promise.all([
        this.statusCounts(this.ticketModel, ['open', 'in_progress', 'resolved', 'closed']),
        this.statusCounts(this.repairModel, ['open', 'in_progress', 'resolved', 'closed']),
        this.statusCounts(this.notificationModel, ['pending', 'sent', 'failed', 'delivered']),
      ]);

      return {
        role,
        overview: {
          users,
          admins,
          tenants,
          clients,
          suppliers,
          techs,
          tickets,
          repairs,
          inventoryItems,
          reports,
          notifications,
        },
        breakdown: {
          ticketsByStatus,
          repairsByStatus,
          notificationsByStatus,
        },
      };
    }

    const userFilter = {
      assignedTo: { $in: [user?.email, user?.name].filter(Boolean) },
    };

    const [myTickets, myRepairs, openTickets, openRepairs, offlineCctv] = await Promise.all([
      this.ticketModel.countDocuments(userFilter),
      this.repairModel.countDocuments(userFilter),
      this.ticketModel.countDocuments({ status: 'open' }),
      this.repairModel.countDocuments({ status: 'open' }),
      this.inventoryModel.countDocuments({
        $expr: { $lte: ['$quantity', '$reorderLevel'] },
      }),
    ]);

    return {
      role,
      overview: {
        myTickets,
        myRepairs,
        openTickets,
        openRepairs,
        offlineCctv
      },
    };
  }
}
