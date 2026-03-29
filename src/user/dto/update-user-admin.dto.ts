import { IsOptional, IsEnum, IsBoolean, IsString, MinLength, IsDateString, IsEmail } from 'class-validator';

export class UpdateUserAdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsEnum(['admin', 'technician', 'supplier', 'tenant', 'accountant', 'client'])
  role?: 'admin' | 'technician' | 'supplier' | 'tenant' | 'accountant' | 'client';

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
