'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const [locale, setLocale] = useState('en');
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract locale from pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    const detectedLocale = pathSegments[0];
    
    // Check if first segment is a valid locale
    const validLocales = ['en', 'tr'];
    const currentLocale = validLocales.includes(detectedLocale) ? detectedLocale : 'en';
    setLocale(currentLocale);

    // Load messages for the detected locale
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const messagesModule = await import(`../../../messages/${currentLocale}.json`);
        setMessages(messagesModule.default || messagesModule);
      } catch (error) {
        console.warn(`Failed to load messages for locale: ${currentLocale}`, error);
        // Fallback to English messages
        try {
          const fallbackMessages = await import(`../../../messages/en.json`);
          setMessages(fallbackMessages.default || fallbackMessages);
        } catch (fallbackError) {
          console.error('Failed to load fallback messages', fallbackError);
          setMessages({});
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [pathname]);

  if (isLoading) {
    // Simple loading header placeholder
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return <Header locale={locale} messages={messages} />;
}