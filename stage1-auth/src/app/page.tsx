'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Next.js Auth0 Integration
          </h1>
          <p className="text-xl text-gray-600">
            Stage 1: Authentication System with Auth0 and NextAuth.js
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {session ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Welcome, {session.user?.name || 'User'}!
                </h2>
                <p className="text-gray-600">{session.user?.email}</p>
              </div>

              <div className="space-y-4 mb-8">
                <Link
                  href="/dashboard"
                  className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  View Profile
                </Link>
                {/* Admin link - will be protected by middleware */}
                <Link
                  href="/admin"
                  className="block w-full bg-purple-100 text-purple-700 py-3 px-4 rounded-md hover:bg-purple-200 transition-colors"
                >
                  Admin Panel
                </Link>
              </div>

              <button
                onClick={() => signOut()}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Authentication Required
                </h2>
                <p className="text-gray-600 mb-8">
                  Please sign in to access the protected features of this application.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => signIn('auth0')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                  Sign In with Auth0
                </button>

                <div className="text-sm text-gray-500">
                  Secure authentication powered by Auth0
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Stage 1: Auth0 OAuth + JWT Integration with Next.js Middleware</p>
          <p className="mt-2">Built with Next.js 14+, TypeScript, and TailwindCSS</p>
        </div>
      </div>
    </div>
  );
}