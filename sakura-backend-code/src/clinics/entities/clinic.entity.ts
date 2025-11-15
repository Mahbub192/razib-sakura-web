import { Entity, Column, OneToMany } from 'typeorm'
import { BaseEntity } from '../../common/entities/base.entity'
import { User } from '../../users/entities/user.entity'

@Entity('clinics')
export class Clinic extends BaseEntity {
  @Column()
  name: string

  @Column({ type: 'text' })
  address: string

  @Column()
  phone: string

  @Column()
  email: string

  @Column({ nullable: true })
  logo: string

  @Column({ type: 'jsonb' })
  operatingHours: {
    [key: string]: {
      open: string
      close: string
      closed?: boolean
    }
  }

  @OneToMany(() => User, (user) => user.clinic)
  doctors: User[]
}

