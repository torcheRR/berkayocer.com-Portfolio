# berkayocer.com

Berkay Öcer'in kişisel portfolyo sitesi. Next.js 16 (App Router), Tailwind CSS v4, içerik yönetimi için Sanity; Vercel'de yayında.

## Geliştirme

Node.js 24 gerekir (`.nvmrc`). Sanity Studio en az Node 22.12 ister.

```bash
npm install
npm run dev
```

Site `http://localhost:3000`, içerik paneli `http://localhost:3000/studio` adresinde açılır.

Her PR'da ve main'e her push'ta GitHub Actions lint, tip kontrolü ve birim testlerini çalıştırır (`.github/workflows/ci.yml`).

## İçerik nereden geliyor?

UI içeriği yalnızca `src/lib/content` üzerinden okur. Kaynak ortam değişkenine göre seçilir:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` tanımlıysa **Sanity** (panelden yönetilir).
- Tanımlı değilse ya da `CONTENT_SOURCE=local` ise `src/content/*.ts` içindeki **yerel seed verisi**.

İki kaynak da aynı Zod şemalarından (`src/lib/content/schemas.ts`) geçer. Yerel seed'de hatalı içerik build'i durdurur; Sanity'de hatalı tek bir kayıt atlanır ve sunucu loguna yazılır.

## Sanity kurulumu (bir kez)

1. **Proje oluştur.** [sanity.io/manage](https://www.sanity.io/manage) → Create project (Free). Dataset adı `production`, görünürlük **Public**. Project ID'yi not al.
2. **CORS.** Proje → API → CORS origins: `http://localhost:3000` ve `https://berkayocer.com` ekle, ikisinde de *Allow credentials* açık olsun.
3. **Yerel ortam.** `.env.local` dosyasına ekle (bkz. `.env.example`):
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=<Editor yetkili token>
   ```
   Token: Proje → API → Tokens → Add API token (Editor). Bu token yalnızca içerik taşıma script'i içindir; Vercel'e **eklenmez**.
4. **İçeriği taşı.** Mevcut içerik ve portre Sanity'ye aktarılır:
   ```bash
   npm run seed:sanity -- --dry   # önce ne yapılacağını gör
   npm run seed:sanity            # olmayan belgeleri oluşturur, panel düzenlemelerine dokunmaz
   ```
   `--force` tüm belgeleri seed'deki haliyle değiştirir; panelde yaptığın değişiklikler kaybolur.
5. **Vercel ortam değişkenleri** (Settings → Environment Variables, Production + Preview):

   | Değişken | Tür | Değer |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Config | Project ID |
   | `NEXT_PUBLIC_SANITY_DATASET` | Config | `production` |
   | `SANITY_REVALIDATE_SECRET` | **Secret** | `openssl rand -hex 32` çıktısı |

   Sıra önemli: Vercel'e Project ID eklenmeden önce 4. adım tamamlanmış olmalı. Aksi halde build, Sanity'de profil bulamadığı için durur.
6. **Webhook (anında yayın).** Proje → API → Webhooks → Create:
   - URL: `https://berkayocer.com/api/revalidate`
   - Dataset: `production`, Trigger on: **Create, Update, Delete**
   - Filter: `_type in ["profile", "project", "technology", "experience", "education"]`
   - Projection: `{_type}`
   - Drafts: kapalı, HTTP method: POST, API version: formdaki varsayılan
   - Secret: 5. adımdaki `SANITY_REVALIDATE_SECRET` ile aynı değer

   "Yayınla"dan birkaç saniye sonra değişiklik canlıdadır. Webhook bir kez kaçarsa içerik en geç bir saat içinde kendiliğinden yenilenir.

## İletişim formu

`/api/contact` SMTP ile gönderir. `.env.local` ve Vercel'de:

| Değişken | Açıklama |
| --- | --- |
| `EMAIL_HOST` | SMTP sunucusu |
| `EMAIL_PORT` | 465 (TLS) veya 587 (STARTTLS); varsayılan 587 |
| `EMAIL_USER` | SMTP kullanıcısı / gönderen adres |
| `EMAIL_PASS` | SMTP şifresi (uygulama şifresi); Vercel'de **Secret** |
| `EMAIL_TO` | Mesajların gideceği adres; boşsa `EMAIL_USER` |

## Komutlar

- `npm run dev`: geliştirme sunucusu (Sanity verisi önbelleksiz okunur)
- `npm run build`: production build
- `npm run lint`: ESLint
- `npm run seed:sanity`: yerel seed içeriğini Sanity'ye taşır

## Bilinen davranışlar

- Panelden yeni eklenen bir proje sayfası ilk ziyarette üretilip önbelleğe alınır. Var olmayan bir proje adresi 404 döner; bu sayfa JavaScript ile çizilir.
- Sanity Free planında dataset herkese açıktır: panele gizli bilgi yazma.
