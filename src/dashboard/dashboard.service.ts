import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Dashboard } from './schemas/dashboard.schema';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { ClientsService } from '../clients/clients.service';
import { AmcService } from '../amc/amc.service';
import { BillingService } from '../billing/billing.service';
import { TicketsService } from '../tickets/tickets.service';
import { InventoryService } from '../inventory/inventory.service';
import { CctvService } from '../cctv/cctv.service';
import { AMCStatus } from '../amc/amc.constants';
import { TicketStatus } from '../tickets/tickets.constants';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Tenant, TenantDocument } from '../tenant/schemas/tenant.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Dashboard.name) private dashboardModel: Model<Dashboard>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    private clientsService: ClientsService,
    private amcService: AmcService,
    private billingService: BillingService,
    private ticketsService: TicketsService,
    private inventoryService: InventoryService,
    private cctvService: CctvService
  ) {}

  private buildTenantFilter(tenantId?: string | null): Record<string, unknown> {
    if (!tenantId) {
      return {};
    }

    const filters: Array<Record<string, unknown>> = [{ tenantId }];

    if (Types.ObjectId.isValid(tenantId)) {
      filters.push({ tenantId: new Types.ObjectId(tenantId) });
    }

    return filters.length === 1 ? filters[0] : { $or: filters };
  }

  private combineFilters(...filters: Array<Record<string, unknown>>): Record<string, unknown> {
    const validFilters = filters.filter((filter) => Object.keys(filter).length > 0);

    if (validFilters.length === 0) {
      return {};
    }

    if (validFilters.length === 1) {
      return validFilters[0];
    }

    return { $and: validFilters };
  }

  private buildTenantDocumentFilter(tenantId?: string | null): Record<string, unknown> {
    if (!tenantId) {
      return {};
    }

    if (Types.ObjectId.isValid(tenantId)) {
      return { _id: new Types.ObjectId(tenantId) };
    }

    return { _id: null };
  }

  async getStats(tenantId: string) {
    const tenantFilter = this.buildTenantFilter(tenantId);
    const tenantDocumentFilter = this.buildTenantDocumentFilter(tenantId);
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const activeAmcFilter: Record<string, unknown> = {
      status: { $in: [AMCStatus.ACTIVE, 'ACTIVE'] },
    };
    const monthlyRangeFilter: Record<string, unknown> = {
      createdAt: { $gte: firstDay, $lte: lastDay },
    };
    const pendingTicketFilter: Record<string, unknown> = {
      status: { $in: [TicketStatus.OPEN, 'open', 'pending'] },
    };
    const inventoryAlertFilter: Record<string, unknown> = {
      stock: { $lt: 5 },
    };
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const amcGrowthFilter: Record<string, unknown> = {
      createdAt: { $gte: sixMonthsAgo },
    };
    const cctvMonthlyDateFilter: Record<string, unknown> = {
      $or: [
        { installationDate: { $gte: firstDay, $lte: lastDay } },
        { createdAt: { $gte: firstDay, $lte: lastDay } },
      ],
    };

    // Total Clients
    const totalClients = await this.clientsService.model.countDocuments(tenantFilter);

    // Overall entity totals
    const totalTickets = await this.ticketsService.model.countDocuments(tenantFilter);
    const totalAmc = await this.amcService.model.countDocuments(tenantFilter);
    const totalCctv = await this.cctvService.model.countDocuments(tenantFilter);
    const totalUsers = await this.userModel.countDocuments(tenantFilter);
    const totalTenants = await this.tenantModel.countDocuments(tenantDocumentFilter);

    // Active AMC
    const activeAmc = await this.amcService.model.countDocuments(this.combineFilters(tenantFilter, activeAmcFilter));

    // Monthly Income (sum of billing for current month)
    const monthlyIncomeAgg = await this.billingService.model.aggregate([
      { $match: this.combineFilters(tenantFilter, monthlyRangeFilter) },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const monthlyIncome = monthlyIncomeAgg[0]?.total || 0;

    // Pending Tickets
    const pendingTickets = await this.ticketsService.model.countDocuments(
      this.combineFilters(tenantFilter, pendingTicketFilter),
    );

    // Inventory Alerts (stock < 5)
    const inventoryAlerts = await this.inventoryService.model.countDocuments(
      this.combineFilters(tenantFilter, inventoryAlertFilter),
    );

    // CCTV Projects This Month
    const cctvProjectsThisMonth = await this.cctvService.model.countDocuments(
      this.combineFilters(tenantFilter, cctvMonthlyDateFilter),
    );

    // Income vs Expense (assume billing = income, expense = negative billing or add expense model if exists)
    // For now, only income
    const incomeVsExpense = {
      income: monthlyIncome,
      expense: 0,
    };

    // AMC Growth (AMCs created per month for last 6 months)
    const amcGrowth = await this.amcService.model.aggregate([
      { $match: this.combineFilters(tenantFilter, amcGrowthFilter) },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // CCTV Revenue (sum of amount * cameras for CCTV projects this month)
    const cctvRevenueAgg = await this.cctvService.model.aggregate([
      { $match: this.combineFilters(tenantFilter, cctvMonthlyDateFilter) },
      { $group: { _id: null, total: { $sum: { $ifNull: ['$amount', 0] } } } },
    ]);
    const cctvRevenue = cctvRevenueAgg[0]?.total || 0;

    return {
      client: totalClients,
      tickets: totalTickets,
      amc: totalAmc,
      cctv: totalCctv,
      user: totalUsers,
      tenant: totalTenants,
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
