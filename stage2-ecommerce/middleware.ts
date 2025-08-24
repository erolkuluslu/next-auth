// Simplified middleware to test NextIntl functionality
import createIntlMiddleware from 'next-intl/middleware';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'tr'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default intlMiddleware;

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|site.webmanifest|apple-touch-icon.png).*)',
  ],
};