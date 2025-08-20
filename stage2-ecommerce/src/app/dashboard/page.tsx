'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRBAC } from '@/hooks/useRBAC';
import AuthGuard from '@/components/auth/AuthGuard';
import RoleGuard from '@/components/auth/RoleGuard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { hasPermission, isAdmin, isModerator, getUserPermissions } = useRBAC();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <AuthGuard requiredRole="user">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Authenticated
                </span>
              </div>
              <nav className="flex space-x-8">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Profile
                </button>
                <RoleGuard allowedRoles={['admin']}>
                  <button
                    onClick={() => router.push('/admin')}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Admin
                  </button>
                </RoleGuard>
                <button
                  onClick={handleSignOut}
                  className="text-red-600 hover:text-red-900 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Welcome to your Dashboard
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              Your personalized e-commerce control center
            </p>
          </div>

          {/* User Info */}
          {session?.user && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {session.user.name || 'Not provided'}
                </div>
                <div>
                  <strong>Email:</strong> {session.user.email}
                </div>
                <div>
                  <strong>Role:</strong> {session.user.role || 'user'}
                </div>
                <div>
                  <strong>User ID:</strong> {session.user.id}
                </div>
                {session.user.roles && (
                  <div className="md:col-span-2">
                    <strong>All Roles:</strong> {session.user.roles.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Permission-based sections */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Orders */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📦 My Orders
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                View and manage your orders
              </p>
              {hasPermission('orders.read') ? (
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  View Orders
                </button>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Order access not available
                </p>
              )}
            </div>

            {/* Products */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🛍️ Products
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Browse our product catalog
              </p>
              <button
                onClick={() => router.push('/products')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Browse Products
              </button>
            </div>

            {/* Admin Panel */}
            <RoleGuard allowedRoles={['admin', 'moderator']}>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ⚙️ Admin Tools
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Access administrative functions
                </p>
                <button
                  onClick={() => router.push(isAdmin() ? '/admin' : '/moderator')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  {isAdmin() ? 'Admin Panel' : 'Moderator Panel'}
                </button>
              </div>
            </RoleGuard>

            {/* Profile */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                👤 Profile
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage your account settings
              </p>
              <button
                onClick={() => router.push('/profile')}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* Analytics (Admin only) */}
            <RoleGuard allowedRoles={['admin']}>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  📊 Analytics
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  View system analytics
                </p>
                {hasPermission('analytics.read') ? (
                  <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors">
                    View Analytics
                  </button>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Analytics access restricted
                  </p>
                )}
              </div>
            </RoleGuard>
          </div>

          {/* Debug Info (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 bg-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔧 Debug Information (Development)
              </h3>
              <div className="text-sm space-y-2">
                <div>
                  <strong>User Permissions:</strong>
                </div>
                <pre className="bg-white p-4 rounded border text-xs overflow-auto">
                  {JSON.stringify(getUserPermissions(), null, 2)}
                </pre>
                <div>
                  <strong>Session Data:</strong>
                </div>
                <pre className="bg-white p-4 rounded border text-xs overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}