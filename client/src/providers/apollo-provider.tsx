'use client';

import { GRAPHQL_ENDPOINT } from '@/lib/constants/env';
import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink
} from '@apollo/experimental-nextjs-app-support/ssr';

function makeClient() {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    // fetchOptions: { cache: 'no-store' },
    credentials: 'include'
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    credentials: 'include',
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true
            }),
            httpLink
          ])
        : httpLink
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
