import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { UserRole } from '../common/enums/user-role.enum'

@Injectable()
export class AssistantsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find({
      where: { role: UserRole.ASSISTANT },
      select: ['id', 'email', 'phoneNumber', 'fullName', 'avatar', 'permissions', 'createdAt'],
      relations: ['clinic'],
    })
  }

  async findOne(id: string) {
    return this.usersRepository.findOne({
      where: { id, role: UserRole.ASSISTANT },
      relations: ['clinic'],
    })
  }
}

