'use client';

import { signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SignOutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is signed in
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/');
      }
    };

    checkSession();
  }, [router]);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      
      await signOut({
        callbackUrl: '/',
        redirect: true,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, redirect to home
      router.push('/');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign out
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Are you sure you want to sign out of your account?
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              'Yes, sign me out'
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            You&apos;ll be redirected to the home page after signing out
          </p>
        </div>
      </div>
    </div>
  );
}