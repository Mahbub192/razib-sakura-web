import { DataSource, DataSourceOptions } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'

config()

const configService = new ConfigService()

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST') || 'localhost',
  port: configService.get('DB_PORT') || 5433,
  username: configService.get('DB_USERNAME') || 'postgres',
  password: configService.get('DB_PASSWORD') || '12345',
  database: configService.get('DB_DATABASE') || 'sakura_db',
  entities: [__dirname + '/../**/*.entity.js'],
  migrations: [__dirname + '/../../migrations/*.js'],
  synchronize: configService.get('NODE_ENV') === 'development', // Only in development
  logging: configService.get('NODE_ENV') === 'development',
}

export default new DataSource(typeOrmConfig)

