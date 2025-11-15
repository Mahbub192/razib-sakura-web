import { IsOptional, IsString, IsDateString, IsObject } from 'class-validator'

export class UpdatePatientProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsString()
  phoneNumber?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string

  @IsOptional()
  @IsString()
  gender?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  avatar?: string

  @IsOptional()
  @IsObject()
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

