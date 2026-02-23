import { IsString, IsEnum, IsNumber, IsMongoId } from 'class-validator';
import { IsOptional } from 'class-validator';
import { InventoryCategory } from '../inventory.constants';


export class CreateInventoryDto {
  @IsString()
  tenantId: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsString()
  productName: string;

  @IsEnum(InventoryCategory)
  category: InventoryCategory;

  @IsNumber()
  purchasePrice: number;

  @IsNumber()
  sellingPrice: number;

  @IsNumber()
  stock: number;

  @IsMongoId()
  supplierId: string;
}
