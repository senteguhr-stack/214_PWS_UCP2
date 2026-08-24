# IklimAPI

SaaS API penyedia data cuaca & iklim kota-kota di Indonesia — dibuat untuk tugas
mata kuliah Pemrograman Web Server (PWS). Terinspirasi dari layanan seperti
OpenWeatherMap / OpenRouter: pengguna mendaftar, mendapat API key, lalu memakai
key tersebut untuk mengakses data.

## Fitur

- Registrasi & login dengan **JWT** (untuk mengakses dashboard developer)
- Setiap user otomatis mendapat **API key**, bisa membuat key tambahan, menonaktifkan, atau menghapus
- Endpoint data (produk utama) dilindungi **API key** (`x-api-key`), lengkap dengan usage tracking (`request_count`, `last_used_at`)
- Data cuaca 10 kota besar Indonesia, 10 hari terakhir per kota (100 baris data)
- Endpoint agregasi statistik (rata-rata suhu, curah hujan total, breakdown kondisi cuaca per kota)
- Struktur MVC: `models/`, `controllers/`, `routes/`, `middleware/`

## Tech Stack

- Express.js
- Sequelize ORM + PostgreSQL (Supabase)
- JSON Web Token (jsonwebtoken)
- bcryptjs (hash password)
- Deploy: Vercel

## Struktur Folder

```
iklim-api/
├── api/index.js          # entry point Vercel serverless
├── app.js                # konfigurasi express utama
├── config/                # koneksi database
├── models/                # User, ApiKey, City, WeatherRecord + relasi
├── migrations/             # skema tabel (sequelize-cli)
├── controllers/            # logic bisnis
├── routes/                 # definisi endpoint
├── middleware/              # authJwt, authApiKey, errorHandler
├── seeders/                 # data 10 kota + generator 100 data cuaca
└── vercel.json
```

## ERD (ringkas)

```
users (1) ───< (N) api_keys
cities (1) ───< (N) weather_records
```

- `users` — akun developer yang mendaftar
- `api_keys` — API key milik user, dipakai untuk mengakses data
- `cities` — master data kota
- `weather_records` — data cuaca harian per kota (data inti yang "dijual")

Diagram ERD, use case, dan activity diagram lengkap ada di laporan PDF terpisah.

## Setup Lokal

1. Clone repo & install dependency
   ```bash
   git clone <repo-url>
   cd iklim-api
   npm install
   ```

2. Copy `.env.example` menjadi `.env`, isi `DATABASE_URL` dari Supabase dan `JWT_SECRET` bebas (string acak panjang).

3. Jalankan migration lalu seeding data:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Jalankan server:
   ```bash
   npm run dev
   ```
   Server jalan di `http://localhost:3000`

## Deploy ke Vercel

1. Push project ke GitHub.
2. Buka [vercel.com](https://vercel.com) → New Project → import repo GitHub ini.
3. Di bagian Environment Variables, tambahkan `DATABASE_URL` dan `JWT_SECRET` (sama seperti `.env`).
4. Deploy. Vercel otomatis mendeteksi `vercel.json` dan menjalankan `api/index.js` sebagai serverless function.
5. Setelah deploy, jalankan migration & seeding sekali dari lokal tapi mengarah ke `DATABASE_URL` Supabase yang sama (Supabase-nya shared, jadi cukup dilakukan sekali, tidak perlu di server Vercel).

## Dokumentasi Endpoint

### Auth (publik)

| Method | Endpoint | Body | Keterangan |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` | Daftar akun baru, otomatis dapat API key & JWT |
| POST | `/api/auth/login` | `{ email, password }` | Login, dapat JWT |
| GET | `/api/auth/me` | - (header `Authorization: Bearer <token>`) | Profil user login |

### API Key Management (butuh JWT — header `Authorization: Bearer <token>`)

| Method | Endpoint | Body | Keterangan |
|---|---|---|---|
| GET | `/api/keys` | - | Daftar semua API key milik user |
| POST | `/api/keys` | `{ label }` | Buat API key baru |
| PATCH | `/api/keys/:id/toggle` | - | Aktif/nonaktifkan key |
| DELETE | `/api/keys/:id` | - | Hapus key |

### Data Cuaca (produk utama — butuh header `x-api-key: <api_key>`)

| Method | Endpoint | Query Params | Keterangan |
|---|---|---|---|
| GET | `/api/v1/cities` | `province, search, page, limit` | Daftar kota |
| GET | `/api/v1/cities/:id` | - | Detail 1 kota |
| GET | `/api/v1/weather` | `city_id, date_from, date_to, condition, page, limit` | Daftar data cuaca |
| GET | `/api/v1/weather/:id` | - | Detail 1 data cuaca |
| GET | `/api/v1/weather/stats/:cityId` | - | Statistik agregat (avg suhu, total hujan, dsb) per kota |

### Contoh request (curl)

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Budi","email":"budi@mail.com","password":"rahasia123"}'

# Akses data cuaca pakai API key hasil register
curl http://localhost:3000/api/v1/weather?city_id=1&limit=5 \
  -H "x-api-key: iklim_live_xxxxxxxxxxxx"

# Statistik kota
curl http://localhost:3000/api/v1/weather/stats/1 \
  -H "x-api-key: iklim_live_xxxxxxxxxxxx"
```

Koleksi Postman siap pakai: lihat `IklimAPI.postman_collection.json`.
