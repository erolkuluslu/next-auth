'use client';

import { useCallback } from 'react';
import { Hero, FeaturedProducts } from '@/components/home';
import { Product } from '@/types/product';
import { useAppDispatch } from '@/lib/store';
import { addToCart } from '@/lib/store/slices/cartSlice';

export default function HomePage() {
  const dispatch = useAppDispatch();

  // Handle add to cart functionality
  const handleAddToCart = useCallback((product: Product) => {
    dispatch(addToCart(product));
    
    // Optional: Show a success notification
    console.log('Added to cart:', product.title);
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <FeaturedProducts onAddToCart={handleAddToCart} />
    </div>
  );
}