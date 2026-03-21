import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsMongoId,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @IsOptional()
  @IsEnum(['admin', 'tech', 'client', 'supplier', 'user'])
  role?: 'admin' | 'tech' | 'client' | 'supplier' | 'user';

  @IsOptional()
  @IsMongoId()
  tenantId?: string;

  @IsOptional()
  @IsMongoId()
  clientId?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  favorites?: string[];
}
