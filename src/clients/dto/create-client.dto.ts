import { IsString, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateClientDto {
  role?: string;
  password?: string;
  @IsString()
  tenantId: string;
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
  companyName?: string;

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
  pincode?: string;

  @IsOptional()
  @IsString()
  industry?: string;
}
