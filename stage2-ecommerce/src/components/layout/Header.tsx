'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, Button, Badge } from '@/components/ui';
import { useRBAC } from '@/hooks/useRBAC';
import { useAppSelector } from '@/lib/store';
import { selectCartItemCount } from '@/lib/store/selectors';

export default function Header() {
  const { data: session, status } = useSession();
  const { isAdmin, isModerator } = useRBAC();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = useAppSelector(selectCartItemCount);

  const handleSignIn = () => {
    signIn('auth0', { callbackUrl: '/dashboard' });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Ürünler', href: '/products' },
    { name: 'Kategoriler', href: '/categories' },
  ];

  const userNavigation = [
    { name: 'Profil', href: '/profile' },
    { name: 'Siparişlerim', href: '/orders' },
    ...(isModerator() || isAdmin() ? [{ name: 'Yönetim', href: '/admin' }] : []),
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <Container>
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="hidden sm:block text-xl font-bold text-gray-900">
                E-Commerce
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side - Auth & Cart */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="hidden sm:block">
              <select
                className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue="tr"
                onChange={(e) => {
                  // TODO: Implement locale switching
                  console.log('Switch to locale:', e.target.value);
                }}
              >
                <option value="tr">🇹🇷 TR</option>
                <option value="en">🇺🇸 EN</option>
              </select>
            </div>

            {/* Cart */}
            <button
              onClick={() => router.push('/cart')}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.5A1 1 0 006 20h12a1 1 0 001-1v0a1 1 0 00-1-1H6m0 0L5 8H3"
                />
              </svg>
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  size="sm"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Badge>
              )}
            </button>

            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-md" />
            ) : session ? (
              <div className="flex items-center space-x-2">
                {/* User Menu (Desktop) */}
                <div className="hidden md:block relative group">
                  <button
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                    aria-label="User menu"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {session.user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{session.user?.name || 'User'}</div>
                        <div className="text-gray-500 text-xs">{session.user?.email}</div>
                        <Badge variant="secondary" size="sm" className="mt-1">
                          {session.user?.role || 'user'}
                        </Badge>
                      </div>
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile user button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => router.push('/profile')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Button>
              </div>
            ) : (
              <Button onClick={handleSignIn} size="sm">
                Giriş Yap
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {session && (
                <div className="border-t pt-2 mt-2">
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}

              {/* Mobile Language Selector */}
              <div className="px-4 py-2">
                <select
                  className="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue="tr"
                  onChange={(e) => {
                    // TODO: Implement locale switching
                    console.log('Switch to locale:', e.target.value);
                  }}
                >
                  <option value="tr">🇹🇷 Türkçe</option>
                  <option value="en">🇺🇸 English</option>
                </select>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}