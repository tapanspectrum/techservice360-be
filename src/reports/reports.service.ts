import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

  getSummary(tenantId: string) {
    // Example: count reports for tenant
    return this.reportModel.countDocuments({ tenantId });
  }

  create(createReportDto: CreateReportDto) {
    return this.reportModel.create(createReportDto);
  }
}
