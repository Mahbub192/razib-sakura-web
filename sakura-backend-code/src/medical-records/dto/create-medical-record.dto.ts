import { IsString, IsDateString, IsEnum, IsOptional, IsArray } from 'class-validator'
import { MedicalRecordCategory } from '../entities/medical-record.entity'

export class CreateMedicalRecordDto {
  @IsString()
  patientId: string

  @IsString()
  doctorId: string

  @IsEnum(MedicalRecordCategory)
  category: MedicalRecordCategory

  @IsString()
  title: string

  @IsString()
  description: string

  @IsDateString()
  date: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[]
}

