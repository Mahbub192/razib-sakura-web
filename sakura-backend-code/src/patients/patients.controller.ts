import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { PatientsService } from './patients.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll() {
    return this.patientsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id)
  }

  @Get(':id/appointments')
  getAppointments(@Param('id') id: string) {
    return this.patientsService.getAppointments(id)
  }

  @Get(':id/medical-records')
  getMedicalRecords(@Param('id') id: string) {
    return this.patientsService.getMedicalRecords(id)
  }
}

