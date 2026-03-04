import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class UpdateUserAdminDto {
  @IsOptional()
  @IsEnum(['admin', 'user'])
  role?: 'admin' | 'user';

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  favorites?: string[];
}
