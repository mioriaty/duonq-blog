import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

import { GRAPHQL_ENDPOINT } from '@/libs/constants/env';

// get result from cache after request SSR
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient<NormalizedCacheObject>({
    cache: new InMemoryCache({
      resultCaching: true
    }),
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT
      // you can disable result caching here if you want to
      // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
      // fetchOptions: { cache: "no-store" },
    })
  });
});
