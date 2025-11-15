import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AssistantsService } from './assistants.service'
import { AssistantsController } from './assistants.controller'
import { User } from '../users/entities/user.entity'
import { AssistantShift } from './entities/assistant-shift.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, AssistantShift])],
  controllers: [AssistantsController],
  providers: [AssistantsService],
  exports: [AssistantsService],
})
export class AssistantsModule {}

