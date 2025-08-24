import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { CartClient } from '@/components/cart/CartClient';

interface CartPageProps {
  params: {
    locale: string;
  };
}

export default async function CartPage({ params: { locale } }: CartPageProps) {
  const session = await auth();
  
  if (!session) {
    redirect(`/${locale}/auth/signin?callbackUrl=/${locale}/cart`);
  }

  return <CartClient locale={locale} />;
}