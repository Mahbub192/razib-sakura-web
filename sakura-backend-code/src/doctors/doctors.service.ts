import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { UserRole } from '../common/enums/user-role.enum'

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find({
      where: { role: UserRole.DOCTOR },
      select: ['id', 'email', 'phoneNumber', 'fullName', 'avatar', 'specialty', 'bio', 'yearsOfExperience', 'createdAt'],
      relations: ['clinic'],
    })
  }

  async findOne(id: string) {
    const doctor = await this.usersRepository.findOne({
      where: { id, role: UserRole.DOCTOR },
      relations: ['clinic', 'doctorAppointments', 'doctorAppointments.patient'],
    })
    return doctor
  }

  async getAppointments(doctorId: string) {
    const doctor = await this.findOne(doctorId)
    return doctor?.doctorAppointments || []
  }

  async getPatients(doctorId: string) {
    const appointments = await this.getAppointments(doctorId)
    const uniquePatients = new Map()
    appointments.forEach((appointment) => {
      if (appointment.patient && !uniquePatients.has(appointment.patient.id)) {
        uniquePatients.set(appointment.patient.id, appointment.patient)
      }
    })
    return Array.from(uniquePatients.values())
  }
}

