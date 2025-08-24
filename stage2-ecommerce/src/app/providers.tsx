'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReduxProvider } from '@/components/providers/ReduxProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Providers component that wraps the app with necessary providers
 * Includes NextAuth SessionProvider, Redux Provider, and NUQS Adapter
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <SessionProvider>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </SessionProvider>
    </ReduxProvider>
  );
}