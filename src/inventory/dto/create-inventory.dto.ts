import { IsString, IsOptional, IsNumber, IsEnum, IsDate } from 'class-validator';

export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

export class CreateInventoryDto {
  @IsString()
  itemName: string;

  @IsString()
  sku: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitCost: number;

  @IsEnum(InventoryStatus)
  status: InventoryStatus;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsDate()
  lastRestocked?: Date;

  @IsOptional()
  @IsNumber()
  reorderLevel?: number;
}
