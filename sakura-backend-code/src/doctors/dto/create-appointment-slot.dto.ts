import { IsString, IsDateString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator'

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export class CreateAppointmentSlotDto {
  @IsDateString()
  date: string

  @IsString()
  startTime: string

  @IsString()
  endTime: string

  @IsNumber()
  slotDuration: number // in minutes

  @IsString()
  clinicId: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  associatedResources?: string[]

  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrence?: RecurrenceType

  @IsOptional()
  @IsNumber()
  recurrenceEndDate?: number // number of occurrences or end date timestamp
}

