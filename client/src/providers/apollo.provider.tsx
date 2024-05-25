'use client';
// import { getClient } from '@/lib/helpers/get-apollo-client';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { FC, ReactNode } from 'react';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
  connectToDevTools: process.browser,
  ssrMode: !process.browser,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include' // Additional fetch() options like `credentials` or `headers`,
  })
});

export const NextApolloProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // const _client = getClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
