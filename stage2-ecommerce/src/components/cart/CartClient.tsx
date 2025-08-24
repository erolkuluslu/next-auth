'use client';

import { useTranslations } from 'next-intl';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { selectCartItems, selectCartTotal, selectCartItemCount } from '@/lib/store/selectors';
import { removeFromCart, updateQuantity, clearCart } from '@/lib/store/slices/cartSlice';
import { Container, Button } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { formatPrice } from '@/lib/utils/api';
import { Product } from '@/types/product';
import { useState } from 'react';

interface CartClientProps {
  locale: string;
}

export function CartClient({ locale }: CartClientProps) {
  const t = useTranslations('common.cart');
  const dispatch = useAppDispatch();
  
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);
  
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    
    setIsUpdating(String(productId));
    dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
    
    // Brief loading state for UX
    setTimeout(() => setIsUpdating(null), 200);
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-8">
        <div className="cart-page max-w-4xl mx-auto">
          <div className="cart-page__header mb-8">
            <h1 className="cart-page__title text-3xl font-bold text-gray-900">
              {locale === 'tr' ? 'Sepetim' : 'My Cart'}
            </h1>
            <p className="cart-page__subtitle text-gray-600 mt-2">
              {locale === 'tr' 
                ? 'Sepetinizdeki ürünleri görüntüleyin ve yönetin' 
                : 'Review and manage items in your cart'}
            </p>
          </div>

          <div className="cart-page__empty bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="cart-page__empty-content flex flex-col items-center space-y-4">
              <div className="cart-page__empty-icon w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-gray-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 4.5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
                  />
                </svg>
              </div>
              <h3 className="cart-page__empty-title text-lg font-medium text-gray-900">
                {locale === 'tr' ? 'Sepetiniz boş' : 'Your cart is empty'}
              </h3>
              <p className="cart-page__empty-description text-gray-600">
                {locale === 'tr' 
                  ? 'Henüz sepetinize ürün eklemediniz.' 
                  : "You haven't added any items to your cart yet."}
              </p>
              <a
                href={`/${locale}/products`}
                className="cart-page__empty-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {locale === 'tr' ? 'Alışverişe Başla' : 'Start Shopping'}
              </a>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="cart-page max-w-4xl mx-auto">
        {/* Header */}
        <div className="cart-page__header mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="cart-page__title text-3xl font-bold text-gray-900">
                {locale === 'tr' ? 'Sepetim' : 'My Cart'}
              </h1>
              <p className="cart-page__subtitle text-gray-600 mt-2">
                {itemCount} {locale === 'tr' ? 'ürün' : 'items'}
              </p>
            </div>
            <Button
              onClick={handleClearCart}
              variant="outline"
              className="cart-page__clear-button"
            >
              {locale === 'tr' ? 'Sepeti Temizle' : 'Clear Cart'}
            </Button>
          </div>
        </div>

        <div className="cart-page__layout lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="cart-page__items lg:col-span-2">
            <div className="cart-items bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
              {cartItems.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={{ ...item.product, quantity: item.quantity }}
                  locale={locale}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  isUpdating={isUpdating === String(item.product.id)}
                />
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-page__summary mt-8 lg:mt-0">
            <CartSummary 
              total={cartTotal}
              itemCount={itemCount}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

interface CartItemProps {
  item: Product & { quantity: number };
  locale: string;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  isUpdating: boolean;
}

function CartItem({ item, locale, onQuantityChange, onRemove, isUpdating }: CartItemProps) {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="cart-item p-6">
      <div className="cart-item__layout flex gap-6">
        {/* Product Image */}
        <div className="cart-item__image-container flex-shrink-0">
          <div className="cart-item__image w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
            <OptimizedImage
              product={item}
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="cart-item__details flex-1 min-w-0">
          <div className="cart-item__info">
            <h3 className="cart-item__title font-semibold text-gray-900 line-clamp-2">
              {item.title}
            </h3>
            <p className="cart-item__category text-sm text-gray-500 mt-1">
              {item.category}
            </p>
            <p className="cart-item__price text-lg font-bold text-gray-900 mt-2">
              {formatPrice(itemTotal)}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="cart-item__controls flex items-center justify-between mt-4">
            <div className="cart-item__quantity flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                disabled={isUpdating}
                className="cart-item__quantity-button cart-item__quantity-button--minus px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="cart-item__quantity-value px-4 py-2 text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                {isUpdating ? '...' : item.quantity}
              </span>
              
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                disabled={isUpdating}
                className="cart-item__quantity-button cart-item__quantity-button--plus px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.id)}
              className="cart-item__remove-button text-red-600 hover:text-red-800 text-sm font-medium"
            >
              {locale === 'tr' ? 'Kaldır' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CartSummaryProps {
  total: number;
  itemCount: number;
  locale: string;
}

function CartSummary({ total, itemCount, locale }: CartSummaryProps) {
  const shipping = 0; // Free shipping for demo
  const tax = total * 0.08; // 8% tax rate
  const finalTotal = total + shipping + tax;

  return (
    <div className="cart-summary bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="cart-summary__title text-lg font-semibold text-gray-900 mb-4">
        {locale === 'tr' ? 'Sipariş Özeti' : 'Order Summary'}
      </h2>

      <div className="cart-summary__details space-y-3">
        <div className="cart-summary__line flex justify-between">
          <span className="cart-summary__label text-gray-600">
            {locale === 'tr' ? 'Alt Toplam' : 'Subtotal'} ({itemCount} {locale === 'tr' ? 'ürün' : 'items'})
          </span>
          <span className="cart-summary__value font-medium">
            {formatPrice(total)}
          </span>
        </div>

        <div className="cart-summary__line flex justify-between">
          <span className="cart-summary__label text-gray-600">
            {locale === 'tr' ? 'Kargo' : 'Shipping'}
          </span>
          <span className="cart-summary__value font-medium text-green-600">
            {locale === 'tr' ? 'Ücretsiz' : 'Free'}
          </span>
        </div>

        <div className="cart-summary__line flex justify-between">
          <span className="cart-summary__label text-gray-600">
            {locale === 'tr' ? 'Vergi' : 'Tax'}
          </span>
          <span className="cart-summary__value font-medium">
            {formatPrice(tax)}
          </span>
        </div>

        <hr className="cart-summary__divider" />

        <div className="cart-summary__total flex justify-between text-lg font-bold">
          <span className="cart-summary__total-label">
            {locale === 'tr' ? 'Toplam' : 'Total'}
          </span>
          <span className="cart-summary__total-value">
            {formatPrice(finalTotal)}
          </span>
        </div>
      </div>

      <Button className="cart-summary__checkout-button w-full mt-6 bg-blue-600 hover:bg-blue-700">
        {locale === 'tr' ? 'Ödemeye Geç' : 'Proceed to Checkout'}
      </Button>

      <p className="cart-summary__note text-xs text-gray-500 text-center mt-3">
        {locale === 'tr' 
          ? 'Vergi ve kargo ücreti ödeme sırasında hesaplanacak'
          : 'Tax and shipping calculated at checkout'}
      </p>
    </div>
  );
}

export default CartClient;