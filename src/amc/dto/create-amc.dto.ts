export type PlanType = 'home' | '5pc' | '10pc' | '20pc';
import { IsString, IsOptional, IsDate, IsNumber, IsEnum } from 'class-validator';

export enum AMCStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export class CreateAmcDto {
  @IsEnum(['home', '5pc', '10pc', '20pc'])
  planType: PlanType;
  @IsString()
  tenantId: string;
  @IsString()
  clientId: string;

  @IsString()
  contractNumber: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(AMCStatus)
  status: AMCStatus;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsString()
  terms?: string;
}
