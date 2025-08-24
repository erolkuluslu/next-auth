import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getCategories, getProductsByCategory } from '@/lib/api/fakestore';
import { CategoriesPageClient } from '@/components/categories/CategoriesPageClient';

interface CategoriesPageProps {
  params: {
    locale: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoriesPageProps): Promise<Metadata> {
  const { locale } = params;
  const isTurkish = locale === 'tr';
  
  const title = isTurkish ? 'Kategoriler - Stage 2 E-Commerce' : 'Categories - Stage 2 E-Commerce';
  const description = isTurkish 
    ? 'Farklı kategorilerdeki ürünleri keşfedin. Elektronik, giyim, takı ve daha fazla kategori.'
    : 'Discover products in different categories. Electronics, clothing, jewelry and more categories.';

  return {
    title,
    description,
    keywords: isTurkish 
      ? ['kategoriler', 'ürün kategorileri', 'alışveriş', 'elektronik', 'giyim', 'takı']
      : ['categories', 'product categories', 'shopping', 'electronics', 'clothing', 'jewelry'],
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

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  try {
    const { locale } = params;
    
    // Enable static rendering for this locale
    setRequestLocale(locale);
    
    // Fetch categories and get sample products for each category
    const categories = await getCategories();
    
    // Get product counts for each category (without loading images on server)
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        try {
          const products = await getProductsByCategory(category);
          // Only send basic product info to avoid SSR image issues
          const basicProducts = products.slice(0, 4).map(product => ({
            id: product.id,
            title: product.title,
            image: product.image,
            price: product.price,
          }));
          
          return {
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, '-'),
            products: basicProducts,
            productCount: products.length,
          };
        } catch (error) {
          console.error(`Error fetching products for category ${category}:`, error);
          return {
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, '-'),
            products: [],
            productCount: 0,
          };
        }
      })
    );

    // Generate JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: locale === 'tr' ? 'Kategoriler' : 'Categories',
      description: locale === 'tr' 
        ? 'Farklı kategorilerdeki ürünleri keşfedin.'
        : 'Discover products in different categories.',
      url: `/${locale}/categories`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: categories.length,
        itemListElement: categoriesWithProducts.map((category, index) => ({
          '@type': 'Thing',
          position: index + 1,
          name: category.name,
          url: `/${locale}/products?category=${category.slug}`,
          description: `${category.productCount} ${locale === 'tr' ? 'ürün' : 'products'}`,
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
            name: locale === 'tr' ? 'Kategoriler' : 'Categories',
            item: `/${locale}/categories`,
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
        
        {/* Categories Page Client Component */}
        <CategoriesPageClient 
          locale={locale}
          categories={categoriesWithProducts}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading categories page:', error);
    
    // Return a fallback component
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {params.locale === 'tr' ? 'Bir hata oluştu' : 'An error occurred'}
          </h1>
          <p className="text-gray-600">
            {params.locale === 'tr' 
              ? 'Kategoriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.'
              : 'An error occurred while loading categories. Please refresh the page.'
            }
          </p>
        </div>
      </div>
    );
  }
}