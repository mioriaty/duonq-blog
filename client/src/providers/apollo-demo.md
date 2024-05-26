# How to use apollo client in next.js

## Query data in server components

### here is a server component called UserProfile and here we want to get the user data

``` javascript
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { cookies } from "next/headers";


const USER_QUERY = gql`
  query Query {
    user {
      id
      firstName
      email
      phone
    }
  }
`;


const UserProfile = async () => {
  const client = getClient();
  const ourCookies = cookies();

  let token = await ourCookies.get("jwtToken")!.value;

  let jwtToken = JSON.parse(token);

  const { data } = await client.query({
    query: USER_QUERY,
    context: {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
  });
  console.log("🚀 ~ user ~ data:", data?.user);
  return (
    <>
      <h1>{data?.user?.firstName}</h1>
      <h2>{data?.user?.email}</h2>
    </>
  );
};
```


## Query data in client components

### This is a client component, for this you need to install the next-client-cookies package or it won't work
``` javascript
"use client";
import React from "react";
import { useCookies } from "next-client-cookies";
import { gql, useQuery } from "@apollo/client";

const USER_QUERY = gql`
  query Query {
    user {
      id
      firstName
      email
      phone
    }
  }
`;

const Home = () => {
  // getting the cookies
  const cookies = useCookies();

  // extracting our cookie
  const jwtToken: string | undefined = cookies.get("jwtToken");


  const { data, loading } = useQuery(USER_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${JSON.parse(jwtToken!)}`,
      },
    },
  });

  if (loading) {
    return <div>loading.....</div>;
  }

  return (
    <>
      <h1>{data?.user?.firstName}</h1>
      <h2>{data?.user?.email}</h2>
    </>
  );
};

export default Home;
```