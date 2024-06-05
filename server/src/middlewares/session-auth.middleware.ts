import { AuthenticationError } from 'apollo-server-core';
import { MiddlewareFn } from 'type-graphql';
import { Context } from '~/@types/context';

// for graphql resolvers
export const checkSessionAuth: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new AuthenticationError('Not authenticated');
  }
  return next();
};
