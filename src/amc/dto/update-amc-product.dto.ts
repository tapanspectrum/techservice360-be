import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAmcProductDto {
  @ApiPropertyOptional({ example: '65f0a2d9e4f13a2b4d7e8c11' })
  @IsOptional()
  @IsMongoId()
  clientId?: string;

  @ApiPropertyOptional({ example: 'INV-PROD-001' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ example: 1250 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amcAmount?: number;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'expired'] })
  @IsOptional()
  @IsIn(['active', 'expired'])
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
