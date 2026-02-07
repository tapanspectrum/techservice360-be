import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { Billing } from './schemas/billing.schema';

@Injectable()
export class BillingService {
  constructor(@InjectModel(Billing.name) private billingModel: Model<Billing>) {}

  create(createBillingDto: CreateBillingDto) {
    const createdBilling = new this.billingModel(createBillingDto);
    return createdBilling.save();
  }

  findAll() {
    return this.billingModel.find().exec();
  }

  findOne(id: string) {
    return this.billingModel.findById(id).exec();
  }

  update(id: string, updateBillingDto: UpdateBillingDto) {
    return this.billingModel.findByIdAndUpdate(id, updateBillingDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.billingModel.findByIdAndDelete(id).exec();
  }

  findByClient(clientId: string) {
    return this.billingModel.find({ clientId }).exec();
  }

  findByStatus(status: string) {
    return this.billingModel.find({ status }).exec();
  }

  findByProject(projectId: string) {
    return this.billingModel.find({ projectId }).exec();
  }

  findByInvoiceNumber(invoiceNumber: string) {
    return this.billingModel.findOne({ invoiceNumber }).exec();
  }
}
