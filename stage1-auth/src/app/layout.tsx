import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/auth.config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js Auth0 Integration - Stage 1',
  description: 'Authentication system with Auth0 and NextAuth.js',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Temporarily disable server-side session fetching to avoid JWT errors
  // The SessionProvider will handle session on the client side
  const session = null;
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}