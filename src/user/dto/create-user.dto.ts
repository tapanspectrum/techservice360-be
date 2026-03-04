// create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  IsDateString,
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

  @IsEnum(['admin', 'user'])
  @IsOptional()
  readonly role?: 'admin' | 'user';

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
