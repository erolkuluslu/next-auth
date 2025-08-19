import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
    accessToken?: string;
    idToken?: string;
    role?: string;
  }

  interface User extends DefaultUser {
    role?: string;
  }

  interface Profile {
    role?: string;
    sub?: string;
    picture?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    role?: string;
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
  }
}