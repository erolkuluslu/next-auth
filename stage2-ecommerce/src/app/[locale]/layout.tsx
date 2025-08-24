import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

// Supported locales
const locales = ['en', 'tr'];

export default async function LocaleLayout({
  children,
  params: { locale }
}: LocaleLayoutProps) {
  console.log(`[LAYOUT] Processing locale layout for: ${locale}`);
  
  // Check if the locale is valid
  if (!locales.includes(locale)) {
    console.log(`[LAYOUT] Invalid locale: ${locale}, calling notFound()`);
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  let messages;
  try {
    messages = await getMessages();
    console.log(`[LAYOUT] Messages loaded for locale: ${locale}`);
  } catch (error) {
    console.log(`[LAYOUT] Failed to load messages for locale: ${locale}`, error);
    // Fallback messages if locale files are not found
    messages = {};
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

// Generate static params for supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}