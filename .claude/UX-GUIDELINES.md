# apoteq — UX-GUIDELINES.md
> Panduan UI/UX utama untuk apoteq.
> Gunakan repo UI-UX Pro Max sebagai north star, tapi adaptasikan ke konteks farmasi Indonesia.

---

## 1. Design Intent

apoteq harus terasa:

- profesional
- bersih
- tenang
- terpercaya
- modern
- tidak terasa seperti website kampus lama
- tidak terasa seperti template SaaS generik

Visualnya harus membuat user merasa:
“informasi di sini serius, aman, diverifikasi, dan mudah dipahami.”

---

## 2. North Star

North star UI/UX:
- `nextlevelbuilder/ui-ux-pro-max-skill`

Namun, apoteq **bukan** landing page startup.
Ini adalah:
- public information platform
- healthcare knowledge product
- editorial workflow dashboard

Maka UI harus menggabungkan 2 karakter:
1. **trustworthy medical information platform**
2. **clean modern internal dashboard**

---

## 3. Color Direction

Gunakan tone yang dekat dengan website asli Farmasi Unand:
- warm off-white background
- hijau teal sebagai primary
- abu coklat lembut untuk text
- bukan biru neon, bukan ungu startup

## 3.1 Core Palette

### Light mode
- `--color-bg: #f7f6f2`
- `--color-surface: #f9f8f5`
- `--color-surface-2: #fbfbf9`
- `--color-border: #d4d1ca`
- `--color-text: #28251d`
- `--color-text-muted: #7a7974`
- `--color-primary: #01696f`
- `--color-primary-hover: #0c4e54`

### Dark mode
- `--color-bg: #171614`
- `--color-surface: #1c1b19`
- `--color-surface-2: #201f1d`
- `--color-border: #393836`
- `--color-text: #cdccca`
- `--color-text-muted: #797876`
- `--color-primary: #4f98a3`

## 3.2 Semantic Colors
- Success: hijau natural, tidak terlalu terang
- Warning: coklat-oranye muted
- Error: maroon muted, bukan merah menyala
- Info: turunan teal/blue yang lembut

---

## 4. Typography

## 4.1 Font Pairing
Gunakan maksimal 2 font family:

### Preferred
- **Display**: Instrument Serif
- **Body/UI**: General Sans atau Satoshi

Alternatif:
- Display: Boska / Zodiak
- Body: Inter jika perlu fallback

## 4.2 Tone
- heading harus elegan tapi tidak berlebihan
- body text harus sangat readable
- dashboard tetap dominan sans-serif
- serif hanya untuk page-level emphasis, hero, dan section titles tertentu

## 4.3 Type Scale
Gunakan scale yang konsisten:

- xs: labels, metadata
- sm: buttons, nav, helper text
- base: body text default
- lg: section titles kecil
- xl: page titles
- 2xl: hero/public featured content

Jangan terlalu banyak ukuran. Cukup 4–5 level aktif per page.

---

## 5. Layout Style

## 5.1 Public Site
Karakter:
- editorial + institutional
- banyak whitespace
- text-first
- cards secukupnya
- pencarian sangat jelas

### Pola section:
- hero dengan search
- featured drugs / common drugs
- trusted badges / verification explanation
- Tanya Farmasis CTA
- footer informatif

## 5.2 Dashboard
Karakter:
- clean professional tool
- sidebar kiri
- top header tipis
- page title jelas
- content dalam cards/table/forms

Dashboard jangan terasa “marketing page”.

---

## 6. Brand Expression

apoteq tidak perlu terlalu ramai dengan branding decorative.

### Hindari:
- banyak gradient
- glassmorphism berlebihan
- blob background
- glow neon
- icon dalam lingkaran warna-warni di semua tempat
- kartu 3 kolom template AI

### Gunakan:
- grid rapi
- typographic hierarchy
- subtle borders
- teal accent untuk CTA/active state
- cards yang tenang
- whitespace yang cukup

---

## 7. Navigation Pattern

## 7.1 Public Navigation
Menu utama:
- Beranda
- Informasi Obat
- Tanya Farmasis
- Tentang
- Login

CTA utama:
- “Cari Obat”
- “Tanya Farmasis”

## 7.2 Dashboard Navigation
Sidebar items disesuaikan role.

### Pharmacist
- Ringkasan
- Obat Saya
- Buat Draft
- Pertanyaan Publik
- Profil

### Verifier
- Ringkasan
- Queue Verifikasi
- Semua Obat
- Pertanyaan Publik
- Profil

### Admin
- Ringkasan
- User Management
- Obat
- Verifikasi
- Pertanyaan
- Audit Logs
- Pengaturan

---

## 8. Core Public UX

## 8.1 Homepage
Harus menjawab 3 pertanyaan dalam 5 detik:
1. ini platform apa?
2. saya bisa cari apa?
3. apakah info di sini terpercaya?

### Hero wajib berisi:
- headline jelas
- short description
- search bar obat
- trust signal kecil

Contoh arah copy:
- “Informasi obat yang lebih jelas, terverifikasi, dan mudah dipahami.”
- “Ditinjau oleh tenaga farmasi dan disusun untuk kebutuhan masyarakat.”

## 8.2 Drug Search Page
Fokus utama: discoverability.

Harus ada:
- search input besar
- filter kategori
- sort sederhana
- kartu obat atau list view
- status verified
- ringkasan singkat per obat

## 8.3 Drug Detail Page
Struktur harus sangat mudah dipindai.

Urutan rekomendasi:
1. nama obat
2. status verifikasi + reviewer
3. ringkasan singkat
4. indikasi
5. dosis
6. efek samping
7. kontraindikasi
8. interaksi obat
9. peringatan
10. referensi / disclaimer

Tambahkan anchor navigation jika section banyak.

## 8.4 Tanya Farmasis
Form harus terasa aman dan sederhana.
Field jangan terlalu banyak.

Wajib ada:
- pertanyaan
- nama opsional
- email opsional atau wajib tergantung kebutuhan feedback
- obat terkait (opsional)

---

## 9. Dashboard UX

## 9.1 Dashboard Overview
Setiap role punya landing dashboard berbeda.

### Pharmacist dashboard
- jumlah draft
- jumlah published
- pertanyaan yang belum dijawab
- quick actions

### Verifier dashboard
- jumlah pending review
- draft terbaru
- items butuh revisi
- quick actions approve/reject

### Admin dashboard
- total users by role
- total published drugs
- total pending approvals
- recent activity

## 9.2 Table UX
Gunakan table untuk:
- verification queue
- user management
- audit logs

Table harus punya:
- search
- filter
- status badge
- action menu
- empty state

## 9.3 Form UX
Form editorial harus:
- ringan
- tidak intimidatif
- section-based
- autosave bisa dipertimbangkan nanti
- validasi inline

---

## 10. Component Guidelines

## 10.1 Buttons
Variant minimal:
- primary
- secondary
- ghost
- destructive

Primary = teal solid  
Secondary = muted surface  
Ghost = transparent

## 10.2 Cards
Card harus:
- background netral
- border subtle
- shadow sangat ringan atau tanpa shadow
- radius medium, bukan terlalu bulat

## 10.3 Inputs
- label jelas di atas
- helper text opsional
- error text merah muted
- focus ring teal
- placeholder jangan terlalu pucat

## 10.4 Badges
Badge dipakai untuk:
- verified
- pending
- draft
- published
- archived
- role labels

Jangan terlalu colourful.

---

## 11. Status Design

Gunakan sistem visual konsisten.

### Content status
- Draft → muted
- In review → warning
- Published → success / teal-green
- Rejected / needs revision → error

### User status
- Active → success
- Pending approval → warning
- Suspended → error

---

## 12. Motion

Motion harus subtle, bukan theatrical.

Gunakan hanya untuk:
- hover transition
- modal open/close
- sidebar collapse
- accordion section
- table row action feedback
- loading skeleton

Durasi ideal:
- 150–220ms untuk UI interactions
- 220–300ms untuk overlays

Hindari:
- bounce berlebihan
- parallax besar
- animation hero yang distracting

---

## 13. Accessibility

Wajib:
- contrast AA
- body text minimum 16px
- touch targets minimum 44px
- focus state terlihat jelas
- semantic headings
- keyboard accessible modal/dialog
- form labels eksplisit
- icon-only button punya aria-label

---

## 14. Mobile UX

Public pages harus mobile-first.

### Mobile priorities:
- search tetap dominan
- cards stack 1 column
- nav jadi sheet/hamburger
- CTA tetap reachable
- detail obat mudah discroll dan discan
- dashboard di mobile boleh lebih sederhana

### Dashboard mobile:
- sidebar jadi drawer
- tabel bisa jadi card list bila perlu
- jangan paksa horizontal complexity

---

## 15. Content Style

Semua teks UI utama gunakan Bahasa Indonesia.

Tone copy:
- sederhana
- jelas
- tidak terlalu akademik
- tidak terlalu informal

Contoh baik:
- “Cari nama obat”
- “Pertanyaan berhasil dikirim”
- “Menunggu verifikasi”
- “Konten ini telah ditinjau oleh verifikator”

Hindari:
- jargon farmasi tanpa penjelasan
- kalimat marketing berlebihan
- istilah teknis Inggris jika ada padanan Indonesia yang jelas

---

## 16. Trust Signals

Karena ini platform informasi kesehatan, trust signal wajib jelas.

Tambahkan secara halus:
- reviewed by / verified by
- tanggal update terakhir
- disclaimer bukan pengganti konsultasi medis
- asal institusi / kredensial farmasis bila sesuai
- status konten published / reviewed

Trust signal jangan disembunyikan.

---

## 17. Design Do / Don’t

## Do
- gunakan layout yang tenang
- prioritaskan readability
- buat pencarian jadi fokus utama
- tampilkan status verifikasi dengan jelas
- jaga visual tetap premium dan clean

## Don’t
- jangan jadikan ini dashboard SaaS neon
- jangan gunakan ungu startup gradient
- jangan bikin hero terlalu marketing
- jangan memenuhi halaman dengan dekorasi
- jangan gunakan card layout generik 3 kolom terus-menerus

---

## 18. Component Priority Order

AI saat membuat UI sebaiknya mulai dari:
1. app shell
2. typography tokens
3. button/input/card primitives
4. navbar + sidebar
5. homepage hero + search
6. drug list
7. drug detail sections
8. auth forms
9. dashboard tables
10. workflow forms

---

## 19. Final Visual Goal

apoteq harus terasa seperti perpaduan antara:
- platform editorial kesehatan
- produk digital modern
- dashboard profesional farmasi

Jika ragu, pilih:
**lebih tenang, lebih bersih, lebih readable.**