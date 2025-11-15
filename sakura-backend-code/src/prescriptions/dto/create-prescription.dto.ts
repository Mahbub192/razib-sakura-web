import { IsString, IsDateString, IsArray, IsEnum, IsOptional, IsNumber } from 'class-validator'
import { PrescriptionStatus } from '../entities/prescription.entity'

export class CreatePrescriptionDto {
  @IsString()
  patientId: string

  @IsString()
  doctorId: string

  @IsArray()
  medications: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }[]

  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus

  @IsDateString()
  prescribedDate: string

  @IsOptional()
  @IsDateString()
  expiryDate?: string

  @IsOptional()
  @IsNumber()
  refillsRemaining?: number
}

