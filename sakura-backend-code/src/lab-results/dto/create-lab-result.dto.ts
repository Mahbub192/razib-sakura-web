import { IsString, IsDateString, IsArray, IsOptional, IsEnum } from 'class-validator'
import { LabResultStatus } from '../entities/lab-result.entity'

export class CreateLabResultDto {
  @IsString()
  patientId: string

  @IsString()
  doctorId: string

  @IsString()
  testName: string

  @IsDateString()
  testDate: string

  @IsArray()
  results: {
    name: string
    value: string | number
    unit: string
    status: LabResultStatus
    referenceRange: string
  }[]

  @IsOptional()
  @IsString()
  doctorNotes?: string
}

