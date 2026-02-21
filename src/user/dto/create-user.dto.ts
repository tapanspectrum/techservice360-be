// create-user.dto.ts
import { IsString, IsEmail, IsOptional, IsEnum, MinLength, MaxLength, IsArray, ArrayMinSize, ArrayMaxSize, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  tenantId: string;
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  readonly password: string;

  @IsEnum(['tech', 'client', 'admin', 'user'])
  @IsOptional()
  readonly role?: 'tech' | 'client' | 'admin' | 'user';

  @IsString()
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;

  @IsOptional()
  readonly location?: {
    type?: 'Point';
    coordinates?: [number, number];
  };
}
