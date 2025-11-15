import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, phoneNumber, password, fullName, role } = registerDto

    // Check if user already exists
    const existingUser = await this.usersService.findByEmailOrPhone(email, phoneNumber)
    if (existingUser) {
      throw new BadRequestException('User with this email or phone number already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await this.usersService.create({
      email,
      phoneNumber,
      password: hashedPassword,
      fullName,
      role,
    })

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        role: user.role,
      },
    }
  }

  async login(loginDto: LoginDto) {
    const { phoneNumber, password } = loginDto

    // Find user by phone number
    const user = await this.usersService.findByPhoneNumber(phoneNumber)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
    }
  }

  async validateUser(userId: string) {
    return this.usersService.findOne(userId)
  }

  async verifyOTP(phoneNumber: string, otp: string) {
    // TODO: Implement OTP verification logic
    // For now, just return success
    return { verified: true }
  }

  async forgotPassword(phoneNumber: string) {
    // TODO: Implement forgot password logic
    // Send OTP to phone number
    return { message: 'OTP sent to your phone number' }
  }

  async resetPassword(phoneNumber: string, newPassword: string, otp: string) {
    // TODO: Verify OTP first
    const user = await this.usersService.findByPhoneNumber(phoneNumber)
    if (!user) {
      throw new BadRequestException('User not found')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this.usersService.update(user.id, { password: hashedPassword })

    return { message: 'Password reset successfully' }
  }
}

