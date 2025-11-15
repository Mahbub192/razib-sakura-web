import { IsString, Length } from 'class-validator'

export class VerifyOtpDto {
  @IsString()
  phoneNumber: string

  @IsString()
  @Length(4, 6)
  otp: string
}

