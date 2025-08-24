import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getProducts, getCategories } from '@/lib/api/fakestore';
import { ProductsPageClient } from '@/components/products/ProductsPageClient';

interface ProductsPageProps {
  params: {
    locale: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = params;
  const isTurkish = locale === 'tr';
  
  const title = isTurkish ? 'Tüm Ürünler - Stage 2 E-Commerce' : 'All Products - Stage 2 E-Commerce';
  const description = isTurkish 
    ? 'Geniş ürün yelpazemizi keşfedin ve en uygun fiyatlarla alışveriş yapın. Elektronik, giyim, takı ve daha fazlası.'
    : 'Discover our wide range of products and shop at the best prices. Electronics, clothing, jewelry and more.';

  return {
    title,
    description,
    keywords: isTurkish 
      ? ['ürünler', 'alışveriş', 'online', 'e-ticaret', 'elektronik', 'giyim', 'takı']
      : ['products', 'shopping', 'online', 'e-commerce', 'electronics', 'clothing', 'jewelry'],
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Stage 2 E-Commerce',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  try {
    const { locale } = params;
    
    // Enable static rendering for this locale
    setRequestLocale(locale);
    
    // Fetch initial data server-side
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    // Generate JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: locale === 'tr' ? 'Tüm Ürünler' : 'All Products',
      description: locale === 'tr' 
        ? 'Geniş ürün yelpazemizi keşfedin ve en uygun fiyatlarla alışveriş yapın.'
        : 'Discover our wide range of products and shop at the best prices.',
      url: `/${locale}/products`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: products.slice(0, 10).map((product, index) => ({
          '@type': 'Product',
          position: index + 1,
          name: product.title,
          image: product.image,
          description: product.description,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'TRY',
            availability: 'https://schema.org/InStock',
          },
        })),
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'tr' ? 'Ana Sayfa' : 'Home',
            item: `/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: locale === 'tr' ? 'Ürünler' : 'Products',
            item: `/${locale}/products`,
          },
        ],
      },
    };

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Products Page Client Component */}
        <ProductsPageClient 
          locale={locale}
          initialProducts={products}
          initialCategories={categories}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading products page:', error);
    
    // Return a fallback component or redirect
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {params.locale === 'tr' ? 'Bir hata oluştu' : 'An error occurred'}
          </h1>
          <p className="text-gray-600">
            {params.locale === 'tr' 
              ? 'Ürünler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.'
              : 'An error occurred while loading products. Please refresh the page.'
            }
          </p>
        </div>
      </div>
    );
  }
}