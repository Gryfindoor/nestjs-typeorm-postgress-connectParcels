import * as dotenv from 'dotenv';
dotenv.config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const { DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST } = process.env;

export const typeormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `${DB_HOST}`,
  port: 5432,
  username: `${DB_USERNAME}`,
  password: `${DB_PASSWORD}`,
  database: `${DB_DATABASE}`,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: false,
};
