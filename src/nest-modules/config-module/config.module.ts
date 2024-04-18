import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
} from '@nestjs/config';
import { join } from 'path';
import Joi from 'joi';
import * as process from 'process';

const joiJson = Joi.extend((joi) => {
  return {
    type: 'object',
    base: joi.object(),
    coerce(
      value,
      _schema,
    ) {
      if (value[0] !== '{' && !/^\s*\{/.test(value)) {
        return;
      }

      try {
        return { value: JSON.parse(value) };
      } catch (err) {
        console.error(err);
      }
    },
  };
});

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;

export interface DB_SCHEMA_TYPE {
  DB_VENDOR: 'mysql' | 'sqlite';
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_LOGGING: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
}

export interface CONFIG_GOOGLE_SCHEMA_TYPE {
  GOOGLE_CLOUD_CREDENTIALS: object;
  GOOGLE_CLOUD_STORAGE_BUCKET_NAME: string;
}

export const GOOGLE_CLOUD_SCHEMA: Joi.StrictSchemaMap<CONFIG_GOOGLE_SCHEMA_TYPE> = {
  GOOGLE_CLOUD_CREDENTIALS: joiJson.object().required(),
  GOOGLE_CLOUD_STORAGE_BUCKET_NAME: Joi.string().required(),
};

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: Joi.string().required().valid('mysql', 'sqlite'),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_USERNAME: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_PORT: Joi.number().integer().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_LOGGING: Joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
};

@Module({})
export class ConfigModule
  extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}) {
    const {
      envFilePath,
      ...otherOptions
    } = options;
    return super.forRoot({
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath : [envFilePath]),
        join(process.cwd(), 'envs', `.env.${ process.env.NODE_ENV }`),
        join(process.cwd(), 'envs', `.env`),
      ],
      isGlobal: true,
      validationSchema: Joi.object({
        ...CONFIG_DB_SCHEMA,
        ...GOOGLE_CLOUD_SCHEMA,
      }),
      ...otherOptions,
    });
  }
}
