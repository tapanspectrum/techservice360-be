import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAmcProductDto {
  @ApiProperty({ example: '65f0a2d9e4f13a2b4d7e8c10' })
  @IsMongoId()
  tenantId: string;

  @ApiPropertyOptional({ example: '65f0a2d9e4f13a2b4d7e8c11' })
  @IsOptional()
  @IsMongoId()
  clientId?: string;

  @ApiProperty({ example: 'DVR 8 Channel' })
  @IsString()
  productName: string;

  @ApiPropertyOptional({ example: 'Hikvision DS-7208' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 'SERIAL-99887' })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @Min(0)
  productPrice: number;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'expired'] })
  @IsOptional()
  @IsEnum(['active', 'expired'])
  status?: 'active' | 'expired';

  @ApiPropertyOptional({ example: '2026-03-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2027-02-28T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
