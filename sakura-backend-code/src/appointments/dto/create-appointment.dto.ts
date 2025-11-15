import { IsString, IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator'
import { AppointmentStatus, AppointmentType } from '../entities/appointment.entity'

export class CreateAppointmentDto {
  @IsString()
  patientId: string

  @IsString()
  doctorId: string

  @IsString()
  clinicId: string

  @IsDateString()
  date: string

  @IsString()
  time: string

  @IsNumber()
  duration: number

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus

  @IsOptional()
  @IsEnum(AppointmentType)
  type?: AppointmentType

  @IsOptional()
  @IsString()
  reason?: string

  @IsOptional()
  @IsString()
  notes?: string
}

