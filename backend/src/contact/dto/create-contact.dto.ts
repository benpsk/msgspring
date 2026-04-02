import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

function trimString({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim() : value;
}

function trimOptionalString({ value }: { value: unknown }) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

export class CreateContactDto {
  @Transform(trimString)
  @IsString({ message: 'Full name must be text.' })
  @MinLength(2, { message: 'Full name must be at least 2 characters.' })
  @MaxLength(120, { message: 'Full name must be 120 characters or fewer.' })
  full_name!: string;

  @Transform(trimString)
  @IsString({ message: 'Email must be text.' })
  @IsEmail({}, { message: 'Enter a valid email address.' })
  @MaxLength(320, { message: 'Email must be 320 characters or fewer.' })
  email!: string;

  @Transform(trimString)
  @IsString({ message: 'Country must be text.' })
  @MinLength(2, { message: 'Country must be at least 2 characters.' })
  @MaxLength(120, { message: 'Country must be 120 characters or fewer.' })
  country!: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString({ message: 'Message must be text.' })
  @MaxLength(2000, { message: 'Message must be 2000 characters or fewer.' })
  message?: string;
}
