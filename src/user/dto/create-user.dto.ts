// create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  IsMongoId,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  readonly password: string;

  @IsOptional()
  readonly dob?: string;

  @IsOptional()
  @IsEnum(['admin', 'tech', 'client', 'supplier', 'user', 'tenant'])
  readonly role?: 'admin' | 'tech' | 'client' | 'supplier' | 'user' | 'tenant';

  @IsOptional()
  @IsMongoId()
  readonly tenantId?: string;

  @IsOptional()
  @IsMongoId()
  readonly clientId?: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;

  @IsString()
  @IsOptional()
  readonly avatar?: string;
}
