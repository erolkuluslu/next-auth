'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container, Card, CardContent, Button } from '@/components/ui';
import { Product } from '@/types/product';

interface BasicProduct {
  id: number;
  title: string;
  image: string;
  price: number;
}

interface CategoryWithProducts {
  name: string;
  slug: string;
  products: BasicProduct[];
  productCount: number;
}

interface CategoriesPageClientProps {
  locale: string;
  categories: CategoryWithProducts[];
}

export function CategoriesPageClient({ locale, categories }: CategoriesPageClientProps) {
  const router = useRouter();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
  
  const isTurkish = locale === 'tr';

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
    setImageLoading(prev => ({ ...prev, [productId]: false }));
  };

  const handleImageLoad = (productId: number) => {
    setImageLoading(prev => ({ ...prev, [productId]: false }));
  };

  const handleImageLoadStart = (productId: number) => {
    setImageLoading(prev => ({ ...prev, [productId]: true }));
  };

  const getCategoryDisplayName = (categoryName: string) => {
    if (!isTurkish) return categoryName;
    
    // Turkish translations for common categories
    const translations: Record<string, string> = {
      "men's clothing": "Erkek Giyim",
      "women's clothing": "Kadın Giyim",
      "jewelery": "Takı",
      "electronics": "Elektronik"
    };
    
    return translations[categoryName.toLowerCase()] || categoryName;
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categoryName.toLowerCase();
    
    if (category.includes('electronic')) {
      return (
        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    } else if (category.includes('clothing') || category.includes('giyim')) {
      return (
        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    } else if (category.includes('jewelery') || category.includes('takı')) {
      return (
        <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href={`/${locale}`} className="hover:text-gray-900">
            {isTurkish ? 'Ana Sayfa' : 'Home'}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900">
            {isTurkish ? 'Kategoriler' : 'Categories'}
          </span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isTurkish ? 'Ürün Kategorileri' : 'Product Categories'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isTurkish 
              ? 'İhtiyacınız olan ürünleri kategoriler halinde keşfedin ve kolayca bulun.'
              : 'Discover and find the products you need organized by categories.'
            }
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.name} 
              className="group bg-white border border-gray-200 hover:border-primary-300 transition-colors duration-150 cursor-pointer"
              onClick={() => router.push(`/${locale}/products?category=${category.slug}`)}
            >
              <div className="p-6">
                {/* Category Icon and Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-50 flex items-center justify-center">
                      {getCategoryIcon(category.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {getCategoryDisplayName(category.name)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.productCount} {isTurkish ? 'ürün' : 'products'}
                      </p>
                    </div>
                  </div>
                  <svg 
                    className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Product Preview Grid */}
                {category.products.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {category.products.slice(0, 4).map((product, index) => (
                      <div 
                        key={product.id} 
                        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {!imageErrors[product.id] ? (
                          <>
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-contain p-2"
                              onError={() => handleImageError(product.id)}
                              onLoad={() => handleImageLoad(product.id)}
                              onLoadStart={() => handleImageLoadStart(product.id)}
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 12.5vw"
                              priority={index < 2} // Prioritize first 2 images
                            />
                            {imageLoading[product.id] && (
                              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                            <div className="text-center">
                              <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={1} 
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                />
                              </svg>
                              <span className="text-xs text-gray-400">
                                {isTurkish ? 'Resim yok' : 'No image'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {category.products.length === 0 && (
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-sm text-gray-500">
                        {isTurkish ? 'Yakında ürünler eklenecek' : 'Products coming soon'}
                      </p>
                    </div>
                  </div>
                )}

                {/* View Category Button */}
                <button 
                  className="w-full bg-primary-500 text-white py-2 px-4 font-medium hover:bg-primary-600 transition-colors duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/${locale}/products?category=${category.slug}`);
                  }}
                >
                  {isTurkish ? 'Kategoriyi Görüntüle' : 'View Category'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 bg-white border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {isTurkish ? 'Aradığınızı Bulamadınız mı?' : 'Can\'t Find What You\'re Looking For?'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isTurkish 
              ? 'Tüm ürünlerimizi görmek için ürünler sayfasını ziyaret edin.'
              : 'Visit our products page to see all our available items.'
            }
          </p>
          <button 
            onClick={() => router.push(`/${locale}/products`)}
            className="bg-primary-500 text-white py-3 px-8 font-medium hover:bg-primary-600 transition-colors duration-150"
          >
            {isTurkish ? 'Tüm Ürünleri Görüntüle' : 'View All Products'}
          </button>
        </div>
      </Container>
    </div>
  );
}

export default CategoriesPageClient;