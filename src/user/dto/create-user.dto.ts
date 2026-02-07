// create-user.dto.ts
import { IsString, IsEmail, IsOptional, IsEnum, MinLength, MaxLength, IsArray, ArrayMinSize, ArrayMaxSize, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  readonly password: string;

  @IsEnum(['donor', 'receiver', 'admin'])
  @IsOptional()
  readonly role?: 'donor' | 'receiver' | 'admin';

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
