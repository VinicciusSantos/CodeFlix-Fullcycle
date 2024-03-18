import { NestFactory } from '@nestjs/core';
import { applyGlobalConfig } from './nest-modules/global-config';
import { MigrationsModule } from './nest-modules/database-module';
import { getConnectionToken } from '@nestjs/sequelize';
import { migrator } from '@core/shared/infra/db/sequelize/migrator';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MigrationsModule, { logger: ['error'] });
  const sequelize = app.get(getConnectionToken())
  await migrator(sequelize).runAsCLI()
}

bootstrap();
