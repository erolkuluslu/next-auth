import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { Container, Button } from '@/components/ui';
import { ProductCard } from '@/components/ui/ProductCard';
import { getFeaturedProducts } from '@/lib/api/fakestore';
import { FeaturedProductsClient } from './FeaturedProductsClient';

export async function FeaturedProductsServer() {
  const locale = await getLocale();
  
  try {
    const products = await getFeaturedProducts();

    if (!products || products.length === 0) {
      return (
        <section className="py-12 bg-gray-50">
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {locale === 'tr' ? 'Öne Çıkan Ürünler' : 'Featured Products'}
              </h2>
              <p className="text-gray-600 mb-8">
                {locale === 'tr' 
                  ? 'Şu anda öne çıkan ürün bulunmamaktadır.'
                  : 'No featured products available at the moment.'}
              </p>
              <Link href={`/${locale}/products`}>
                <Button>
                  {locale === 'tr' ? 'Tüm Ürünleri Görüntüle' : 'View All Products'}
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      );
    }

    return (
      <section className="py-12 bg-gray-50">
        <Container>
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {locale === 'tr' ? 'Öne Çıkan Ürünler' : 'Featured Products'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'tr'
                ? 'En popüler ve kaliteli ürünlerimizi keşfedin. Her biri özenle seçilmiş, müşteri memnuniyeti garantili ürünler.'
                : 'Discover our most popular and quality products. Each carefully selected with guaranteed customer satisfaction.'}
            </p>
          </div>

          {/* Pass products to client component for interactivity */}
          <FeaturedProductsClient products={products} locale={locale} />

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href={`/${locale}/products`}>
              <Button size="lg" variant="outline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
                {locale === 'tr' ? 'Tüm Ürünleri Görüntüle' : 'View All Products'}
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    );
  } catch (error) {
    console.error('Failed to load featured products:', error);
    
    return (
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {locale === 'tr' ? 'Öne Çıkan Ürünler' : 'Featured Products'}
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.892-.833-2.662 0L3.152 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">
                {locale === 'tr' ? 'Ürünler Yüklenemedi' : 'Failed to Load Products'}
              </h3>
              <p className="text-red-600 text-sm mb-4">
                {locale === 'tr' 
                  ? 'Öne çıkan ürünler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.'
                  : 'Featured products are currently unavailable. Please try again later.'}
              </p>
              <Link href={`/${locale}/products`}>
                <Button variant="outline" size="sm">
                  {locale === 'tr' ? 'Ürün Sayfasına Git' : 'Go to Products'}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }
}

export default FeaturedProductsServer;