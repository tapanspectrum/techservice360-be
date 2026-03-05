import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({ example: '65f0a2d9e4f13a2b4d7e8c10' })
  @IsMongoId()
  tenantId: string;

  @ApiProperty({ example: 'POE Switch 8-Port' })
  @IsString()
  itemName: string;

  @ApiPropertyOptional({ example: 'POE-8P-01' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({ example: 2450 })
  @IsOptional()
  @IsNumber()
  unitPrice?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  reorderLevel?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
