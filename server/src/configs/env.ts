import dotenv from 'dotenv';
dotenv.config();

export const env = {
  APP_PORT: Number(process.env.APP_PORT),
  APP_HOST: process.env.APP_HOST,
  DB_PG_NAME: process.env.DATABASE_PG_NAME,
  DB_PG_USER: process.env.DB_USERNAME,
  DB_PG_PASS: process.env.DB_PASSWORD,
  DB_PG_PORT: Number(process.env.DB_PG_PORT),
  BUILD_MODE: process.env.BUILD_MODE,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  MONGODB_URI: process.env.MONGODB_URI as string,
  SESSION_SECRET: process.env.SESSION_SECRET as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  CORS_ORIGIN_DEV: process.env.CORS_ORIGIN_DEV as string,
  CORS_ORIGIN_PROD: process.env.CORS_ORIGIN_PROD as string
};
