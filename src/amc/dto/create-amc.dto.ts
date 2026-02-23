import { IsString, IsOptional, IsDate, IsNumber, IsEnum } from 'class-validator';
import { AmcPlanType, AMCStatus, PlanType } from '../amc.constants';

export class CreateAmcDto {
  @IsEnum(AmcPlanType)
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
