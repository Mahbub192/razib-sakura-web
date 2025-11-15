import { IsString, IsEmail, IsObject } from 'class-validator'

export class CreateClinicDto {
  @IsString()
  name: string

  @IsString()
  address: string

  @IsString()
  phone: string

  @IsEmail()
  email: string

  @IsObject()
  operatingHours: {
    [key: string]: {
      open: string
      close: string
      closed?: boolean
    }
  }
}

