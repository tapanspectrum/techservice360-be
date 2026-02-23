import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { Billing } from './schemas/billing.schema';

@Injectable()
export class BillingService {
  constructor(@InjectModel(Billing.name) private readonly billingModel: Model<Billing>) {}

  get model() {
    return this.billingModel;
  }


  create(createBillingDto: CreateBillingDto) {
    if (!createBillingDto.tenantId) throw new BadRequestException('tenantId is required');
    const createdBilling = new this.billingModel(createBillingDto);
    return createdBilling.save();
  }


  findAll(tenantId: string) {
    return this.billingModel.find({ tenantId }).exec();
  }


  findOne(id: string, tenantId: string) {
    return this.billingModel.findOne({ _id: id, tenantId }).exec();
  }


  update(id: string, updateBillingDto: UpdateBillingDto, tenantId: string) {
    return this.billingModel.findOneAndUpdate({ _id: id, tenantId }, updateBillingDto, { new: true }).exec();
  }


  remove(id: string, tenantId: string) {
    return this.billingModel.findOneAndDelete({ _id: id, tenantId }).exec();
  }


  findByClient(clientId: string, tenantId: string) {
    return this.billingModel.find({ clientId, tenantId }).exec();
  }


  findByStatus(status: string, tenantId: string) {
    return this.billingModel.find({ status, tenantId }).exec();
  }

  findByProject(projectId: string) {
    return this.billingModel.find({ projectId }).exec();
  }

  findByInvoiceNumber(invoiceNumber: string) {
    return this.billingModel.findOne({ invoiceNumber }).exec();
  }
}
