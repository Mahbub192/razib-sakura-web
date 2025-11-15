import { IsOptional, IsString, IsNumber, IsObject } from 'class-validator'

export class UpdateDoctorProfileDto {
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
  @IsString()
  specialty?: string

  @IsOptional()
  @IsString()
  bio?: string

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number

  @IsOptional()
  @IsString()
  avatar?: string

  @IsOptional()
  @IsObject()
  qualifications?: {
    degree: string
    university: string
    year: number
  }[]

  @IsOptional()
  @IsObject()
  availability?: {
    days: string[]
    startTime: string
    endTime: string
  }
}

