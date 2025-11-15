import { IsString, IsDateString, IsEnum, IsOptional, IsArray } from 'class-validator'
import { ShiftStatus } from '../entities/assistant-shift.entity'

export class CreateShiftDto {
  @IsString()
  assistantId: string

  @IsDateString()
  date: string

  @IsString()
  startTime: string

  @IsString()
  endTime: string

  @IsString()
  clinicId: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  associatedResources?: string[]

  @IsOptional()
  @IsEnum(ShiftStatus)
  status?: ShiftStatus

  @IsOptional()
  @IsString()
  notes?: string
}

