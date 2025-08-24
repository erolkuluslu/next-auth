'use client';

import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don&apos;t have permission to access this page
          </p>
        </div>

        {session?.user && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="text-sm text-blue-700">
              <p>
                <span className="font-medium">Signed in as:</span> {session.user.email}
              </p>
              <p>
                <span className="font-medium">Role:</span> {session.user.role || 'user'}
              </p>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="text-sm text-yellow-700">
            <p>
              This page requires special permissions that your account doesn&apos;t have.
              Please contact an administrator if you believe this is an error.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoBack}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Go back
          </button>

          <button
            onClick={handleGoHome}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Go to home page
          </button>

          {session && (
            <button
              onClick={handleSignOut}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}