import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { UserRole } from '../common/enums/user-role.enum'
import { AssistantShift } from './entities/assistant-shift.entity'
import { CreateAssistantDto } from './dto/create-assistant.dto'
import { UpdateAssistantDto } from './dto/update-assistant.dto'
import { CreateShiftDto } from './dto/create-shift.dto'
import { UpdateShiftDto } from './dto/update-shift.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AssistantsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(AssistantShift)
    private shiftsRepository: Repository<AssistantShift>,
  ) {}

  async findAll() {
    const assistants = await this.usersRepository.find({
      where: { role: UserRole.ASSISTANT },
      select: ['id', 'email', 'phoneNumber', 'fullName', 'avatar', 'permissions', 'isVerified', 'createdAt', 'updatedAt'],
      relations: ['clinic'],
    })

    // Format for frontend
    return assistants.map((assistant) => ({
      id: assistant.id,
      name: assistant.fullName || 'Unknown',
      email: assistant.email,
      phone: assistant.phoneNumber,
      role: 'assistant',
      avatar: assistant.avatar,
      isActive: assistant.isVerified !== undefined ? assistant.isVerified : true, // Use isVerified as isActive
      clinic: assistant.clinic,
      permissions: assistant.permissions,
      createdAt: assistant.createdAt,
      updatedAt: assistant.updatedAt,
    }))
  }

  async findOne(id: string, formatForFrontend: boolean = true): Promise<any> {
    const assistant = await this.usersRepository.findOne({
      where: { id, role: UserRole.ASSISTANT },
      relations: ['clinic'],
    })
    if (!assistant) {
      throw new NotFoundException(`Assistant with ID ${id} not found`)
    }

    // Return formatted for frontend or raw entity
    if (formatForFrontend) {
      return {
        id: assistant.id,
        name: assistant.fullName || 'Unknown',
        email: assistant.email,
        phone: assistant.phoneNumber,
        role: 'assistant',
        avatar: assistant.avatar,
        isActive: assistant.isVerified !== undefined ? assistant.isVerified : true, // Use isVerified as isActive
        clinic: assistant.clinic,
        permissions: assistant.permissions,
        createdAt: assistant.createdAt,
        updatedAt: assistant.updatedAt,
      }
    }

    return assistant as User
  }

  async create(createAssistantDto: CreateAssistantDto) {
    const hashedPassword = await bcrypt.hash(createAssistantDto.password, 10)
    const assistant = this.usersRepository.create({
      ...createAssistantDto,
      password: hashedPassword,
      role: UserRole.ASSISTANT,
    })
    const saved = await this.usersRepository.save(assistant)
    return this.findOne(saved.id, true) // Return formatted
  }

  async update(id: string, updateAssistantDto: UpdateAssistantDto) {
    const assistant = await this.findOne(id, false) // Get raw entity
    if (updateAssistantDto.password) {
      updateAssistantDto.password = await bcrypt.hash(updateAssistantDto.password, 10)
    }
    Object.assign(assistant, updateAssistantDto)
    const saved = await this.usersRepository.save(assistant)
    return this.findOne(saved.id, true) // Return formatted
  }

  async remove(id: string) {
    const assistant = await this.findOne(id, false) // Get raw entity
    await this.usersRepository.remove(assistant)
  }

  // Shift Management
  async getShifts(
    assistantId?: string,
    startDate?: Date,
    endDate?: Date,
    clinicLocation?: string,
  ) {
    const query = this.shiftsRepository.createQueryBuilder('shift')
      .leftJoinAndSelect('shift.assistant', 'assistant')
      .leftJoinAndSelect('shift.clinic', 'clinic')

    if (assistantId) {
      query.where('shift.assistantId = :assistantId', { assistantId })
    }

    if (startDate && endDate) {
      query.andWhere('shift.date >= :startDate', { startDate })
      query.andWhere('shift.date <= :endDate', { endDate })
    }

    if (clinicLocation) {
      query.andWhere('clinic.name = :clinicLocation OR clinic.address = :clinicLocation', {
        clinicLocation,
      })
    }

    const shifts = await query
      .orderBy('shift.date', 'ASC')
      .addOrderBy('shift.startTime', 'ASC')
      .getMany()

    // Format for frontend
    return shifts.map((shift) => ({
      id: shift.id,
      assistantId: shift.assistantId,
      assistant: shift.assistant
        ? {
            id: shift.assistant.id,
            name: shift.assistant.fullName || 'Unknown',
            email: shift.assistant.email,
            phone: shift.assistant.phoneNumber,
            avatar: shift.assistant.avatar,
          }
        : undefined,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      clinicLocation: shift.clinic?.name || shift.clinic?.address || 'Unknown Location',
      clinicId: shift.clinicId,
      clinic: shift.clinic,
      associatedResources: shift.associatedResources || [],
      status: shift.status,
      notes: shift.notes,
      createdAt: shift.createdAt,
      updatedAt: shift.updatedAt,
    }))
  }

  async createShift(createShiftDto: CreateShiftDto) {
    // If clinicLocation is provided instead of clinicId, find clinic by name/address
    let clinicId = createShiftDto.clinicId

    if (!clinicId && (createShiftDto as any).clinicLocation) {
      // This would require ClinicService - for now, we'll use clinicId
      // In a real implementation, you'd look up the clinic by name/address
    }

    const shift = this.shiftsRepository.create({
      ...createShiftDto,
      date: new Date(createShiftDto.date),
      clinicId: clinicId || createShiftDto.clinicId,
    })

    const savedShift = await this.shiftsRepository.save(shift)

    // Reload with relations for formatted response
    return this.findShiftById(savedShift.id)
  }

  async findShiftById(id: string) {
    const shift = await this.shiftsRepository.findOne({
      where: { id },
      relations: ['assistant', 'clinic'],
    })
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`)
    }

    // Format for frontend
    return {
      id: shift.id,
      assistantId: shift.assistantId,
      assistant: shift.assistant
        ? {
            id: shift.assistant.id,
            name: shift.assistant.fullName || 'Unknown',
            email: shift.assistant.email,
            phone: shift.assistant.phoneNumber,
            avatar: shift.assistant.avatar,
          }
        : undefined,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      clinicLocation: shift.clinic?.name || shift.clinic?.address || 'Unknown Location',
      clinicId: shift.clinicId,
      clinic: shift.clinic,
      associatedResources: shift.associatedResources || [],
      status: shift.status,
      notes: shift.notes,
      createdAt: shift.createdAt,
      updatedAt: shift.updatedAt,
    }
  }

  async updateShift(id: string, updateShiftDto: UpdateShiftDto) {
    const shift = await this.shiftsRepository.findOne({
      where: { id },
      relations: ['assistant', 'clinic'],
    })
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`)
    }

    if (updateShiftDto.date) {
      shift.date = new Date(updateShiftDto.date) as any
    }
    if (updateShiftDto.startTime) {
      shift.startTime = updateShiftDto.startTime
    }
    if (updateShiftDto.endTime) {
      shift.endTime = updateShiftDto.endTime
    }
    if (updateShiftDto.clinicId) {
      shift.clinicId = updateShiftDto.clinicId
    }
    if (updateShiftDto.associatedResources !== undefined) {
      shift.associatedResources = updateShiftDto.associatedResources
    }
    if (updateShiftDto.status) {
      shift.status = updateShiftDto.status
    }
    if (updateShiftDto.notes !== undefined) {
      shift.notes = updateShiftDto.notes
    }

    await this.shiftsRepository.save(shift)
    return this.findShiftById(id) // Return formatted
  }

  async deleteShift(id: string) {
    const shift = await this.shiftsRepository.findOne({
      where: { id },
    })
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`)
    }
    await this.shiftsRepository.remove(shift)
  }
}

