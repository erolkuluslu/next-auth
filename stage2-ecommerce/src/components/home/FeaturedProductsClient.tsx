'use client';

import { useCallback, useEffect } from 'react';
import { ProductCardProfessional } from '@/components/ui/ProductCardProfessional';
import { Product } from '@/types/product';
import { useAppDispatch } from '@/lib/store';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { preloadFeaturedImages } from '@/lib/utils/imagePreloader';

interface FeaturedProductsClientProps {
  products: Product[];
  locale: string;
}

export function FeaturedProductsClient({ products, locale }: FeaturedProductsClientProps) {
  const dispatch = useAppDispatch();

  // Preload featured product images for better performance
  useEffect(() => {
    if (products.length > 0) {
      preloadFeaturedImages(products).catch(error => {
        console.warn('Failed to preload featured images:', error);
      });
    }
  }, [products]);

  // Handle add to cart functionality
  const handleAddToCart = useCallback((product: Product) => {
    dispatch(addToCart(product));
    
    // Optional: Show a success notification
    console.log('Added to cart:', product.title);
  }, [dispatch]);

  return (
    <div className="grid-modern grid-products">
      {products.map((product, index) => (
        <ProductCardProfessional
          key={product.id}
          product={product}
          locale={locale}
          onAddToCart={handleAddToCart}
          className="h-full"
          priority={index < 2}
          index={index}
        />
      ))}
    </div>
  );
}