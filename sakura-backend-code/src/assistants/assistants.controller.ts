import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { AssistantsService } from './assistants.service'
import { CreateAssistantDto } from './dto/create-assistant.dto'
import { UpdateAssistantDto } from './dto/update-assistant.dto'
import { CreateShiftDto } from './dto/create-shift.dto'
import { UpdateShiftDto } from './dto/update-shift.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('assistants')
@ApiBearerAuth('JWT-auth')
@Controller('assistants')
@UseGuards(JwtAuthGuard)
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new assistant' })
  @ApiResponse({ status: 201, description: 'Assistant created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createAssistantDto: CreateAssistantDto) {
    return this.assistantsService.create(createAssistantDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all assistants' })
  @ApiResponse({ status: 200, description: 'List of assistants' })
  findAll() {
    return this.assistantsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assistant by ID' })
  @ApiResponse({ status: 200, description: 'Assistant details' })
  @ApiResponse({ status: 404, description: 'Assistant not found' })
  findOne(@Param('id') id: string) {
    return this.assistantsService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update assistant' })
  @ApiResponse({ status: 200, description: 'Assistant updated successfully' })
  @ApiResponse({ status: 404, description: 'Assistant not found' })
  update(@Param('id') id: string, @Body() updateAssistantDto: UpdateAssistantDto) {
    return this.assistantsService.update(id, updateAssistantDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete assistant' })
  @ApiResponse({ status: 200, description: 'Assistant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assistant not found' })
  remove(@Param('id') id: string) {
    return this.assistantsService.remove(id)
  }

  // Shift Management Endpoints
  @Get(':id/shifts')
  @ApiOperation({ summary: 'Get assistant shifts' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of shifts' })
  getShifts(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined
    return this.assistantsService.getShifts(id, start, end)
  }

  @Post(':id/shifts')
  @ApiOperation({ summary: 'Create assistant shift' })
  @ApiResponse({ status: 201, description: 'Shift created successfully' })
  createShift(@Param('id') id: string, @Body() createShiftDto: CreateShiftDto) {
    return this.assistantsService.createShift({
      ...createShiftDto,
      assistantId: id,
    })
  }

  @Get('shifts/:shiftId')
  @ApiOperation({ summary: 'Get shift by ID' })
  @ApiResponse({ status: 200, description: 'Shift details' })
  @ApiResponse({ status: 404, description: 'Shift not found' })
  getShift(@Param('shiftId') shiftId: string) {
    return this.assistantsService.findShiftById(shiftId)
  }

  @Patch('shifts/:shiftId')
  @ApiOperation({ summary: 'Update shift' })
  @ApiResponse({ status: 200, description: 'Shift updated successfully' })
  updateShift(@Param('shiftId') shiftId: string, @Body() updateShiftDto: UpdateShiftDto) {
    return this.assistantsService.updateShift(shiftId, updateShiftDto)
  }

  @Delete('shifts/:shiftId')
  @ApiOperation({ summary: 'Delete shift' })
  @ApiResponse({ status: 200, description: 'Shift deleted successfully' })
  deleteShift(@Param('shiftId') shiftId: string) {
    return this.assistantsService.deleteShift(shiftId)
  }

  // Get all shifts (for schedule management)
  @Get('shifts/all/list')
  @ApiOperation({ summary: 'Get all shifts with filters' })
  @ApiQuery({ name: 'assistantId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of all shifts' })
  getAllShifts(
    @Query('assistantId') assistantId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined
    return this.assistantsService.getShifts(assistantId, start, end)
  }
}

