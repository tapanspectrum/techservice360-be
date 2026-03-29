// create-user.dto.ts
import { IsString, IsEmail, IsOptional, IsEnum, MinLength, IsDateString, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  readonly password: string;

  @IsOptional()
  @IsDateString()
  readonly dob?: string;

  @IsOptional()
  @IsEnum(['admin', 'technician', 'supplier', 'tenant', 'accountant', 'client'])
  readonly role?: 'admin' | 'technician' | 'supplier' | 'tenant' | 'accountant' | 'client';

  @IsString()
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;

  @IsString()
  @IsOptional()
  readonly avatar?: string;

  @IsOptional()
  @IsBoolean()
  readonly isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
