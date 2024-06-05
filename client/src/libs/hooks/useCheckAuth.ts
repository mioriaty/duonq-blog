'use client';

import { useMeQuery } from '@/generated/graphql';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useCheckAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (
      !loading &&
      !!data?.me.user &&
      (pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/forgot-password' ||
        pathname === '/change-password')
    ) {
      router.replace('/');
    }
  }, [data, loading, pathname, router]);

  return { data, loading };
};
