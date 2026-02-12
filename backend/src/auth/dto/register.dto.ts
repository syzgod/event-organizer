import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { Transform } from 'class-transformer';

export class RegisterDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  fullName: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}
