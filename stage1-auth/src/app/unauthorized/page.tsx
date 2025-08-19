'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have the necessary permissions to access this resource.
        </p>

        {session && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <div className="text-sm">
              <div className="mb-2">
                <strong className="text-gray-700">Current User:</strong>
                <span className="ml-2">{session.user?.name}</span>
              </div>
              <div className="mb-2">
                <strong className="text-gray-700">Your Role:</strong>
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  session.user?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {session.user?.role || 'user'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                If you believe you should have access to this resource, please contact your administrator.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors inline-block"
          >
            Go to Dashboard
          </Link>
          
          <Link
            href="/profile"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors inline-block"
          >
            View Profile
          </Link>
          
          <Link
            href="/"
            className="w-full bg-white text-gray-500 py-3 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors inline-block"
          >
            Go to Home
          </Link>
        </div>

        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500">
            Need help? Contact support for assistance.
          </div>
        </div>
      </div>
    </div>
  );
}