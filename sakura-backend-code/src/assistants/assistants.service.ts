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
    return this.usersRepository.find({
      where: { role: UserRole.ASSISTANT },
      select: ['id', 'email', 'phoneNumber', 'fullName', 'avatar', 'permissions', 'createdAt'],
      relations: ['clinic'],
    })
  }

  async findOne(id: string) {
    const assistant = await this.usersRepository.findOne({
      where: { id, role: UserRole.ASSISTANT },
      relations: ['clinic'],
    })
    if (!assistant) {
      throw new NotFoundException(`Assistant with ID ${id} not found`)
    }
    return assistant
  }

  async create(createAssistantDto: CreateAssistantDto) {
    const hashedPassword = await bcrypt.hash(createAssistantDto.password, 10)
    const assistant = this.usersRepository.create({
      ...createAssistantDto,
      password: hashedPassword,
      role: UserRole.ASSISTANT,
    })
    return this.usersRepository.save(assistant)
  }

  async update(id: string, updateAssistantDto: UpdateAssistantDto) {
    const assistant = await this.findOne(id)
    if (updateAssistantDto.password) {
      updateAssistantDto.password = await bcrypt.hash(updateAssistantDto.password, 10)
    }
    Object.assign(assistant, updateAssistantDto)
    return this.usersRepository.save(assistant)
  }

  async remove(id: string) {
    const assistant = await this.findOne(id)
    await this.usersRepository.remove(assistant)
  }

  // Shift Management
  async getShifts(assistantId?: string, startDate?: Date, endDate?: Date) {
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

    return query.orderBy('shift.date', 'ASC').addOrderBy('shift.startTime', 'ASC').getMany()
  }

  async createShift(createShiftDto: CreateShiftDto) {
    const shift = this.shiftsRepository.create({
      ...createShiftDto,
      date: new Date(createShiftDto.date),
    })
    return this.shiftsRepository.save(shift)
  }

  async findShiftById(id: string) {
    const shift = await this.shiftsRepository.findOne({
      where: { id },
      relations: ['assistant', 'clinic'],
    })
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`)
    }
    return shift
  }

  async updateShift(id: string, updateShiftDto: UpdateShiftDto) {
    const shift = await this.findShiftById(id)
    if (updateShiftDto.date) {
      updateShiftDto.date = new Date(updateShiftDto.date) as any
    }
    Object.assign(shift, updateShiftDto)
    return this.shiftsRepository.save(shift)
  }

  async deleteShift(id: string) {
    const shift = await this.findShiftById(id)
    await this.shiftsRepository.remove(shift)
  }
}

