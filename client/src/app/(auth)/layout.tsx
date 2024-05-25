import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <div className="w-full max-w-[400px]">{children}</div>
    </div>
  );
}
