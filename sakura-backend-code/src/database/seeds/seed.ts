import { DataSource } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { UserRole } from '../../common/enums/user-role.enum'
import * as bcrypt from 'bcryptjs'

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User)

  console.log('🌱 Starting database seeding...')

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@sakura.com' },
  })

  if (!existingAdmin) {
    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = userRepository.create({
      email: 'admin@sakura.com',
      phoneNumber: '+8801234567890',
      fullName: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
      isVerified: true,
    })
    await userRepository.save(admin)
    console.log('✅ Admin user created')
    console.log('   Email: admin@sakura.com')
    console.log('   Phone: +8801234567890')
    console.log('   Password: admin123')
  } else {
    console.log('ℹ️  Admin user already exists')
  }

  // Check if doctor already exists
  const existingDoctor = await userRepository.findOne({
    where: { email: 'doctor@sakura.com' },
  })

  if (!existingDoctor) {
    // Create Doctor User
    const doctorPassword = await bcrypt.hash('doctor123', 10)
    const doctor = userRepository.create({
      email: 'doctor@sakura.com',
      phoneNumber: '+8801234567891',
      fullName: 'Dr. Anya Sharma',
      password: doctorPassword,
      role: UserRole.DOCTOR,
      specialty: 'Cardiology',
      licenseNumber: 'DOC-12345',
      bio: 'Experienced cardiologist with 15 years of practice',
      yearsOfExperience: 15,
      isVerified: true,
    })
    await userRepository.save(doctor)
    console.log('✅ Doctor user created')
    console.log('   Email: doctor@sakura.com')
    console.log('   Phone: +8801234567891')
    console.log('   Password: doctor123')
  } else {
    console.log('ℹ️  Doctor user already exists')
  }

  // Check if patient already exists
  const existingPatient = await userRepository.findOne({
    where: { email: 'patient@sakura.com' },
  })

  if (!existingPatient) {
    // Create Patient User
    const patientPassword = await bcrypt.hash('patient123', 10)
    const patient = userRepository.create({
      email: 'patient@sakura.com',
      phoneNumber: '+8801234567892',
      fullName: 'John Doe',
      password: patientPassword,
      role: UserRole.PATIENT,
      dateOfBirth: new Date('1990-01-15'),
      gender: 'male',
      isVerified: true,
    })
    await userRepository.save(patient)
    console.log('✅ Patient user created')
    console.log('   Email: patient@sakura.com')
    console.log('   Phone: +8801234567892')
    console.log('   Password: patient123')
  } else {
    console.log('ℹ️  Patient user already exists')
  }

  // Check if assistant already exists
  const existingAssistant = await userRepository.findOne({
    where: { email: 'assistant@sakura.com' },
  })

  if (!existingAssistant) {
    // Create Assistant User
    const assistantPassword = await bcrypt.hash('assistant123', 10)
    const assistant = userRepository.create({
      email: 'assistant@sakura.com',
      phoneNumber: '+8801234567893',
      fullName: 'Jane Smith',
      password: assistantPassword,
      role: UserRole.ASSISTANT,
      permissions: ['appointments', 'patients', 'schedule'],
      isVerified: true,
    })
    await userRepository.save(assistant)
    console.log('✅ Assistant user created')
    console.log('   Email: assistant@sakura.com')
    console.log('   Phone: +8801234567893')
    console.log('   Password: assistant123')
  } else {
    console.log('ℹ️  Assistant user already exists')
  }

  console.log('')
  console.log('🎉 Database seeding completed!')
  console.log('')
  console.log('📝 Login Credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👤 ADMIN:')
  console.log('   Phone: +8801234567890')
  console.log('   Password: admin123')
  console.log('')
  console.log('👨‍⚕️ DOCTOR:')
  console.log('   Phone: +8801234567891')
  console.log('   Password: doctor123')
  console.log('')
  console.log('👤 PATIENT:')
  console.log('   Phone: +8801234567892')
  console.log('   Password: patient123')
  console.log('')
  console.log('👥 ASSISTANT:')
  console.log('   Phone: +8801234567893')
  console.log('   Password: assistant123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

