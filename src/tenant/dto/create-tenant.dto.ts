import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { TenantStatus } from '../schemas/tenant.schema';

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  subscriptionPlan?: string;

  @IsOptional()
  @IsNumber()
  maxUsers?: number;

  @IsOptional()
  @IsNumber()
  storageLimit?: number;

  @IsOptional()
  subscriptionStartDate?: string;

  @IsOptional()
  subscriptionEndDate?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
