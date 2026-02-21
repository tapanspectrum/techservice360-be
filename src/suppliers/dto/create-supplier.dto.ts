import { IsString } from 'class-validator';

export class CreateSupplierDto {
  role?: string;
  password?: string;
  @IsString()
  name: string;
  @IsString()
  tenantId: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  creditDays: number;
}
