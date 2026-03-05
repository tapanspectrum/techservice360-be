import { IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCctvDto {
  @ApiProperty({ example: '65f0a2d9e4f13a2b4d7e8c10' })
  @IsMongoId()
  tenantId: string;

  @ApiPropertyOptional({ example: '65f0a2d9e4f13a2b4d7e8c11' })
  @IsOptional()
  @IsMongoId()
  clientId?: string;

  @ApiProperty({ example: 'Warehouse Gate 2' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ example: 'online', enum: ['online', 'offline', 'maintenance'] })
  @IsOptional()
  @IsEnum(['online', 'offline', 'maintenance'])
  status?: 'online' | 'offline' | 'maintenance';

  @ApiPropertyOptional({ example: 'Hikvision DS-2CD1043G0-I' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 'SN-99821-AX10' })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional({ example: '2026-02-15T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  lastServiceDate?: string;
}
