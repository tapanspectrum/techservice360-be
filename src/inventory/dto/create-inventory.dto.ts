import { IsString, IsEnum, IsNumber, IsMongoId } from 'class-validator';


export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

export enum InventoryCategory {
  CCTV = 'cctv',
  HARDWARE = 'hardware',
  SPARE = 'spare',
}


export class CreateInventoryDto {
  @IsString()
  tenantId: string;
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
