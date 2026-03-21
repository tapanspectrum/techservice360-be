// update-user.dto.ts
import {
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  IsDateString,
  IsEmail,
  IsBoolean,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class UpdateUserDto {
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
  @IsEnum(['admin', 'tech', 'client', 'supplier', 'user'])
  role?: 'admin' | 'tech' | 'client' | 'supplier' | 'user';

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
  @IsArray()
  @IsMongoId({ each: true })
  favorites?: string[];
}
