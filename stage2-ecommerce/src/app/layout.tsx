import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getStage2EnvironmentConfig } from '@/config/environment';
import Providers from './providers';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const env = getStage2EnvironmentConfig();

export const metadata: Metadata = {
  title: env.app.appName,
  description:
    'Multilingual, SEO-Optimized, Performance-Focused E-commerce Platform',
  keywords: ['e-commerce', 'online shop', 'products', 'shopping'],
  authors: [{ name: 'Stage 2 Team' }],
  openGraph: {
    title: env.app.appName,
    description:
      'Multilingual, SEO-Optimized, Performance-Focused E-commerce Platform',
    url: env.app.siteUrl,
    siteName: env.app.appName,
    type: 'website',
    locale: env.i18n.defaultLocale,
    alternateLocale: env.i18n.supportedLocales.filter(
      locale => locale !== env.i18n.defaultLocale
    ),
  },
  twitter: {
    card: 'summary_large_image',
    title: env.app.appName,
    description:
      'Multilingual, SEO-Optimized, Performance-Focused E-commerce Platform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <HeaderWrapper />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
