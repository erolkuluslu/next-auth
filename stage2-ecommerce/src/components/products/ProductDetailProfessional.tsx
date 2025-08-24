'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Container, Badge } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useAppDispatch } from '@/lib/store';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { formatPrice } from '@/lib/utils/api';

interface ProductDetailProfessionalProps {
  product: Product;
  locale: string;
}

export function ProductDetailProfessional({ product, locale }: ProductDetailProfessionalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  
  const isTurkish = locale === 'tr';

  const handleAddToCart = useCallback(() => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    
    // Show success feedback
    const message = isTurkish 
      ? `${quantity} adet ${product.title} sepete eklendi!`
      : `${quantity} ${product.title} added to cart!`;
    alert(message);
  }, [dispatch, product, quantity, isTurkish]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    router.push(`/${locale}/cart`);
  }, [handleAddToCart, router, locale]);

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-amber-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-star-detail" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path fill="url(#half-star-detail)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-8 max-w-7xl">
        {/* Enhanced Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8 animate-fade-in-up">
          <Link href={`/${locale}`} className="hover:text-amber-600 transition-colors font-medium">
            {isTurkish ? 'Ana Sayfa' : 'Home'}
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/${locale}/products`} className="hover:text-amber-600 transition-colors font-medium">
            {isTurkish ? 'Ürünler' : 'Products'}
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 capitalize font-semibold">{product.category}</span>
        </nav>

        {/* Enhanced Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Premium Product Image Section */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-square bg-gray-50 p-8">
                <OptimizedImage
                  product={product}
                  fill
                  priority
                  quality={95}
                  className="object-contain transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder="blur"
                  loading="eager"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>

            {/* Image Loading Feedback */}
            {!imageLoaded && (
              <div className="text-center animate-fade-in-up delay-2">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-200">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
                  {isTurkish ? 'Görsel yükleniyor...' : 'Loading image...'}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Product Information */}
          <div className="space-y-6 animate-fade-in-up delay-1">
            {/* Category Badge */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-gray-100 text-gray-700 border border-gray-200">
                {product.category}
              </span>
            </div>

            {/* Enhanced Title */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
              
              {/* Enhanced Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {getRatingStars(product.rating.rate)}
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {product.rating.rate}
                </span>
                <span className="text-gray-600 font-medium">
                  ({product.rating.count} {isTurkish ? 'değerlendirme' : 'reviews'})
                </span>
              </div>
            </div>

            {/* Premium Price Display */}
            <div className="space-y-2">
              <div className="text-4xl font-bold text-amber-600">
                {formatPrice(product.price)}
              </div>
              <p className="text-gray-600 font-medium">
                {isTurkish ? 'KDV dahil, ücretsiz kargo' : 'Tax included, free shipping'}
              </p>
            </div>

            {/* Enhanced Quantity and Actions */}
            <div className="space-y-6">
              {/* Premium Quantity Selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {isTurkish ? 'Adet:' : 'Quantity:'}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                      disabled={quantity <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-4 py-3 min-w-[60px] text-center font-bold text-lg border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Premium Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-amber-600 text-white py-4 px-6 text-lg font-semibold rounded-lg hover:bg-amber-700 transition-colors duration-200 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.5A1 1 0 006 20h12a1 1 0 001-1v0a1 1 0 00-1-1H6m0 0L5 8H3" />
                  </svg>
                  {isTurkish ? 'Sepete Ekle' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="bg-gray-900 text-white py-4 px-6 text-lg font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {isTurkish ? 'Hemen Al' : 'Buy Now'}
                </button>
              </div>
            </div>

            {/* Enhanced Product Information Tabs */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'description', label: isTurkish ? 'Açıklama' : 'Description' },
                  { id: 'features', label: isTurkish ? 'Özellikler' : 'Features' },
                  { id: 'reviews', label: isTurkish ? 'Değerlendirmeler' : 'Reviews' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-3 px-6 font-semibold transition-all duration-200 relative ${
                      selectedTab === tab.id
                        ? 'text-amber-600 border-b-2 border-amber-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px]">
                {selectedTab === 'description' && (
                  <div className="animate-fade-in-up">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {isTurkish ? 'Ürün Açıklaması' : 'Product Description'}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {product.description}
                    </p>
                  </div>
                )}

                {selectedTab === 'features' && (
                  <div className="space-y-4 animate-fade-in-up">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {isTurkish ? 'Ürün Özellikleri' : 'Product Features'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: '✓', text: isTurkish ? 'Ücretsiz kargo (500₺ üzeri)' : 'Free shipping (orders over $50)' },
                        { icon: '✓', text: isTurkish ? '30 gün iade garantisi' : '30-day return guarantee' },
                        { icon: '✓', text: isTurkish ? 'Güvenli ödeme' : 'Secure payment' },
                        { icon: '✓', text: isTurkish ? '24/7 müşteri desteği' : '24/7 customer support' },
                        { icon: '✓', text: isTurkish ? 'Kalite garantisi' : 'Quality guarantee' },
                        { icon: '✓', text: isTurkish ? 'Hızlı teslimat' : 'Fast delivery' }
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-white border border-gray-200 rounded-lg p-4">
                          <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {feature.icon}
                          </span>
                          <span className="text-gray-700 font-medium">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === 'reviews' && (
                  <div className="animate-fade-in-up">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {isTurkish ? 'Müşteri Değerlendirmeleri' : 'Customer Reviews'}
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                      <div className="text-6xl mb-4">⭐</div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-gray-900">{product.rating.rate}/5</div>
                        <div className="flex justify-center">{getRatingStars(product.rating.rate)}</div>
                        <p className="text-gray-600 font-medium">
                          {product.rating.count} {isTurkish ? 'müşteri değerlendirmesi' : 'customer reviews'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ProductDetailProfessional;
