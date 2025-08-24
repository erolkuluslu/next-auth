import { setRequestLocale } from 'next-intl/server';
import { HeroServerAnimated } from '@/components/home/HeroServerAnimated';
import { FeaturedProductsServer } from '@/components/home/FeaturedProductsServer';

interface HomePageProps {
  params: {
    locale: string;
  };
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  // Enable static rendering
  setRequestLocale(locale);

  // Debug logging
  console.log(`[PAGE] Rendering home page for locale: ${locale}`);

  return (
    <div>
      <HeroServerAnimated />
      <FeaturedProductsServer />
    </div>
  );
}