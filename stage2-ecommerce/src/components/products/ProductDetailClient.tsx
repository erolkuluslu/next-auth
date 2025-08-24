'use client';

import { ProductDetailProfessional } from './ProductDetailProfessional';
import { Product } from '@/types/product';

interface ProductDetailClientProps {
  product: Product;
  locale: string;
}

export function ProductDetailClient({ product, locale }: ProductDetailClientProps) {
  return <ProductDetailProfessional product={product} locale={locale} />;
}

export default ProductDetailClient;