import { IsEmail, IsString, IsOptional, IsArray } from 'class-validator'

export class CreateAssistantDto {
  @IsEmail()
  email: string

  @IsString()
  phoneNumber: string

  @IsString()
  fullName: string

  @IsString()
  password: string

  @IsOptional()
  @IsString()
  avatar?: string

  @IsOptional()
  @IsString()
  clinicId?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[]
}

