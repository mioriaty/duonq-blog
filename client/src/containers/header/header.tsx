'use client';

import { ButtonLoading } from '@/shared/ButtonLoading';
import { MeDocument, MeQuery, useLogoutMutation, useMeQuery } from '@/generated/graphql';
import { SlashIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  const { data: meData, loading: meLoading } = useMeQuery();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();

  const logoutUser = async () => {
    await logout({
      update(cache, { data }) {
        if (data?.logout.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: {
                user: null,
                code: data.logout.code,
                success: data.logout.success,
                message: data.logout.message,
                error: data.logout.error
              }
            }
          });
        }
      }
    });
  };

  let body: JSX.Element | null = null;

  if (meLoading) {
    body = null;
  } else if (!meData?.me?.user) {
    body = (
      <div className="flex items-center">
        <Link
          className="inline-flex h-9 items-center justify-center whitespace-nowrap bg-background py-2 text-sm font-medium underline"
          href={'/register'}
        >
          Register
        </Link>
        <SlashIcon />
        <Link
          className="inline-flex h-9 items-center justify-center whitespace-nowrap bg-background py-2 text-sm font-medium underline"
          href={'/login'}
        >
          Login
        </Link>
      </div>
    );
  } else {
    body = (
      <ButtonLoading className="h-9" isLoading={logoutLoading} onClick={logoutUser}>
        Logout
      </ButtonLoading>
    );
  }

  return (
    <div className="border-b border-slate-300 px-4 md:px-6 lg:px-8">
      <header className="container flex w-full shrink-0 items-center px-4 py-2 md:px-6">
        <Link className="mr-6 hidden lg:flex" href="#">
          <Image className="h-10 w-auto" width={30} height={30} src="/icons/logo.png" alt="Car E-commerce" />
        </Link>
        <div className="ml-auto flex gap-4">
          <Link
            className="inline-flex h-9 items-center justify-center whitespace-nowrap bg-background py-2 text-sm font-medium"
            href="/blogs"
          >
            Blogs
          </Link>
          {body}
        </div>
      </header>
    </div>
  );
}
