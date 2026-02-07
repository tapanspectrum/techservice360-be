import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './schemas/inventory.schema';

@Injectable()
export class InventoryService {
  constructor(@InjectModel(Inventory.name) private inventoryModel: Model<Inventory>) {}

  create(createInventoryDto: CreateInventoryDto) {
    const createdInventory = new this.inventoryModel(createInventoryDto);
    return createdInventory.save();
  }

  findAll() {
    return this.inventoryModel.find().exec();
  }

  findOne(id: string) {
    return this.inventoryModel.findById(id).exec();
  }

  update(id: string, updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryModel.findByIdAndUpdate(id, updateInventoryDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.inventoryModel.findByIdAndDelete(id).exec();
  }

  findBySku(sku: string) {
    return this.inventoryModel.findOne({ sku }).exec();
  }

  findByCategory(category: string) {
    return this.inventoryModel.find({ category }).exec();
  }

  findByStatus(status: string) {
    return this.inventoryModel.find({ status }).exec();
  }

  updateQuantity(id: string, quantity: number) {
    return this.inventoryModel.findByIdAndUpdate(id, { quantity }, { new: true }).exec();
  }
}
