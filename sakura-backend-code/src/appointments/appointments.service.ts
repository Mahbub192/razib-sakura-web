import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Appointment } from './entities/appointment.entity'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { UpdateAppointmentDto } from './dto/update-appointment.dto'

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentsRepository.create(createAppointmentDto)
    return this.appointmentsRepository.save(appointment)
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      relations: ['patient', 'doctor', 'clinic'],
      order: { date: 'ASC', time: 'ASC' },
    })
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'clinic'],
    })
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`)
    }
    return appointment
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { patientId },
      relations: ['doctor', 'clinic'],
      order: { date: 'ASC', time: 'ASC' },
    })
  }

  async findByDoctor(doctorId: string): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { doctorId },
      relations: ['patient', 'clinic'],
      order: { date: 'ASC', time: 'ASC' },
    })
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id)
    Object.assign(appointment, updateAppointmentDto)
    return this.appointmentsRepository.save(appointment)
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id)
    await this.appointmentsRepository.remove(appointment)
  }
}

