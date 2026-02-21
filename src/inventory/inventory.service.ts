import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './schemas/inventory.schema';

@Injectable()
export class InventoryService {
  constructor(@InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>) {}

  get model() {
    return this.inventoryModel;
  }


  create(createInventoryDto: CreateInventoryDto) {
    if (!createInventoryDto.tenantId) throw new Error('tenantId is required');
    const createdInventory = new this.inventoryModel(createInventoryDto);
    return createdInventory.save();
  }


  findAll(tenantId: string) {
    return this.inventoryModel.find({ tenantId }).exec();
  }


  findOne(id: string, tenantId: string) {
    return this.inventoryModel.findOne({ _id: id, tenantId }).exec();
  }


  update(id: string, updateInventoryDto: UpdateInventoryDto, tenantId: string) {
    return this.inventoryModel.findOneAndUpdate({ _id: id, tenantId }, updateInventoryDto, { new: true }).exec();
  }


  remove(id: string, tenantId: string) {
    return this.inventoryModel.findOneAndDelete({ _id: id, tenantId }).exec();
  }


  findBySku(sku: string, tenantId: string) {
    return this.inventoryModel.findOne({ sku, tenantId }).exec();
  }


  findByCategory(category: string, tenantId: string) {
    return this.inventoryModel.find({ category, tenantId }).exec();
  }


  findByStatus(status: string, tenantId: string) {
    return this.inventoryModel.find({ status, tenantId }).exec();
  }

  updateQuantity(id: string, quantity: number) {
    return this.inventoryModel.findByIdAndUpdate(id, { quantity }, { new: true }).exec();
  }
}
