import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { Container, Button } from '@/components/ui';

export async function HeroServerAnimated() {
  const locale = await getLocale();
  
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50 py-20 lg:py-32 overflow-hidden">
      {/* Professional Background Pattern with subtle animation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle geometric patterns with gentle animation */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5 animate-gentle-float">
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary-600">
            <pattern id="professional-grid-server" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#professional-grid-server)" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-80 h-80 opacity-3 animate-gentle-float" style={{animationDelay: '2s'}}>
          <svg viewBox="0 0 100 100" className="w-full h-full text-secondary-600">
            <pattern id="professional-dots-server" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1" fill="currentColor" opacity="0.3"/>
            </pattern>
            <rect width="100" height="100" fill="url(#professional-dots-server)" />
          </svg>
        </div>
      </div>

      <Container className="relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Professional Badge with entrance animation */}
          <div 
            className="inline-flex items-center px-4 py-2 rounded-sm bg-gray-100 text-gray-700 text-sm font-medium mb-8 border border-gray-200 animate-fade-in" 
            style={{animationDelay: '0.2s', animationFillMode: 'both'}}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
            {locale === 'tr' ? 'Yeni Nesil E-Ticaret Deneyimi' : 'Next Generation E-Commerce Experience'}
          </div>

          {/* Main Heading with staggered text animation */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span 
              className="block animate-text-reveal" 
              style={{animationDelay: '0.4s', animationFillMode: 'both'}}
            >
              {locale === 'tr' ? 'En İyi Ürünler' : 'Best Products'}
            </span>
            <span 
              className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent animate-text-reveal" 
              style={{animationDelay: '0.6s', animationFillMode: 'both'}}
            >
              {locale === 'tr' ? 'En İyi Fiyatlar' : 'Best Prices'}
            </span>
          </h1>

          {/* Subtitle with fade-in animation */}
          <p 
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in" 
            style={{animationDelay: '0.8s', animationFillMode: 'both'}}
          >
            {locale === 'tr' 
              ? 'Binlerce kaliteli ürün, güvenli ödeme, hızlı kargo ve mükemmel müşteri hizmetiyle alışveriş deneyiminizi yeniden tanımlıyoruz.'
              : 'Redefining your shopping experience with thousands of quality products, secure payment, fast shipping and excellent customer service.'}
          </p>

          {/* CTA Buttons with staggered entrance */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href={`/${locale}/products`} 
              className="animate-slide-in" 
              style={{animationDelay: '1s', animationFillMode: 'both'}}
            >
              <Button size="lg" className="min-w-[200px] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                  />
                </svg>
                {locale === 'tr' ? 'Alışverişe Başla' : 'Start Shopping'}
              </Button>
            </Link>
            <Link 
              href={`/${locale}/categories`} 
              className="animate-slide-in" 
              style={{animationDelay: '1.2s', animationFillMode: 'both'}}
            >
              <Button variant="outline" size="lg" className="min-w-[200px] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50 group">
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                  />
                </svg>
                {locale === 'tr' ? 'Kategorileri Keşfet' : 'Explore Categories'}
              </Button>
            </Link>
          </div>

          {/* Features with staggered animations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Feature 1 - Free Shipping */}
            <div 
              className="flex flex-col items-center text-center animate-slide-in" 
              style={{animationDelay: '1.4s', animationFillMode: 'both'}}
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 border border-primary-200 group hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-primary-200 animate-subtle-pulse">
                <svg className="w-8 h-8 text-primary-600 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === 'tr' ? 'Ücretsiz Kargo' : 'Free Shipping'}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {locale === 'tr'
                  ? '500₺ ve üzeri alışverişlerde ücretsiz ve hızlı kargo'
                  : 'Free and fast shipping on orders over $50'}
              </p>
            </div>

            {/* Feature 2 - Secure Payment */}
            <div 
              className="flex flex-col items-center text-center animate-slide-in" 
              style={{animationDelay: '1.6s', animationFillMode: 'both'}}
            >
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4 border border-secondary-200 group hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-secondary-200 animate-subtle-pulse" style={{animationDelay: '1s'}}>
                <svg className="w-8 h-8 text-secondary-600 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === 'tr' ? 'Güvenli Ödeme' : 'Secure Payment'}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {locale === 'tr'
                  ? 'SSL sertifikası ve güvenli ödeme altyapısı'
                  : 'SSL certificate and secure payment infrastructure'}
              </p>
            </div>

            {/* Feature 3 - 24/7 Support */}
            <div 
              className="flex flex-col items-center text-center animate-slide-in" 
              style={{animationDelay: '1.8s', animationFillMode: 'both'}}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-gray-200 group hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-gray-200 animate-subtle-pulse" style={{animationDelay: '2s'}}>
                <svg className="w-8 h-8 text-gray-600 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === 'tr' ? '24/7 Destek' : '24/7 Support'}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {locale === 'tr'
                  ? 'Günün her saati müşteri hizmetleri desteği'
                  : '24/7 customer service support'}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroServerAnimated;
