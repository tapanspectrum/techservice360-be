import { Controller, Get, Query, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  getSummary(@Req() req) {
    return this.reportsService.getSummary(req.tenantId);
  }
}
