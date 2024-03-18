import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import { getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ConfigModule } from '../../config-module/config.module';

describe('DatabaseModule Unit Tests', () => {
  describe('sqlite connection', () => {
    const connOptions = {
      DB_VENDOR: 'sqlite',
      DB_HOST: ':memory:',
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: true,
    };

    it('should be a sqlite connection', async () => {
      const module = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: true,
            validationSchema: null,
            load: [() => connOptions],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      const conn = app.get<Sequelize>(getConnectionToken());
      expect(conn).toBeDefined();
      expect(conn.options.dialect).toBe('sqlite');
      expect(conn.options.host).toBe(':memory:');
      await conn.close();
    });
  });
});
