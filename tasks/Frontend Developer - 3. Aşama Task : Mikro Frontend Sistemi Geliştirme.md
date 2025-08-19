# Frontend Developer - 3. Aşama Task: Mikro Frontend Sistemi Geliştirme

Bu görev, frontend geliştiricilerin mikro-frontend mimarisi, modern build sistemleri (Webpack Module Federation / Next.js Multi-Zone), Tailwind CSS ile UI/UX tasarımı ve frontend bileşenleri arası veri iletişimini sağlama yetkinliklerini ölçmeyi amaçlamaktadır.

## Görev Tanımı

Oluşturulacak Mikro-Frontend Uygulama Yapısı:

-   **home uygulaması:** Ürün listeleme ve ürün detaylarını gösteren ana uygulamadır.
-   **cart uygulaması:** Kullanıcının sepete eklediği ürünleri gösteren bağımsız bir uygulamadır.

## Veri Kaynağı (API)

Uygulamada kullanılacak tüm ürün verileri **Fake Store API** üzerinden çekilmelidir.

-   **API Adresi:** `https://fakestoreapi.com/`
-   **Ürün Listesi için Endpoint:** `GET /products`
-   **Ürün Detayı için Endpoint:** `GET /products/:id`

## Teknolojiler

-   **Next.js** (App Router tercih edilmelidir)
-   **Tailwind CSS**
-   **Module Federation (Webpack 5)** veya **Multi-Zone Architecture**
-   **Docker** ile containerize edilmiş bağımsız frontend servisleri

## Fonksiyonel Gereksinimler

1.  `home` uygulamasında ürünler listelenecek.
2.  Kullanıcı "Add to Cart" butonuna bastığında ürün sepete eklenecek.
3.  `cart` uygulaması, ayrı bir mikro-frontend olarak yapılandırılmış olacak ve sepete eklenen ürünleri gösterecek.

## Tasarım Gereksinimleri

-   **Tailwind CSS** kullanılarak responsive bir UI tasarımı yapılmalıdır.
-   Ürün kartları, sepetteki ürün listesi ve kullanıcıya görsel geri bildirim (toast, modal vb.) gibi bileşenler tasarlanmalı.

## Teknik Gereksinimler

-   Her mikro frontend uygulaması ayrı bir **Docker servisi** olarak çalıştırılmalıdır.
-   `home` ve `cart` uygulamaları kendi bağımsız build süreçlerine sahip olmalı.
-   Build çıktıları farklı portlarda çalışmalı (örn: `home: 3000`, `cart: 3001`).
-   **Module Federation** kullanılıyorsa, ortak komponentler paylaştırılabilir.
-   **Multi-zone** kullanılıyorsa, `next.config.js` içerisinde `rewrites` ve `basePath` ile yönlendirme yapılmalıdır.

## Ekstra Değerlendirme Kriterleri

-   **Docker Compose** kullanarak mikro-frontend yapısını kolayca ayağa kaldırabilme.
-   **SSR** veya **ISR** desteği ile sayfa önbellekleme stratejisi.
-   **RTK** veya benzeri state yönetimlerinin bilinçli seçimi ve kullanımı.
-   Tasarım tutarlılığı (spacing, renk uyumu, buton davranışları vb.).

## Süre ve Teslimat

-   **Süre:** 1 hafta
-   Günlük commit zorunluluğu vardır.
-   **CI/CD pipeline** opsiyoneldir (örneğin: Vercel, Netlify veya GitLab CI).

## Başarı Kriterleri

-   Mikro frontend mimarisi çalışır ve ayrık geliştirme yapılabilir olmalı.
-   Uygulamalar arası veri senkronizasyonu başarılı şekilde çalışmalı.
-   Tasarım, kullanıcı dostu ve temiz bir yapıya sahip olmalı.
-   Uygulama yapılandırması **Docker** ile kolayca ayağa kalkmalı.