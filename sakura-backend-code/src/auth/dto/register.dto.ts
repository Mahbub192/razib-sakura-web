import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator'
import { UserRole } from '../../common/enums/user-role.enum'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  phoneNumber: string

  @IsString()
  @MinLength(8)
  password: string

  @IsString()
  fullName: string

  @IsEnum(UserRole)
  role: UserRole

  @IsOptional()
  @IsString()
  dateOfBirth?: string

  @IsOptional()
  @IsString()
  gender?: string
}

