import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dashboard } from './schemas/dashboard.schema';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { Inject } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { AmcService } from '../amc/amc.service';
import { BillingService } from '../billing/billing.service';
import { TicketsService } from '../tickets/tickets.service';
import { InventoryService } from '../inventory/inventory.service';
import { CctvService } from '../cctv/cctv.service';

@Injectable()
export class DashboardService {

  constructor(
    @InjectModel(Dashboard.name) private dashboardModel: Model<Dashboard>,
    private clientsService: ClientsService,
    private amcService: AmcService,
    private billingService: BillingService,
    private ticketsService: TicketsService,
    private inventoryService: InventoryService,
    private cctvService: CctvService,
  ) {}

  async getStats(tenantId: string) {
    // Total Clients
    const totalClients = await this.clientsService.model.countDocuments({ tenantId });

    // Active AMC
    const activeAmc = await this.amcService.model.countDocuments({ tenantId, status: 'active' });

    // Monthly Income (sum of billing for current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const monthlyIncomeAgg = await this.billingService.model.aggregate([
      { $match: { tenantId, createdAt: { $gte: firstDay, $lte: lastDay } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const monthlyIncome = monthlyIncomeAgg[0]?.total || 0;

    // Pending Tickets
    const pendingTickets = await this.ticketsService.model.countDocuments({ tenantId, status: 'pending' });

    // Inventory Alerts (stock < 5)
    const inventoryAlerts = await this.inventoryService.model.countDocuments({ tenantId, stock: { $lt: 5 } });

    // CCTV Projects This Month
    const cctvProjectsThisMonth = await this.cctvService.model.countDocuments({ tenantId, installationDate: { $gte: firstDay, $lte: lastDay } });

    // Income vs Expense (assume billing = income, expense = negative billing or add expense model if exists)
    // For now, only income
    const incomeVsExpense = {
      income: monthlyIncome,
      expense: 0,
    };

    // AMC Growth (AMCs created per month for last 6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const amcGrowth = await this.amcService.model.aggregate([
      { $match: { tenantId, createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // CCTV Revenue (sum of amount for CCTV projects this month)
    const cctvRevenueAgg = await this.cctvService.model.aggregate([
      { $match: { tenantId, installationDate: { $gte: firstDay, $lte: lastDay } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const cctvRevenue = cctvRevenueAgg[0]?.total || 0;

    return {
      totalClients,
      activeAmc,
      monthlyIncome,
      pendingTickets,
      inventoryAlerts,
      cctvProjectsThisMonth,
      incomeVsExpense,
      amcGrowth,
      cctvRevenue,
    };
  }

  create(createDashboardDto: CreateDashboardDto) {
    return this.dashboardModel.create(createDashboardDto);
  }
}
