'use client';

import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Dynamic component for the actual sign in page content
function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');

  useEffect(() => {
    // Check if user is already signed in
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push(callbackUrl);
      }
    };

    checkSession();

    // Handle error from URL params
    if (errorParam) {
      switch (errorParam) {
        case 'Configuration':
          setError('Server configuration error. Please contact support.');
          break;
        case 'AccessDenied':
          setError('Access denied. You do not have permission to sign in.');
          break;
        case 'Verification':
          setError('Verification failed. Please try again.');
          break;
        default:
          setError('An error occurred during sign in. Please try again.');
      }
    }
  }, [router, callbackUrl, errorParam]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn('auth0', {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError('Sign in failed. Please try again.');
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to Stage 2 E-commerce
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your account to continue shopping
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Sign in failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <>
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Sign in with Auth0
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Secure authentication powered by{' '}
              <span className="font-medium text-indigo-600">Auth0</span>
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading sign in..." /></div>}>
      <SignInContent />
    </Suspense>
  );
}