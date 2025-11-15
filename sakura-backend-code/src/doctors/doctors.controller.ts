import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { DoctorsService } from './doctors.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  findAll() {
    return this.doctorsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id)
  }

  @Get(':id/appointments')
  getAppointments(@Param('id') id: string) {
    return this.doctorsService.getAppointments(id)
  }

  @Get(':id/patients')
  getPatients(@Param('id') id: string) {
    return this.doctorsService.getPatients(id)
  }
}

