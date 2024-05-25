/* eslint-disable no-unused-vars */
declare namespace NodeJS {
  export interface ProcessEnv {
    readonly APP_PORT: number;
    readonly APP_HOST: string;
    readonly DATABASE_PG_NAME: string;
    readonly DB_USERNAME: string;
    readonly DB_PASSWORD: string;
    readonly DB_PG_PORT: number;
    readonly ACCESS_TOKEN_SECRET: string;
    readonly REFRESH_TOKEN_SECRET: string;
    readonly MONGODB_URI: string;
    readonly BUILD_MODE: string;
    readonly SESSION_SECTION: string;
    readonly DATABASE_URL: string;
    readonly CORS_ORIGIN_DEV: string;
    readonly CORS_ORIGIN_PROD: string;
  }
}
