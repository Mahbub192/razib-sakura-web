import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { UserRole } from '../common/enums/user-role.enum'
import { AppointmentsService } from '../appointments/appointments.service'
import { MedicalRecordsService } from '../medical-records/medical-records.service'
import { LabResultsService } from '../lab-results/lab-results.service'
import { PrescriptionsService } from '../prescriptions/prescriptions.service'
import { MessagesService } from '../messages/messages.service'
import { ClinicsService } from '../clinics/clinics.service'
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto'
import { CreateAppointmentSlotDto } from './dto/create-appointment-slot.dto'
import { AppointmentStatus, AppointmentType } from '../appointments/entities/appointment.entity'
import { PrescriptionStatus } from '../prescriptions/entities/prescription.entity'

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private appointmentsService: AppointmentsService,
    private medicalRecordsService: MedicalRecordsService,
    private labResultsService: LabResultsService,
    private prescriptionsService: PrescriptionsService,
    private messagesService: MessagesService,
    private clinicsService: ClinicsService,
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
      relations: ['clinic'],
    })
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`)
    }
    return doctor
  }

  async updateProfile(doctorId: string, updateDto: UpdateDoctorProfileDto) {
    const doctor = await this.findOne(doctorId)
    Object.assign(doctor, updateDto)
    return this.usersRepository.save(doctor)
  }

  async getAppointments(doctorId: string, status?: AppointmentStatus, date?: string) {
    const appointments = await this.appointmentsService.findByDoctor(doctorId)
    let filtered = appointments

    if (status) {
      filtered = filtered.filter((apt) => apt.status === status)
    }

    if (date) {
      const targetDate = new Date(date)
      targetDate.setHours(0, 0, 0, 0)
      const nextDay = new Date(targetDate)
      nextDay.setDate(nextDay.getDate() + 1)
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.date)
        aptDate.setHours(0, 0, 0, 0)
        return aptDate >= targetDate && aptDate < nextDay
      })
    }

    return filtered
  }

  async getTodayAppointments(doctorId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return this.getAppointments(doctorId, undefined, today.toISOString())
  }

  async getUpcomingAppointments(doctorId: string) {
    const appointments = await this.getAppointments(doctorId)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return appointments.filter(
      (apt) =>
        new Date(apt.date) >= today &&
        (apt.status === AppointmentStatus.CONFIRMED || apt.status === AppointmentStatus.PENDING),
    )
  }

  async getAppointmentsByDateRange(doctorId: string, startDate: string, endDate: string) {
    const appointments = await this.appointmentsService.findByDoctor(doctorId)
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      return aptDate >= start && aptDate <= end
    })
  }

  async updateAppointmentStatus(doctorId: string, appointmentId: string, status: AppointmentStatus) {
    const appointment = await this.appointmentsService.findOne(appointmentId)
    if (appointment.doctorId !== doctorId) {
      throw new NotFoundException('Appointment not found')
    }
    return this.appointmentsService.update(appointmentId, { status })
  }

  async confirmAppointment(doctorId: string, appointmentId: string) {
    return this.updateAppointmentStatus(doctorId, appointmentId, AppointmentStatus.CONFIRMED)
  }

  async cancelAppointment(doctorId: string, appointmentId: string) {
    return this.updateAppointmentStatus(doctorId, appointmentId, AppointmentStatus.CANCELLED)
  }

  async getPatients(doctorId: string, search?: string, page: number = 1, limit: number = 10) {
    const appointments = await this.appointmentsService.findByDoctor(doctorId)
    const uniquePatients = new Map<string, any>()

    appointments.forEach((appointment) => {
      if (appointment.patient && !uniquePatients.has(appointment.patient.id)) {
        uniquePatients.set(appointment.patient.id, {
          id: appointment.patient.id,
          name: appointment.patient.fullName,
          avatar: appointment.patient.fullName?.charAt(0) || '?',
          phone: appointment.patient.phoneNumber,
          email: appointment.patient.email,
          dob: appointment.patient.dateOfBirth,
          lastAppointment: appointment.date,
          lastVisit: new Date(appointment.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          totalAppointments: 1,
        })
      } else if (appointment.patient) {
        const patient = uniquePatients.get(appointment.patient.id)
        patient.totalAppointments += 1
        if (new Date(appointment.date) > new Date(patient.lastAppointment)) {
          patient.lastAppointment = appointment.date
          patient.lastVisit = new Date(appointment.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        }
      }
    })

    let patients = Array.from(uniquePatients.values())

    if (search) {
      const searchLower = search.toLowerCase()
      patients = patients.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(searchLower) ||
          patient.email?.toLowerCase().includes(searchLower) ||
          patient.phone?.includes(search) ||
          patient.id?.toLowerCase().includes(searchLower),
      )
    }

    // Sort by last appointment date (newest first)
    patients.sort((a, b) => new Date(b.lastAppointment).getTime() - new Date(a.lastAppointment).getTime())

    // Pagination
    const total = patients.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPatients = patients.slice(startIndex, endIndex)

    return {
      patients: paginatedPatients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getPatientDetails(doctorId: string, patientId: string) {
    const patient = await this.usersRepository.findOne({
      where: { id: patientId, role: UserRole.PATIENT },
    })
    if (!patient) {
      throw new NotFoundException('Patient not found')
    }

    const [appointments, medicalRecords, labResults, prescriptions] = await Promise.all([
      this.appointmentsService.findByDoctor(doctorId).then((apts) =>
        apts.filter((apt) => apt.patientId === patientId),
      ),
      this.medicalRecordsService.findByPatient(patientId),
      this.labResultsService.findByPatient(patientId),
      this.prescriptionsService.findByPatient(patientId),
    ])

    return {
      patient,
      appointments,
      medicalRecords,
      labResults,
      prescriptions,
    }
  }

  async getDashboardData(doctorId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get start of week (Sunday)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    // Get end of week (Saturday)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const [
      todayAppointments,
      upcomingAppointments,
      weeklyAppointments,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      unreadMessages,
      yesterdayAppointments,
    ] = await Promise.all([
      this.getTodayAppointments(doctorId).then((apts) =>
        apts.map((apt) => ({
          id: apt.id,
          time: apt.time,
          patientName: apt.patient?.fullName || 'Unknown',
          patientInitial: apt.patient?.fullName?.charAt(0) || '?',
          reason: apt.reason || apt.type,
          status: apt.status,
          patient: apt.patient,
        })),
      ),
      this.getUpcomingAppointments(doctorId).then((apts) => apts.slice(0, 5)),
      this.getAppointmentsByDateRange(doctorId, startOfWeek.toISOString(), endOfWeek.toISOString()),
      this.getPatients(doctorId).then((result) => result.pagination.total),
      this.appointmentsService.findByDoctor(doctorId).then((apts) => apts.length),
      this.getAppointments(doctorId, AppointmentStatus.PENDING).then((apts) => apts.length),
      this.getAppointments(doctorId, AppointmentStatus.COMPLETED).then((apts) => apts.length),
      this.messagesService.getConversations(doctorId).then((conversations) =>
        conversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
      ),
      (() => {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return this.getAppointments(doctorId, undefined, yesterday.toISOString()).then((apts) => apts.length)
      })(),
    ])

    // Calculate weekly chart data
    const weeklyChartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
      const dayDate = new Date(startOfWeek)
      dayDate.setDate(startOfWeek.getDate() + (index === 0 ? 0 : index))
      const dayAppointments = weeklyAppointments.filter((apt) => {
        const aptDate = new Date(apt.date)
        return aptDate.toDateString() === dayDate.toDateString()
      })
      return {
        day,
        count: dayAppointments.length,
      }
    })

    // Calculate patient growth (mock for now)
    const patientGrowth = 1.5 // This would come from historical data

    // Calculate appointment change vs yesterday
    const appointmentChange = todayAppointments.length - yesterdayAppointments
    const appointmentChangePercent = yesterdayAppointments > 0
      ? parseFloat(((appointmentChange / yesterdayAppointments) * 100).toFixed(1))
      : 0

    return {
      todayAppointments,
      upcomingAppointments,
      weeklyChartData,
      statistics: {
        totalPatients,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        unreadMessages,
        appointmentsToday: todayAppointments.length,
        patientGrowth,
        appointmentChangePercent,
      },
    }
  }

  async getReports(doctorId: string, startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date()
    start.setMonth(start.getMonth() - 1) // Default to last month
    start.setHours(0, 0, 0, 0)
    const end = endDate ? new Date(endDate) : new Date()
    end.setHours(23, 59, 59, 999)

    const [appointments, allPatients] = await Promise.all([
      this.getAppointmentsByDateRange(doctorId, start.toISOString(), end.toISOString()),
      this.getPatients(doctorId),
    ])

    const completedAppointments = appointments.filter((apt) => apt.status === AppointmentStatus.COMPLETED)
    const missedCancelled = appointments.filter(
      (apt) => apt.status === AppointmentStatus.CANCELLED,
    )

    const appointmentsByStatus = appointments.reduce(
      (acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const appointmentsByType = appointments.reduce(
      (acc, apt) => {
        acc[apt.type] = (acc[apt.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const appointmentsByDate = appointments.reduce((acc, apt) => {
      const date = new Date(apt.date).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate completion rate
    const completionRate = appointments.length > 0
      ? parseFloat(((completedAppointments.length / appointments.length) * 100).toFixed(1))
      : 0

    // Calculate revenue (mock: $150 per completed appointment)
    const revenue = completedAppointments.length * 150
    const avgRevenuePerAppointment = completedAppointments.length > 0 ? revenue / completedAppointments.length : 0

    // Get previous period for comparison
    const previousStart = new Date(start)
    previousStart.setMonth(previousStart.getMonth() - 1)
    const previousEnd = new Date(start)
    previousEnd.setDate(previousEnd.getDate() - 1)
    const previousAppointments = await this.getAppointmentsByDateRange(
      doctorId,
      previousStart.toISOString(),
      previousEnd.toISOString(),
    )

    const appointmentChange = appointments.length - previousAppointments.length
    const appointmentChangePercent = previousAppointments.length > 0
      ? parseFloat(((appointmentChange / previousAppointments.length) * 100).toFixed(1))
      : 0

    // Patient demographics (mock - would need actual patient data)
    const patientDemographics = {
      '0-18': 15,
      '19-45': 45,
      '46+': 40,
    }

    return {
      period: { start: start.toISOString(), end: end.toISOString() },
      keyMetrics: {
        totalAppointments: appointments.length,
        completed: completedAppointments.length,
        missedCancelled: missedCancelled.length,
        revenue,
        completionRate,
        avgRevenuePerAppointment,
        appointmentChangePercent,
      },
      appointmentsByStatus,
      appointmentsByType,
      appointmentsByDate,
      patientDemographics,
    }
  }

  async getMessages(doctorId: string) {
    return this.messagesService.getConversations(doctorId)
  }

  async createAppointmentSlot(doctorId: string, slotData: CreateAppointmentSlotDto) {
    // This would typically create slots in a separate slots table
    // For now, we'll return a mock response
    return {
      id: `slot-${Date.now()}`,
      doctorId,
      ...slotData,
      createdAt: new Date(),
    }
  }

  async getAppointmentSlots(doctorId: string, startDate?: string, endDate?: string) {
    // This would fetch from a slots table
    // For now, return mock data
    return []
  }

  async createMedicalRecord(doctorId: string, patientId: string, recordData: any) {
    return this.medicalRecordsService.create({
      ...recordData,
      patientId,
      doctorId,
    })
  }

  async createLabResult(doctorId: string, patientId: string, labData: any) {
    return this.labResultsService.create({
      ...labData,
      patientId,
      doctorId,
    })
  }

  async createPrescription(doctorId: string, patientId: string, prescriptionData: any) {
    return this.prescriptionsService.create({
      ...prescriptionData,
      patientId,
      doctorId,
      status: PrescriptionStatus.ACTIVE,
    })
  }
}

