
# apoteq — PROJECT.md
> Baca file ini PERTAMA sebelum melakukan apapun di codebase ini.
> Ini adalah sumber kebenaran utama untuk semua keputusan arsitektur, fitur, dan workflow.

---

## 🎯 Apa itu apoteq?

**apoteq** adalah platform informasi obat berbasis web yang terverifikasi secara farmasi, dibangun untuk masyarakat Indonesia. Platform ini menjembatani gap antara informasi obat publik yang tidak terverifikasi dengan pengetahuan profesional apoteker dan tenaga farmasi.

Inspirasi awal berasal dari website informasi obat Fakultas Farmasi Universitas Andalas (Unand), Padang, yang dikembangkan sebagai bagian dari penelitian tesis/disertasi tentang kualitas informasi obat digital untuk masyarakat.

**North star**: Seperti Halodoc, tapi fokus khusus di farmasi — informasi obat yang bisa dipercaya, bisa dikonsultasikan, dan diverifikasi oleh profesional.

---

## 👥 User Roles & Akses

| Role | Deskripsi | Perlu Login? |
|------|-----------|--------------|
| `public` | Masyarakat umum yang mencari informasi obat | ❌ Tidak |
| `pharmacist` | Apoteker terdaftar, bisa submit & edit monografi obat | ✅ Ya |
| `verifier` | Reviewer/editor yang menyetujui konten sebelum publish | ✅ Ya |
| `admin` | Superadmin, manajemen user dan konfigurasi sistem | ✅ Ya |

### Kemampuan per Role

**Public (tanpa login):**
- Cari dan baca informasi obat yang sudah diverifikasi
- Lihat indikasi, dosis, efek samping, kontraindikasi
- Kirim pertanyaan ke apoteker (Tanya Farmasis) — tanpa akun
- Lihat jawaban yang sudah dipublikasikan

**Pharmacist (login required):**
- Semua akses public
- Submit monografi obat baru (status: draft)
- Edit monografi obat yang pernah mereka buat
- Jawab pertanyaan publik di fitur Tanya Farmasis
- Lihat dashboard kontribusi pribadi

**Verifier (login required):**
- Semua akses pharmacist
- Review dan approve/reject draft monografi dari pharmacist
- Tambah catatan editorial pada konten
- Lihat semua queue verifikasi

**Admin (login required):**
- Full access semua fitur
- Manajemen user (approve/suspend akun pharmacist & verifier)
- Konfigurasi kategori obat, tag, dan metadata
- Lihat audit log semua aktivitas
- Analytics dashboard penggunaan platform

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand (client), React Query / SWR (server state)

### Backend & Database
- **Backend**: Supabase (PostgreSQL + Auth + RLS + Realtime)
- **Auth**: Supabase Auth (email/password + magic link)
- **Storage**: Supabase Storage (untuk upload dokumen/lampiran)
- **API**: Next.js Route Handlers + Supabase client

### Deployment
- **Hosting**: Vercel (auto-deploy dari branch `main`)
- **Database**: Supabase hosted (region: ap-southeast-1 Singapore)
- **Domain**: TBD (sementara vercel.app subdomain)

### Dev Tools
- **Linting**: ESLint + Prettier
- **Testing**: Vitest + Playwright (E2E)
- **Git Flow**: `main` (production) → `develop` (staging) → `feature/*` (dev)

---

## 📁 Struktur Folder

```
apoteq/
├── .claude/                    # ← Kamu ada di sini. Baca semua file di folder ini.
│   ├── PROJECT.md              # File ini — context utama
│   ├── ARCHITECTURE.md         # Detail arsitektur teknis & keputusan desain
│   ├── UX-GUIDELINES.md        # Design system, warna, tipografi, komponen
│   └── TASKS.md                # Backlog task yang harus dikerjakan
│
├── docs/
│   └── PRD.md                  # Product Requirements Document lengkap
│
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/           # Route group: halaman publik tanpa auth
│   │   │   ├── page.tsx        # Homepage / landing
│   │   │   ├── obat/           # Daftar & detail obat
│   │   │   │   ├── page.tsx    # Halaman search obat
│   │   │   │   └── [slug]/     # Detail obat
│   │   │   │       └── page.tsx
│   │   │   └── tanya/          # Fitur Tanya Farmasis (publik)
│   │   │       └── page.tsx
│   │   ├── (auth)/             # Route group: halaman auth
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verify-email/
│   │   ├── dashboard/          # Protected: semua role yang login
│   │   │   ├── layout.tsx      # Sidebar + navbar layout
│   │   │   ├── page.tsx        # Dashboard overview
│   │   │   ├── obat/           # Manajemen obat (pharmacist/verifier)
│   │   │   ├── tanya/          # Manajemen Q&A (pharmacist)
│   │   │   ├── verifikasi/     # Queue verifikasi (verifier)
│   │   │   └── admin/          # Admin panel (admin only)
│   │   └── api/                # Route handlers
│   │       ├── drugs/
│   │       └── questions/
│   │
│   ├── components/
│   │   ├── ui/                 # Komponen dasar (Button, Input, Card, Modal)
│   │   ├── layout/             # Navbar, Sidebar, Footer
│   │   ├── drug/               # DrugCard, DrugDetail, DrugForm
│   │   ├── auth/               # LoginForm, RegisterForm
│   │   └── dashboard/          # Stats, Charts, Tables
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Supabase browser client
│   │   │   ├── server.ts       # Supabase server client (SSR)
│   │   │   └── middleware.ts   # Auth middleware
│   │   ├── validations/        # Zod schemas
│   │   └── utils/              # Helper functions
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores
│   └── types/                  # TypeScript type definitions
│
├── supabase/
│   ├── migrations/             # SQL migration files (versioned)
│   └── seed.sql                # Data awal untuk development
│
├── .env.local                  # Environment variables (JANGAN di-commit!)
├── .env.example                # Template env vars (aman di-commit)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🗄️ Database Schema (Supabase/PostgreSQL)

### Tabel Utama

```sql
-- USER PROFILES (extend dari auth.users Supabase)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'pharmacist' 
    CHECK (role IN ('pharmacist', 'verifier', 'admin')),
  sipa_number TEXT,               -- Nomor SIPA untuk apoteker
  institution TEXT,               -- Instansi/apotek
  is_active BOOLEAN DEFAULT false, -- Admin harus approve dulu
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KATEGORI OBAT
CREATE TABLE drug_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DATA OBAT UTAMA
CREATE TABLE drugs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,             -- Nama generik
  brand_names TEXT[],             -- Array nama dagang
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES drug_categories(id),
  drug_class TEXT,                -- Kelas terapi
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'archived')),
  submitted_by UUID REFERENCES profiles(id),
  verified_by UUID REFERENCES profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MONOGRAFI OBAT (konten detail per seksi)
CREATE TABLE drug_monograph_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  drug_id UUID REFERENCES drugs(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL
    CHECK (section_type IN (
      'indication', 'contraindication', 'dosage', 
      'side_effects', 'drug_interactions', 
      'mechanism', 'pharmacokinetics', 'storage',
      'warnings', 'pregnancy_category', 'references'
    )),
  content TEXT NOT NULL,          -- Isi konten (markdown supported)
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PERTANYAAN PUBLIK (Tanya Farmasis)
CREATE TABLE public_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  asker_name TEXT,                -- Opsional, bisa anonim
  asker_email TEXT,               -- Untuk notifikasi jawaban
  drug_id UUID REFERENCES drugs(id), -- Obat terkait (opsional)
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'answered', 'closed')),
  answered_by UUID REFERENCES profiles(id),
  answer_text TEXT,
  answered_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false, -- Tampil di halaman publik?
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOG
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,           -- 'drug.created', 'drug.published', dll
  resource_type TEXT,             -- 'drug', 'question', 'user'
  resource_id UUID,
  metadata JSONB,                 -- Detail tambahan
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) — Prinsip Utama

```sql
-- Drugs: public bisa baca yang status='published'
-- pharmacist bisa baca semua draft milik sendiri
-- verifier bisa baca semua, edit status
-- admin full access

-- Contoh policy untuk tabel drugs:
ALTER TABLE drugs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published drugs viewable by everyone"
  ON drugs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Pharmacists can manage their own drafts"
  ON drugs FOR ALL
  USING (submitted_by = auth.uid());

CREATE POLICY "Verifiers can see all drugs"
  ON drugs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('verifier', 'admin')
    )
  );
```

---

## 🔐 Authentication Flow

### Register
1. User isi form: nama, email, password, role (pharmacist/verifier)
2. Jika `pharmacist`: wajib isi nomor SIPA dan instansi
3. Email verifikasi dikirim via Supabase Auth
4. Setelah verifikasi email, akun masuk status `is_active = false`
5. Admin harus approve akun sebelum bisa login penuh
6. Email notifikasi dikirim ke user saat akun diapprove

### Login
1. Email + password → Supabase Auth
2. Middleware cek `profiles.is_active` — jika false, redirect ke halaman "menunggu persetujuan"
3. Cek `profiles.role` → set di session
4. Redirect ke dashboard sesuai role

### Session Management
- Gunakan `@supabase/ssr` untuk session di Next.js App Router
- Middleware di `src/middleware.ts` handle refresh token otomatis
- Protected routes: semua `/dashboard/*` butuh session valid

---

## 🎨 Design System

Lihat detail lengkap di `.claude/UX-GUIDELINES.md`.

**Ringkasan:**
- **Warna primer**: Hijau teal `#01696f` (mirip website Farmasi Unand asli)
- **Background**: Warm white / off-white (bukan pure white)
- **Font display**: Instrument Serif (untuk heading besar)
- **Font body**: General Sans / Satoshi (untuk UI dan body text)
- **Tone**: Professional, trustworthy, clean — seperti platform medis terpercaya
- **North star UI/UX**: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

---

## 🚀 Environment Variables

File `.env.local` (TIDAK di-commit ke git):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=apoteq

# Email (opsional, Supabase handle default)
# RESEND_API_KEY=re_...
```

---

## 📋 Aturan Penting untuk AI

1. **SELALU baca file ini + `ARCHITECTURE.md` sebelum mulai coding**
2. **JANGAN buat localStorage/sessionStorage** — gunakan Supabase session
3. **SEMUA mutation harus melalui server actions atau route handlers** — bukan langsung dari client ke Supabase (kecuali read dengan RLS)
4. **Validasi dengan Zod** di semua form dan API endpoint
5. **RLS harus aktif** di semua tabel Supabase — jangan bypass dengan service role di client
6. **TypeScript strict** — tidak boleh ada `any` tanpa komentar justifikasi
7. **Semua text UI dalam Bahasa Indonesia** — kecuali nama brand/teknis
8. **Mobile first** — setiap komponen harus responsif mulai 375px
9. **Aksesibilitas** — semua interactive element harus keyboard-navigable
10. **Jangan hardcode data** — semua konten dari Supabase, bukan dari kode

---

## 📌 Status Proyek

- **Fase saat ini**: Inisialisasi & setup
- **Branch aktif**: `develop`
- **Repo**: https://github.com/zakiulfahmijailani/apoteq
- **Last updated**: Maret 2026

Untuk daftar task yang harus dikerjakan, lihat `.claude/TASKS.md`.
```
