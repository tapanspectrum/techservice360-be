import { IsBoolean, IsIn, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'Acme Facilities Pvt Ltd' })
  @IsString()
  companyName: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  companyPerson?: string;

  @ApiPropertyOptional({ example: 'admin@acme.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+91-9988776655' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Park Street, Kolkata' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Kolkata' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'clinic', enum: ['stratup', 'pg', 'apartment', 'clinic'] })
  @IsOptional()
  @IsString()
  @IsIn(['stratup', 'pg', 'apartment', 'clinic'])
  type?: string;

  @ApiProperty({ example: 'Primary maintenance client' })
  @IsString()
  notes: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
