import { IsString, MinLength } from 'class-validator'

export class ResetPasswordDto {
  @IsString()
  phoneNumber: string

  @IsString()
  @MinLength(8)
  newPassword: string

  @IsString()
  otp: string
}

