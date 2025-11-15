import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { UserRole } from '../common/enums/user-role.enum'
import { MedicalRecordsService } from '../medical-records/medical-records.service'
import { LabResultsService } from '../lab-results/lab-results.service'
import { PrescriptionsService } from '../prescriptions/prescriptions.service'
import { MessagesService } from '../messages/messages.service'
import { AppointmentsService } from '../appointments/appointments.service'
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto'
import { AppointmentStatus } from '../appointments/entities/appointment.entity'
import { PrescriptionStatus } from '../prescriptions/entities/prescription.entity'

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private medicalRecordsService: MedicalRecordsService,
    private labResultsService: LabResultsService,
    private prescriptionsService: PrescriptionsService,
    private messagesService: MessagesService,
    private appointmentsService: AppointmentsService,
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
      relations: ['clinic'],
    })
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`)
    }
    return patient
  }

  async updateProfile(patientId: string, updateDto: UpdatePatientProfileDto) {
    const patient = await this.findOne(patientId)
    Object.assign(patient, updateDto)
    return this.usersRepository.save(patient)
  }

  async getAppointments(patientId: string, status?: AppointmentStatus) {
    const appointments = await this.appointmentsService.findByPatient(patientId)
    if (status) {
      return appointments.filter((apt) => apt.status === status)
    }
    return appointments
  }

  async getUpcomingAppointments(patientId: string) {
    const appointments = await this.getAppointments(patientId)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return appointments.filter(
      (apt) =>
        new Date(apt.date) >= today &&
        (apt.status === AppointmentStatus.CONFIRMED || apt.status === AppointmentStatus.PENDING),
    )
  }

  async getMedicalRecords(patientId: string, category?: string) {
    const records = await this.medicalRecordsService.findByPatient(patientId)
    if (category && category !== 'all') {
      return records.filter((record) => record.category === category)
    }
    return records
  }

  async getLabResults(patientId: string) {
    return this.labResultsService.findByPatient(patientId)
  }

  async getPrescriptions(patientId: string, status?: PrescriptionStatus) {
    const prescriptions = await this.prescriptionsService.findByPatient(patientId)
    if (status) {
      return prescriptions.filter((prescription) => prescription.status === status)
    }
    return prescriptions
  }

  async getActivePrescriptions(patientId: string) {
    return this.getPrescriptions(patientId, PrescriptionStatus.ACTIVE)
  }

  async getMessages(patientId: string) {
    return this.messagesService.getConversations(patientId)
  }

  async getDashboardData(patientId: string) {
    const [upcomingAppointments, recentLabResults, activePrescriptions, unreadMessages] = await Promise.all([
      this.getUpcomingAppointments(patientId),
      this.labResultsService.findByPatient(patientId).then((results) => results.slice(0, 3)),
      this.getActivePrescriptions(patientId),
      this.messagesService.getConversations(patientId).then((conversations) =>
        conversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
      ),
    ])

    return {
      upcomingAppointments: upcomingAppointments.slice(0, 5),
      recentLabResults,
      activePrescriptions: activePrescriptions.slice(0, 3),
      unreadMessagesCount: unreadMessages,
      totalAppointments: (await this.getAppointments(patientId)).length,
      totalMedicalRecords: (await this.getMedicalRecords(patientId)).length,
    }
  }

  async bookAppointment(patientId: string, appointmentData: any) {
    return this.appointmentsService.create({
      ...appointmentData,
      patientId,
      status: AppointmentStatus.PENDING,
    })
  }

  async cancelAppointment(patientId: string, appointmentId: string) {
    const appointment = await this.appointmentsService.findOne(appointmentId)
    if (appointment.patientId !== patientId) {
      throw new NotFoundException('Appointment not found')
    }
    return this.appointmentsService.update(appointmentId, {
      status: AppointmentStatus.CANCELLED,
    })
  }

  async rescheduleAppointment(patientId: string, appointmentId: string, newDate: string, newTime: string) {
    const appointment = await this.appointmentsService.findOne(appointmentId)
    if (appointment.patientId !== patientId) {
      throw new NotFoundException('Appointment not found')
    }
    return this.appointmentsService.update(appointmentId, {
      date: new Date(newDate) as any,
      time: newTime,
      status: AppointmentStatus.RESCHEDULED,
    })
  }

  async requestPrescriptionRefill(patientId: string, prescriptionId: string) {
    const prescription = await this.prescriptionsService.findOne(prescriptionId)
    if (prescription.patientId !== patientId) {
      throw new NotFoundException('Prescription not found')
    }
    return this.prescriptionsService.update(prescriptionId, {
      status: PrescriptionStatus.REFILL_REQUESTED,
    })
  }
}

