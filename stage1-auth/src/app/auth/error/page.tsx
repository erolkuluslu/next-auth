'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const errorMessages: Record<string, { title: string; description: string; action?: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the authentication server configuration. Please contact support if this persists.',
    action: 'contact_support',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in. Please contact an administrator if you believe this is an error.',
    action: 'contact_admin',
  },
  Verification: {
    title: 'Verification Failed',
    description: 'The verification token is invalid or has expired. Please try signing in again.',
    action: 'retry_signin',
  },
  OAuthSignin: {
    title: 'OAuth Sign-in Error',
    description: 'An error occurred while attempting to sign in with the OAuth provider. Please try again.',
    action: 'retry_signin',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'An error occurred during the OAuth callback process. Please try signing in again.',
    action: 'retry_signin',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description: 'Unable to create an account with the OAuth provider. Please try again or contact support.',
    action: 'retry_signin',
  },
  EmailCreateAccount: {
    title: 'Email Account Creation Error',
    description: 'Unable to create an account with the provided email. Please try again.',
    action: 'retry_signin',
  },
  Callback: {
    title: 'Callback Error',
    description: 'An error occurred during the authentication callback. Please try signing in again.',
    action: 'retry_signin',
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description: 'To confirm your identity, sign in with the same account you used originally.',
    action: 'retry_signin',
  },
  EmailSignin: {
    title: 'Email Sign-in',
    description: 'Check your email for a sign-in link.',
    action: 'check_email',
  },
  CredentialsSignin: {
    title: 'Invalid Credentials',
    description: 'Sign in failed. Please check that the details you provided are correct.',
    action: 'retry_signin',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You must be signed in to view this page.',
    action: 'signin_required',
  },
  default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication. Please try again.',
    action: 'retry_signin',
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  const errorInfo = errorMessages[error || ''] || errorMessages.default;
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const getErrorIcon = (error: string | null) => {
    if (error === 'AccessDenied') {
      return (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      );
    }
    
    if (error === 'Verification' || error?.includes('Email')) {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    );
  };

  const getActionButton = (action: string | undefined) => {
    switch (action) {
      case 'retry_signin':
        return (
          <Link
            href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors inline-block text-center"
          >
            Try Sign In Again
          </Link>
        );
      case 'signin_required':
        return (
          <Link
            href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors inline-block text-center"
          >
            Sign In
          </Link>
        );
      case 'check_email':
        return (
          <div className="w-full bg-blue-100 text-blue-800 py-3 px-4 rounded-md text-center">
            Please check your email and click the sign-in link
          </div>
        );
      case 'contact_support':
      case 'contact_admin':
        return (
          <div className="space-y-3">
            <Link
              href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors inline-block text-center"
            >
              Try Again
            </Link>
            <div className="text-sm text-gray-500 text-center">
              If the problem persists, please contact support
            </div>
          </div>
        );
      default:
        return (
          <Link
            href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors inline-block text-center"
          >
            Try Again
          </Link>
        );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            {getErrorIcon(error)}
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{errorInfo.title}</h1>
          <p className="text-gray-600">
            {errorInfo.description}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <div className="text-sm">
              <strong className="text-gray-700">Error Code:</strong>
              <span className="ml-2 font-mono text-gray-600">{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {getActionButton(errorInfo.action)}
          
          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors inline-block text-center"
          >
            Go to Home
          </Link>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-500 mb-4">
            Need help? Contact support for assistance.
          </div>
          
          {callbackUrl !== '/' && (
            <div className="text-xs text-gray-400">
              Original destination: {callbackUrl}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}