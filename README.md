# Undangan Jawa — Glassmorphism 3D/Animated Frontend

Isi:
- `index.html` — website undangan
- `style.css` — glassmorphism + responsive design
- `script.js` — countdown, falling petals, reveal animation, RSVP demo, copy rekening
- `admin.html` — dashboard admin frontend
- `admin.css` / `admin.js` — dashboard UI + localStorage demo
- `assets/javanese-wedding-bg.png` — background hasil desain

## Jalankan
Cara paling mudah:
1. Extract ZIP.
2. Buka `index.html` di browser.

Untuk development yang lebih nyaman:
- gunakan VS Code + Live Server, atau
- jalankan server lokal sederhana.

## Catatan penting
Versi ini sengaja BELUM menggunakan Supabase.
Semua data admin/RSVP masih `localStorage` browser.

Tahap integrasi berikutnya bisa mengubah:
- data pasangan -> tabel `weddings`
- RSVP -> tabel `rsvps`
- galeri -> Supabase Storage + tabel `gallery`
- rekening/gift -> tabel `gift_accounts`
- dashboard -> login admin + Row Level Security (RLS)
- link tamu -> slug/guest token
- musik -> Supabase Storage


## 🔗 Dynamic Guest Link — tanpa menyimpan nama tamu di Supabase

Nama tamu sekarang bisa dibuat langsung dari URL.

Contoh:

`index.html?to=Andika`

atau:

`index.html?to=Andika%20Pratama`

Ketika URL dibuka:
- nama otomatis muncul pada "Kepada Yth."
- nama otomatis masuk ke sapaan
- judul browser ikut berubah
- field nama RSVP otomatis terisi
- **tidak perlu tabel `guests` di Supabase**

### Saat sudah memakai domain

Contoh:

`https://domainkamu.com/?to=Andika`

`https://domainkamu.com/?to=Andika%20Pratama`

### Cara membuat link untuk banyak tamu

Kamu cukup punya daftar nama di Excel/Google Sheets lalu membuat URL:

`https://domainkamu.com/?to=` + URL-encoded nama

Jadi database Supabase nantinya hanya perlu menyimpan **RSVP yang benar-benar dikirim**, bukan daftar nama tamu.

### Catatan keamanan

Nama URL harus dianggap sebagai input publik. Kode sudah melakukan:
- trimming
- pembatasan panjang
- normalisasi spasi
- HTML escaping

Jangan menggunakan parameter URL untuk data sensitif.


## V3 — Clean Guest URL

Sekarang format utama adalah:

`https://domainkamu.com/andika-pratama`

Website mengambil `andika-pratama` dari pathname lalu mengubahnya menjadi `Andika Pratama`.

Tidak ada:
- tabel master tamu
- input daftar tamu di Supabase
- pencarian nama tamu ke database

Supabase hanya menerima RSVP setelah tamu menekan tombol kirim.

### Catatan hosting
Untuk URL `/nama-tamu` bekerja pada SPA/static hosting, server harus diarahkan ke `index.html` (rewrite/fallback). Konfigurasi rewrite akan kita buat sesuai hosting yang kamu pakai nanti.


## V4 — Admin mengontrol website
Sekarang perubahan data di `admin.html` tersimpan ke `localStorage` dan dibaca oleh `index.html`. Supabase belum digunakan. Pada tahap berikutnya storage ini akan diganti Supabase.
