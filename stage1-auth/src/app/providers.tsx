'use client';

import { SessionProvider, SessionProviderProps } from 'next-auth/react';

interface ProvidersProps {
  children: React.ReactNode;
  session: SessionProviderProps['session'];
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}