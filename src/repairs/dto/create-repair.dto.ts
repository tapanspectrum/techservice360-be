import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRepairDto {
  @ApiProperty({ example: '65f0a2d9e4f13a2b4d7e8c10' })
  @IsMongoId()
  tenantId: string;

  @ApiPropertyOptional({ example: '65f0a2d9e4f13a2b4d7e8c11' })
  @IsOptional()
  @IsMongoId()
  clientId?: string;

  @ApiPropertyOptional({ example: '65f0a2d9e4f13a2b4d7e8c12' })
  @IsOptional()
  @IsMongoId()
  cctvId?: string;

  @ApiProperty({ example: 'Camera feed flickering intermittently' })
  @IsString()
  issue: string;

  @ApiPropertyOptional({ example: 'open', enum: ['open', 'in_progress', 'resolved', 'closed'] })
  @IsOptional()
  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';

  @ApiPropertyOptional({ example: 'high', enum: ['low', 'medium', 'high', 'critical'] })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority?: 'low' | 'medium' | 'high' | 'critical';

  @ApiPropertyOptional({ example: 'technician-rahul' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 1200 })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional({ example: '2026-03-05T13:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  resolvedAt?: string;
}
