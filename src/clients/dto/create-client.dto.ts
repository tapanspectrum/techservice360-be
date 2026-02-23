import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsMongoId, IsIn } from 'class-validator';

export class CreateClientDto {
  @IsOptional()
  tenantId?: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsIn(['office', 'pg', 'shop', 'apartment'])
  type?: 'office' | 'pg' | 'shop' | 'apartment';

  @IsOptional()
  @IsString()
  createdby?: string;
}
