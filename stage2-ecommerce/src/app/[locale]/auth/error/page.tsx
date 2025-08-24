'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const error = searchParams.get('error');
    
    switch (error) {
      case 'Configuration':
        setErrorMessage('Server configuration error. Please contact support.');
        break;
      case 'AccessDenied':
        setErrorMessage('Access denied. You do not have permission to access this application.');
        break;
      case 'Verification':
        setErrorMessage('Email verification failed. Please check your email and try again.');
        break;
      case 'Default':
        setErrorMessage('An authentication error occurred. Please try again.');
        break;
      case 'Signin':
        setErrorMessage('Sign in failed. Please check your credentials and try again.');
        break;
      case 'OAuthSignin':
        setErrorMessage('OAuth sign in error. Please try again.');
        break;
      case 'OAuthCallback':
        setErrorMessage('OAuth callback error. Please try again.');
        break;
      case 'OAuthCreateAccount':
        setErrorMessage('OAuth account creation error. Please try again.');
        break;
      case 'EmailCreateAccount':
        setErrorMessage('Email account creation error. Please try again.');
        break;
      case 'Callback':
        setErrorMessage('Callback error occurred during authentication.');
        break;
      case 'OAuthAccountNotLinked':
        setErrorMessage('This account is already linked to another provider. Please sign in with the original provider.');
        break;
      case 'EmailSignin':
        setErrorMessage('Email sign in failed. Please check your email and try again.');
        break;
      case 'CredentialsSignin':
        setErrorMessage('Invalid credentials. Please check your username and password.');
        break;
      case 'SessionRequired':
        setErrorMessage('Session required. Please sign in to continue.');
        break;
      default:
        setErrorMessage('An unexpected authentication error occurred. Please try again.');
    }
  }, [searchParams]);

  const handleRetry = () => {
    router.push('/auth/signin');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We encountered an error while trying to authenticate you
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">
            <p>{errorMessage}</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Try signing in again
          </button>

          <button
            onClick={handleGoHome}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Go to home page
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            If this problem persists, please contact support
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading..." /></div>}>
      <AuthErrorContent />
    </Suspense>
  );
}