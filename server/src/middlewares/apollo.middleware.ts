import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Application } from 'express';
import http from 'http';
import { buildSchema } from 'type-graphql';
import { Context } from '~/@types/context';
import { PostController } from '~/controllers/post.controller';
import { UserController } from '~/controllers/user.controller';

export const connectApolloServer = async ({ app, httpServer }: { httpServer: http.Server; app: Application }) => {
  const context = ({ req, res }: Context) => ({
    req,
    res
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [UserController, PostController]
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          'request.credentials': 'same-origin'
        }
      })
    ],
    context
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app: app as any,
    path: '/graphql',
    cors: false
  });
};
