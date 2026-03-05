import { IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateCctvDto {
  @IsOptional()
  @IsMongoId()
  tenantId?: string;

  @IsOptional()
  @IsMongoId()
  clientId?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(['online', 'offline', 'maintenance'])
  status?: 'online' | 'offline' | 'maintenance';

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsDateString()
  lastServiceDate?: string;
}
