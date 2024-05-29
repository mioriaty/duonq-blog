/* eslint-disable no-console */
import AsyncExitHook from 'async-exit-hook';
import cors from 'cors';
import express, { Application } from 'express';
import { createServer } from 'http';
import 'reflect-metadata';
import { connectSessionMongo } from '~/configs/databases/mongo.db';
import { connectPostgresDB } from '~/configs/databases/postgres.db';
import { env } from '~/configs/env';
import { connectApolloServer } from '~/middlewares/apollo.middleware';
import { errorHandlingMiddleware } from '~/middlewares/error.middleware';
import { sessionMiddleware } from '~/middlewares/session.middleware';
import { __PROD__ } from '~/utils/constants';

const START_SERVER = async () => {
  // await sendEmail('mioriaty@gmail.com', '<h1>Hello mio</h1>');
  const app = express() as Application;
  const httpServer = createServer(app);

  /** --- Init middlewares --- */
  app.use(express.json());
  app.use(
    cors({
      origin: __PROD__ ? process.env.CORS_ORIGIN_PROD : process.env.CORS_ORIGIN_DEV,
      credentials: true
    })
  );
  app.set('trust proxy', 1); // trust first proxy

  /** --- Init databases --- */
  await connectPostgresDB();
  await connectSessionMongo();
  app.use(sessionMiddleware);

  await connectApolloServer({
    httpServer,
    app
  });

  /** --- Handle errors --- */
  app.use(errorHandlingMiddleware);

  await new Promise<void>((resolve) =>
    httpServer.listen(
      {
        host: env.APP_HOST,
        port: env.APP_PORT
      },
      resolve
    )
  );

  console.log(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}/graphql`);

  /** --- Clean up trước khi shutdown server --- */
  AsyncExitHook(async () => {
    httpServer.close(() => console.log('Server is shutting down'));
    // close database connection, ...
  });
};

START_SERVER().catch((error) => {
  console.error(error);
  process.exit(1);
});
