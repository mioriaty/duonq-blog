/* eslint-disable no-console */
import { DataSource } from 'typeorm';
import { env } from '~/configs/env';
import { PostEntity } from '~/entities/post.entity';
import { UserEntity } from '~/entities/user.entity';
import { __PROD__ } from '~/utils/constants';

const postgresDB = new DataSource({
  type: 'postgres',
  ...(__PROD__
    ? { url: env.DATABASE_URL }
    : { database: env.DB_PG_NAME, username: env.DB_PG_USER, password: env.DB_PG_PASS }),
  ...(__PROD__ ? { extra: { ssl: { rejectUnauthorized: false } }, ssl: true } : {}),
  ...(__PROD__ ? {} : { synchronize: true }),
  port: env.DB_PG_PORT,
  logging: true,
  entities: [UserEntity, PostEntity]
});

export const connectPostgresDB = async () => {
  try {
    await postgresDB.initialize();
    console.log('Postgres connected');
  } catch (error) {
    console.error('Postgres connection failed');
    console.error(error);
  }
};
