import '../styles/globals.css';
import type { Metadata } from 'next';
import { CookiesProvider } from 'next-client-cookies/server';
import { Inter as FontSans } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';

import { cn } from '@/libs/utils';
import { ApolloWrapper } from '@/providers/apollo-provider';
import { ThemeProvider } from '@/providers/theme.provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Duonqbloq',
  description: 'This is just a blog website',
  icons: {
    icon: '/icons/logo.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <CookiesProvider>
          <ApolloWrapper>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </ApolloWrapper>
        </CookiesProvider>
      </body>
    </html>
  );
}
