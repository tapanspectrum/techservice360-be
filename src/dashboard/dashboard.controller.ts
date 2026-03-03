import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantGuard } from '../auth/tenant.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@Req() req) {
    return this.dashboardService.getStats(req.tenantId);
  }
}
