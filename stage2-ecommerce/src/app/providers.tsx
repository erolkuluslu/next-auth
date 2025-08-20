'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ReduxProvider } from '@/components/providers/ReduxProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Providers component that wraps the app with necessary providers
 * Includes NextAuth SessionProvider and Redux Provider
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </ReduxProvider>
  );
}