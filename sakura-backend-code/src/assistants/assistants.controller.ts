import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { AssistantsService } from './assistants.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('assistants')
@UseGuards(JwtAuthGuard)
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Get()
  findAll() {
    return this.assistantsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assistantsService.findOne(id)
  }
}

