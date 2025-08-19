# Frontend Developer - 2. Aşama Task: Çok Dilli, SEO Optimizasyonlu, Performans Odaklı E-Ticaret Platformu

## Görev Tanımı

Next.js kullanarak **Fake Store API** üzerinden ürünleri listeleyen, kategori bazlı filtreleme yapan, çok dilli (**TR/EN**) ve SEO dostu bir e-ticaret frontend uygulaması geliştirin. Proje, yüksek performans, temiz component yapısı ve profesyonel UI/UX ile teslim edilmelidir.

## Veri Kaynağı (API)

Uygulamada kullanılacak tüm ürün verileri **Fake Store API** üzerinden çekilmelidir.

-   **API Adresi:** `https://fakestoreapi.com/`
-   **Ürün Listesi için Endpoint:** `GET /products`
-   **Ürün Detayı için Endpoint:** `GET /products/:id`

## Teknolojiler

-   **Next.js 14+** (App Router)
-   **TypeScript**
-   **TailwindCSS**
-   **next-intl** veya **next-i18next** (Çoklu dil desteği için)
-   **ISR (Incremental Static Regeneration)** / **SSG (Static Site Generation)**
-   **Redux Toolkit (RTK)** (State yönetimi için)

## Fonksiyonel Gereksinimler

1.  **Ana Sayfa**
    -   Öne çıkan ürünler listelenmeli (API'den gelen ilk 4 ürün).

2.  **Ürün Listesi Sayfası**
    -   Ürünler grid (ızgara) yapısında gösterilmeli.
    -   Fiyat aralığı ve kategoriye göre filtreleme seçenekleri sunulmalı.
    -   Fiyata göre artan/azalan şekilde sıralama yapılabilmeli.

3.  **Ürün Detay Sayfası**
    -   Büyük ürün görseli, fiyat, açıklama ve kategori bilgileri gösterilmeli.
    -   "Sepete Ekle" butonu bulunmalı.

4.  **Sepet Sayfası**
    -   Sepete eklenen ürünler listelenmeli.
    -   Her ürünün adedi değiştirilebilmeli ve ürün sepetten silinebilmelidir.

5.  **Çok Dilli Destek**
    -   Uygulama **Türkçe** ve **İngilizce** dillerini desteklemelidir (`next-intl` veya `next-i18next` kullanılabilir).

6.  **SEO Optimizasyonu**
    -   Sayfalar **SSR (Server-Side Rendering)** veya **ISR** kullanılarak oluşturulmalı.
    -   Dinamik meta etiketleri kullanılmalı (örneğin, ürün adına göre `title`, `description`).

7.  **Performans Optimizasyonu**
    -   Görseller `next/image` ile tembel yükleme (lazy load) yapılmalı.
    -   Veri çekme stratejilerinde **ISR** ile önbellekleme kullanılmalı.
    -   Gereksiz yeniden render (re-render) işlemlerinin önüne geçilmeli.

## UI/UX Gereksinimleri

-   **TailwindCSS** ile tamamen responsive (mobil uyumlu) bir tasarım yapılmalıdır.
-   Tekrar kullanılabilir (reusable) component'ler oluşturulmalıdır (Örn: `Card`, `Button`, `Layout`, `Header`, `Footer`).
-   Ürün kartları, sepet listesi ve kullanıcıya görsel geri bildirim sağlayan bileşenler (toast, modal vb.) tasarlanmalıdır.

## Ekstra Değerlendirme Kriterleri

-   **Lighthouse** skorları **90+** olmalıdır (Performance, SEO, Accessibility).
-   Kodun modüler, okunabilir ve sürdürülebilir olması.
-   Component ve layout yapılarının birbirinden ayrılmış olması.
-   Anlamlı ve açıklayıcı commit mesajları kullanılması.

## Süre ve Teslim

-   **Süre:** 7 gün
-   **Commit:** Günlük ilerlemeyi gösteren düzenli commit'ler atılmalıdır.
-   **Teslim:** GitHub repository linki ve canlı demo linki (Vercel, Netlify vb. platformlarda yayınlanmış) iletilmelidir.