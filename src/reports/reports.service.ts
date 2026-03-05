import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report, ReportDocument } from './schemas/report.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>,
  ) {}

  create(createReportDto: CreateReportDto) {
    const report = new this.reportModel(createReportDto);
    return report.save();
  }

  findAll() {
    return this.reportModel.find().exec();
  }

  findOne(id: string) {
    return this.reportModel.findById(id).exec();
  }

  update(id: string, updateReportDto: UpdateReportDto) {
    return this.reportModel
      .findByIdAndUpdate(id, updateReportDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.reportModel.findByIdAndDelete(id).exec();
  }
}
