# Frontend 1. Aşama Task: Auth0 ile OAuth + JWT Entegrasyonu ve Next.js Middleware Yetkilendirme Sistemi Geliştirme

Auth0 üzerinden kullanıcı girişinin yapıldığı, JWT tabanlı oturum kontrolü ile sayfa erişimi kısıtlanan, SOLID prensiplerine ve 12-Factor ilkelerine uygun, Next.js + NextAuth temelli bir kimlik doğrulama ve yetkilendirme sistemi geliştirilecektir.

## Teknolojiler & Araçlar

-   **Next.js 14+** (App Router)
-   **Auth0** (OAuth Provider)
-   **NextAuth.js**
-   **JWT** (JSON Web Token)
-   **TypeScript**
-   **TailwindCSS** (Login Sayfası)
-   **Git / GitHub** (`dev/v1.0.0`, `prod/v1.0.0`)
-   `.env` ile yapılandırma (12-Factor Uygulaması)

## Görev Adımları

1.  **GitHub Repository Oluşturma**
    -   `next-auth` adında bir `public` repo oluştur.
    -   `dev/v1.0.0` adında bir branch oluştur.
    -   Tüm geliştirmeleri bu branch üzerinde saatlik veya günlük olarak yap.

2.  **Auth0 Kurulumu**
    -   Auth0 üzerinde yeni bir uygulama oluştur ve gerekli kimlik bilgilerini (Client ID, Client Secret, Domain) al.

3.  **NextAuth Entegrasyonu**
    -   Next.js projesine NextAuth.js'i entegre et.
    -   Auth0 provider'ını NextAuth konfigürasyonuna ekle.
    -   Giriş ve çıkış işlemlerini yönet.

4.  **Middleware ile Sayfa Koruma**
    -   Next.js middleware kullanarak korumalı sayfalar oluştur.
    -   Sadece kimlik doğrulaması yapmış kullanıcıların erişebileceği sayfalar belirle.

5.  **Kod Kalitesi & SOLID**
    -   Kodun okunabilir, sürdürülebilir ve ölçeklenebilir olduğundan emin ol.
    -   SOLID prensiplerine uygun bir yapı kur.

6.  **12-Factor App Uyum Kontrolü**
    -   Yapılandırma bilgilerini `.env` dosyalarında tutarak kod tabanından ayır.

7.  **Test & Validasyon**
    -   Giriş, çıkış ve sayfa koruma mekanizmalarının doğru çalıştığını test et.

## Bonus

-   Rol bazlı yetkilendirme (`admin`, `user`) yapısı oluşturabilirsin.
-   Docker konfigürasyonunu gerçekleştirebilirsin.

## Proje Tamamlama
***ÇOK ÖNEMLİ***
-   Geliştirme tamamlandığında `dev/v1.0.0` branch'inden `prod/v1.0.0` branch'ine bir pull request aç ve merge et.
-   Açık, anlaşılır ve açıklamalı commit mesajları kullan.
