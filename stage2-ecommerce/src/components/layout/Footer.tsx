import Link from 'next/link';
import { Container } from '@/components/ui';

export default function Footer() {
  const footerSections = [
    {
      title: 'Alışveriş',
      links: [
        { name: 'Tüm Ürünler', href: '/products' },
        { name: 'Kategoriler', href: '/categories' },
        { name: 'Öne Çıkanlar', href: '/featured' },
        { name: 'İndirimler', href: '/sale' },
      ],
    },
    {
      title: 'Hesabım',
      links: [
        { name: 'Giriş Yap', href: '/auth/signin' },
        { name: 'Hesap Oluştur', href: '/auth/signup' },
        { name: 'Siparişlerim', href: '/orders' },
        { name: 'Profil', href: '/profile' },
      ],
    },
    {
      title: 'Müşteri Hizmetleri',
      links: [
        { name: 'İletişim', href: '/contact' },
        { name: 'SSS', href: '/faq' },
        { name: 'Kargo Takibi', href: '/tracking' },
        { name: 'İade & Değişim', href: '/returns' },
      ],
    },
    {
      title: 'Kurumsal',
      links: [
        { name: 'Hakkımızda', href: '/about' },
        { name: 'Kariyer', href: '/careers' },
        { name: 'Basın', href: '/press' },
        { name: 'Blog', href: '/blog' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.017 0H7.983C3.578 0 0 3.578 0 7.983v4.034C0 16.422 3.578 20 7.983 20h4.034C16.422 20 20 16.422 20 12.017V7.983C20 3.578 16.422 0 12.017 0zm1.78 8.75a3.233 3.233 0 11-6.466 0 3.233 3.233 0 016.466 0zM17.5 6.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.23 3.5H3.77C2.24 3.5 1 4.74 1 6.27v7.46C1 15.26 2.24 16.5 3.77 16.5h12.46c1.53 0 2.77-1.24 2.77-2.77V6.27C19 4.74 17.76 3.5 16.23 3.5zM8.5 12.77V7.23L13.5 10l-5 2.77z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <Container>
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-1/2">
                <h3 className="text-lg font-semibold mb-2">
                  Kampanyalardan haberdar olun
                </h3>
                <p className="text-gray-300 mb-4 lg:mb-0">
                  E-posta adresinizi girerek özel indirimler ve yeni ürün haberlerini alın.
                </p>
              </div>
              <div className="lg:w-1/2 lg:pl-8">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-r-md transition-colors duration-200">
                    Abone Ol
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-700">
          <div className="lg:flex lg:items-center lg:justify-between">
            {/* Copyright */}
            <div className="mb-4 lg:mb-0">
              <p className="text-gray-300 text-sm">
                © 2024 Stage 2 E-Commerce. Tüm hakları saklıdır.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Next.js 14, TypeScript ve Tailwind CSS ile geliştirilmiştir.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">Takip edin:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-wrap items-center justify-center lg:justify-start space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Kullanım Şartları
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Çerez Politikası
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                Erişilebilirlik
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Dil:</span>
                <select
                  className="bg-gray-800 border border-gray-600 rounded text-gray-300 text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  defaultValue="tr"
                >
                  <option value="tr">🇹🇷 Türkçe</option>
                  <option value="en">🇺🇸 English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}