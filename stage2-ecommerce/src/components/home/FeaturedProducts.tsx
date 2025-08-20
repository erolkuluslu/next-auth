import Link from 'next/link';
import { Product } from '@/types/product';
import { Container, Button } from '@/components/ui';
import { ProductCard } from '@/components/ui/ProductCard';
import { getFeaturedProducts } from '@/lib/api/fakestore';

interface FeaturedProductsProps {
  onAddToCart?: (product: Product) => void;
}

async function FeaturedProductsServer({ onAddToCart }: FeaturedProductsProps) {
  try {
    const products = await getFeaturedProducts();

    if (!products || products.length === 0) {
      return (
        <section className="py-12 bg-gray-50">
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Öne Çıkan Ürünler
              </h2>
              <p className="text-gray-600 mb-8">
                Şu anda öne çıkan ürün bulunmamaktadır.
              </p>
              <Link href="/products">
                <Button>Tüm Ürünleri Görüntüle</Button>
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
              Öne Çıkan Ürünler
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              En popüler ve kaliteli ürünlerimizi keşfedin. Her biri özenle seçilmiş, 
              müşteri memnuniyeti garantili ürünler.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                className="h-full"
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link href="/products">
              <Button size="lg" variant="outline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
                Tüm Ürünleri Görüntüle
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
              Öne Çıkan Ürünler
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
                Ürünler Yüklenemedi
              </h3>
              <p className="text-red-600 text-sm mb-4">
                Öne çıkan ürünler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.
              </p>
              <Link href="/products">
                <Button variant="outline" size="sm">
                  Ürün Sayfasına Git
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }
}

// Client component wrapper for interactive features
export function FeaturedProducts({ onAddToCart }: FeaturedProductsProps) {
  return <FeaturedProductsServer onAddToCart={onAddToCart} />;
}

export default FeaturedProducts;