# berkayocer.com

Berkay ÖCER'in kişisel portfolyo sitesi. Next.js (App Router), Tailwind CSS v4, Vercel'de yayında.

## Geliştirme

Node.js 24 gerekir (`.nvmrc`).

```bash
npm install
npm run dev
```

## Ortam değişkenleri

İletişim formu (`/api/contact`) SMTP ile gönderir. `.env.local` içinde:

| Değişken | Açıklama |
| --- | --- |
| `EMAIL_HOST` | SMTP sunucusu |
| `EMAIL_PORT` | 465 (TLS) veya 587 (STARTTLS); varsayılan 587 |
| `EMAIL_USER` | SMTP kullanıcısı / gönderen adres |
| `EMAIL_PASS` | SMTP şifresi (uygulama şifresi) |
| `EMAIL_TO` | Mesajların gideceği adres; boşsa `EMAIL_USER` |

## Komutlar

- `npm run dev`: geliştirme sunucusu
- `npm run build`: production build
- `npm run lint`: ESLint
