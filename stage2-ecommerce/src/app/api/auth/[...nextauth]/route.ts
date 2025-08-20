// NextAuth.js API route for Stage 2 E-commerce platform
import NextAuth from 'next-auth';
import { authOptions } from '@/config/auth.config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };