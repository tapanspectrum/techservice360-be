import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ example: '65f0a2d9e4f13a2b4d7e8c10' })
  @IsMongoId()
  tenantId: string;

  @ApiProperty({ example: 'ticket_summary' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'Monthly Ticket Summary - March 2026' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: '2026-03-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2026-03-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ example: 'system-admin' })
  @IsOptional()
  @IsString()
  generatedBy?: string;

  @ApiPropertyOptional({ example: { open: 12, resolved: 47 } })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiPropertyOptional({ example: 'generated', enum: ['draft', 'generated', 'failed'] })
  @IsOptional()
  @IsEnum(['draft', 'generated', 'failed'])
  status?: 'draft' | 'generated' | 'failed';
}
