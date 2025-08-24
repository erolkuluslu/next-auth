import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getProductById, getProducts } from '@/lib/api/fakestore';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';
import { formatPrice } from '@/lib/utils/api';

interface ProductPageProps {
  params: {
    locale: string;
    id: string;
  };
}

// Generate static paths for all products with locales
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    const locales = ['en', 'tr'];
    
    // Generate params for each product in each locale
    const params = [];
    for (const locale of locales) {
      for (const product of products) {
        params.push({
          locale,
          id: product.id.toString(),
        });
      }
    }
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { locale, id } = params;
    const productId = parseInt(id);
    
    const isTurkish = locale === 'tr';
    
    if (isNaN(productId)) {
      return {
        title: isTurkish ? 'Ürün Bulunamadı' : 'Product Not Found',
        description: isTurkish ? 'Aradığınız ürün bulunamadı.' : 'The product you are looking for could not be found.',
      };
    }

    const product = await getProductById(productId);
    
    if (!product) {
      return {
        title: isTurkish ? 'Ürün Bulunamadı' : 'Product Not Found',
        description: isTurkish ? 'Aradığınız ürün bulunamadı.' : 'The product you are looking for could not be found.',
      };
    }

    const title = `${product.title} - Stage 2 E-Commerce`;
    const description = product.description.length > 160 
      ? `${product.description.substring(0, 157)}...`
      : product.description;

    return {
      title,
      description,
      keywords: [
        product.title,
        product.category,
        'online alışveriş',
        'e-commerce',
        'ürün',
      ],
      openGraph: {
        title,
        description,
        type: 'website',
        images: [
          {
            url: product.image,
            width: 800,
            height: 800,
            alt: product.title,
          },
        ],
        siteName: 'Stage 2 E-Commerce',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [product.image],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Ürün Bulunamadı',
      description: 'Aradığınız ürün bulunamadı.',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { locale, id } = params;
    
    // Enable static rendering for this locale
    setRequestLocale(locale);
    
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      notFound();
    }

    const product = await getProductById(productId);
    
    if (!product) {
      notFound();
    }

    // Generate JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description,
      image: product.image,
      category: product.category,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'TRY',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Stage 2 E-Commerce',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.rate,
        reviewCount: product.rating.count,
        bestRating: 5,
        worstRating: 1,
      },
      brand: {
        '@type': 'Brand',
        name: 'Stage 2 E-Commerce',
      },
    };

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Product Detail Component */}
        <ProductDetailClient product={product} locale={locale} />
      </>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}