import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/containers/header';
import { cn } from '@/lib/utils';
import { NextApolloProvider } from '@/providers/apollo.provider';
import { ThemeProvider } from '@/providers/theme.provider';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import '../styles/globals.css';

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
        <NextApolloProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            {children}
            <Toaster />
          </ThemeProvider>
        </NextApolloProvider>
      </body>
    </html>
  );
}