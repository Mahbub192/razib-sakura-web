import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { UserRole } from '../common/enums/user-role.enum'

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find({
      where: { role: UserRole.PATIENT },
      select: ['id', 'email', 'phoneNumber', 'fullName', 'avatar', 'dateOfBirth', 'gender', 'createdAt'],
    })
  }

  async findOne(id: string) {
    const patient = await this.usersRepository.findOne({
      where: { id, role: UserRole.PATIENT },
      relations: ['patientAppointments', 'patientAppointments.doctor', 'patientAppointments.clinic'],
    })
    return patient
  }

  async getAppointments(patientId: string) {
    const patient = await this.findOne(patientId)
    return patient?.patientAppointments || []
  }

  async getMedicalRecords(patientId: string) {
    // This will be implemented in MedicalRecordsService
    return []
  }
}

