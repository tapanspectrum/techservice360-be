import { IsString, IsOptional, IsNumber, IsDate, IsEnum } from 'class-validator';
import { BillingStatus } from '../billing.constants';

export class CreateBillingDto {
  @IsString()
  tenantId: string;
  @IsString()
  invoiceNumber: string;

  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsDate()
  invoiceDate: Date;

  @IsDate()
  dueDate: Date;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  taxAmount?: number;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsEnum(BillingStatus)
  status: BillingStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  paymentTerms?: string;
}
