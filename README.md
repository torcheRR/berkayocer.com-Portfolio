# berkayocer.com

Berkay Öcer'in kişisel portfolyo sitesi. Next.js 16 (App Router), Tailwind CSS v4, içerik yönetimi için Sanity; Vercel'de yayında.

## Geliştirme

Node.js 24 gerekir (`.nvmrc`). Sanity Studio en az Node 22.12 ister.

```bash
npm install
npm run dev
```

Site `http://localhost:3000`, içerik paneli `http://localhost:3000/studio` adresinde açılır.

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
   | `SANITY_API_READ_TOKEN` | **Sensitive** (yalnızca Production) | Viewer yetkili token, bkz. [Önizleme](#önizleme-presentation) |

   Sıra önemli: Vercel'e Project ID eklenmeden önce 4. adım tamamlanmış olmalı. Aksi halde build, Sanity'de profil bulamadığı için durur.
6. **Webhook (anında yayın).** Proje → API → Webhooks → Create:
   - URL: `https://berkayocer.com/api/revalidate`
   - Dataset: `production`, Trigger on: **Create, Update, Delete**
   - Filter: `_type in ["profile", "project", "technology", "experience", "education"]`
   - Projection: `{_type}`
   - Drafts: kapalı, HTTP method: POST, API version: formdaki varsayılan
   - Secret: 5. adımdaki `SANITY_REVALIDATE_SECRET` ile aynı değer

   "Yayınla"dan birkaç saniye sonra değişiklik canlıdadır. Webhook bir kez kaçarsa içerik en geç bir saat içinde kendiliğinden yenilenir.

## Önizleme (Presentation)

`/studio` **Önizleme** aracıyla açılır: solda sitenin taslak hali, sağda belge (dar ekranda sekmeler). Sitede bir metne tıklamak Studio'da o alanı açar. Ziyaretçiler hiçbir şekilde etkilenmez; onlar her zaman önbellekten yayımlanmış içeriği görür.

**Kurulum (bir kez)**

1. Proje → API → Tokens → Add API token → yetki **Viewer**, ad ör. "berkayocer.com önizleme".
2. Token'ı `.env.local` dosyasına `SANITY_API_READ_TOKEN` olarak, Vercel'e de aynı adla **Sensitive** ve yalnızca **Production** ortamına ekle. Ardından yeniden deploy et.
3. Cloudflare (DNS proxy açıksa): HTML'i çerezden bağımsız önbelleğe alan bir kural ("Cache Everything", Edge TTL) olmamalı. Bir Cache Rule ile `__prerender_bypass` çerezi varken ve `/studio*`, `/api/*` yollarında önbellek atlanmalı. Rocket Loader ve Email Obfuscation kapalı olmalı; X-Frame-Options/CSP ekleyen bir Transform Rule bulunmamalı.

**Kullanım**

- Studio'da açık olan belge, yazmayı bıraktıktan yaklaşık bir saniye sonra önizlemede yenilenir. Başka belgelerdeki değişiklikler için önizlemenin yenile düğmesini kullan.
- Önizleme açıkken sitenin normal sekmelerinde de taslaklar görünür; altta **Önizleme** şeridi çıkar ("Studio'da aç", "Önizlemeden çık"). Önizlemeye girmeden önce açık olan site sekmelerini yenile.
- Doğrulamadan geçemeyen bir taslak sitede gösterilmez; altta "N içerik sitede gösterilemiyor" paneli nedenini yazar, Studio içinde tıklayınca hatalı alanı açar. Profil taslağı geçersizse yayımlanmış profil gösterilir.
- Önizlemede animasyonlar kapalıdır ve iletişim formu gönderim yapmaz.
- Her yeni deploy açık önizleme oturumlarını sonlandırır; Studio'dan tekrar açman yeterli.
- Önizleme yalnızca `https://berkayocer.com/studio` ve `http://localhost:3000/studio` üzerinde çalışır (Vercel preview adreslerinde değil).
- Bir şey ters giderse hata sayfasındaki **Önizlemeden çık** düğmesi oturumu kapatır.
- Webhook ayarı değişmez (Drafts kapalı kalır).

**Token yenileme sırası:** yeni Viewer token oluştur → Vercel'de güncelle → yeniden deploy et → eski token'ı iptal et. Ters sıra, deploy bitene kadar açık önizlemeleri hataya düşürür.

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
- `npm test`: birim testleri (stega izin listesi, yönlendirme ve perspektif kuralları)
- `npm run check:leaks -- <adres>`: çalışan bir production sunucusunda ziyaretçi sayfalarında önizleme izi ve token sızıntısı olmadığını denetler (varsayılan `http://localhost:3000`). İstemci dosyası taraması yerel build'i (`.next/static`) okur; `npm run build && npm start` sonrası yerel adresle çalıştır.

## Bilinen davranışlar

- Panelden yeni eklenen bir proje sayfası ilk ziyarette üretilip önbelleğe alınır. Var olmayan bir proje adresi 404 döner; bu sayfa JavaScript ile çizilir.
- Sanity Free planında dataset herkese açıktır: panele gizli bilgi yazma.
