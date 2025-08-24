'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Product } from '@/types/product';
import { Container, Button } from '@/components/ui';
import { FeaturedProductCard } from '@/components/ui/FeaturedProductCard';
import { getFeaturedProducts } from '@/lib/api/fakestore';
import { useEffect, useState, useRef } from 'react';

interface FeaturedProductsProps {
  onAddToCart?: (product: Product) => void;
}

function FeaturedProductsComponent({ onAddToCart }: FeaturedProductsProps) {
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await getFeaturedProducts();
        setProducts(fetchedProducts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const getFeaturedType = (index: number): 'bestseller' | 'new' | 'limited' | 'popular' => {
    const types: ('bestseller' | 'new' | 'limited' | 'popular')[] = ['bestseller', 'popular', 'new', 'limited'];
    return types[index % types.length];
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {locale === 'tr' ? 'Öne Çıkan Ürünler' : 'Featured Products'}
            </h2>
            <p className="text-lg text-gray-600">
              {locale === 'tr' ? 'Ürünler yükleniyor...' : 'Loading featured products...'}
            </p>
          </div>
          
          {/* Loading Carousel */}
          <div className="flex gap-6 overflow-hidden pb-4">
            {[1, 2, 3, 4].map((i) => (
              <FeaturedProductCard
                key={i}
                product={{} as Product}
                locale={locale}
                loading={true}
                priority={i === 1}
                index={i - 1}
              />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Container>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {locale === 'tr' ? 'Öne Çıkan Ürünler' : 'Featured Products'}
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-lg mx-auto shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.892-.833-2.662 0L3.152 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-3">
                {locale === 'tr' ? 'Ürünler Yüklenemedi' : 'Failed to Load Products'}
              </h3>
              <p className="text-red-600 mb-6">
                {locale === 'tr' 
                  ? 'Öne çıkan ürünler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.'
                  : 'Featured products are currently unavailable. Please try again later.'}
              </p>
              <Link href={`/${locale}/products`}>
                <Button variant="outline" size="lg" className="px-8">
                  {locale === 'tr' ? 'Ürün Sayfasına Git' : 'Browse All Products'}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  try {

    if (!products || products.length === 0) {
      return (
        <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <Container>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {locale === 'tr' ? 'Öne Çıkan Ürünler' : 'Featured Products'}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {locale === 'tr' 
                  ? 'Şu anda öne çıkan ürün bulunmamaktadır.'
                  : 'No featured products available at the moment.'}
              </p>
              <Link href={`/${locale}/products`}>
                <Button size="lg" className="px-8">
                  {locale === 'tr' ? 'Tüm Ürünleri Görüntüle' : 'Browse All Products'}
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      );
    }

    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <Container>
          {/* Enhanced Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full mb-6">
              <span className="text-primary-600 font-semibold text-sm px-4 py-1 bg-white rounded-full shadow-sm">
                ⭐ {locale === 'tr' ? 'Özel Seçim' : 'Curated Selection'}
              </span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {locale === 'tr' ? 'Öne Çıkan Ürünler' : 'Featured Products'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {locale === 'tr'
                ? 'En popüler ve kaliteli ürünlerimizi keşfedin. Her biri özenle seçilmiş, müşteri memnuniyeti garantili ürünler.'
                : 'Discover our most popular and premium products. Each item is carefully curated with guaranteed customer satisfaction and exceptional quality.'}
            </p>
          </div>

          {/* Carousel Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-4">
              <button
                onClick={scrollLeft}
                className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl hover:border-primary-300 transition-all duration-300 hover:scale-110 group"
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl hover:border-primary-300 transition-all duration-300 hover:scale-110 group"
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              {products.length} {locale === 'tr' ? 'özel ürün' : 'featured items'}
            </div>
          </div>

          {/* Featured Products Carousel */}
          <div 
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth touch-pan-x px-2 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <FeaturedProductCard
                key={product.id}
                product={product}
                locale={locale}
                onAddToCart={onAddToCart}
                priority={index === 0}
                index={index}
                featured={getFeaturedType(index)}
              />
            ))}
          </div>

          {/* Enhanced View All Section */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {locale === 'tr' ? 'Daha Fazlası İçin' : 'Want to See More?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {locale === 'tr' 
                  ? 'Tüm ürün koleksiyonumuzu keşfedin'
                  : 'Explore our complete product collection'}
              </p>
              <Link href={`/${locale}/products`}>
                <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                  {locale === 'tr' ? 'Tüm Ürünleri Görüntüle' : 'Browse All Products'}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-100/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-100/30 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      </section>
    );
  } catch (error) {
    console.error('Fallback error in FeaturedProducts:', error);
    return null;
  }
}

// Export the main component
export function FeaturedProducts({ onAddToCart }: FeaturedProductsProps) {
  return <FeaturedProductsComponent onAddToCart={onAddToCart} />;
}

export default FeaturedProducts;