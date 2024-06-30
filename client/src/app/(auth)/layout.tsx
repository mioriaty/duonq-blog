import { ReactNode } from 'react';

import { AuthHeader } from '@/containers/auth-header';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthHeader />
      <div className="flex h-[100vh] w-full items-center justify-center">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </>
  );
}
