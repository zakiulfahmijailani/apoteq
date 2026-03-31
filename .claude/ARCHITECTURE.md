# apoteq — ARCHITECTURE.md
> File ini menjelaskan arsitektur teknis aplikasi apoteq.
> Baca setelah PROJECT.md.

---

## 1. Tujuan Arsitektur

Arsitektur apoteq harus memenuhi kebutuhan berikut:

- cepat dibangun dan mudah di-scale
- aman untuk data dan role-based access
- mendukung konten publik dan dashboard internal
- mudah dipahami oleh agentic AI
- cocok untuk deployment modern di Vercel + Supabase
- mendukung workflow editorial: draft → review → publish

Aplikasi ini bukan sekadar website statis, tetapi **content platform + professional workflow system** untuk informasi obat yang tervalidasi.

---

## 2. Prinsip Arsitektur

### 2.1 Server-first
Gunakan pendekatan **server-first** pada Next.js App Router:
- data fetching utama dilakukan di server component
- client component hanya untuk interaksi UI
- form mutations melalui server actions atau route handlers

### 2.2 RBAC by database
Hak akses tidak boleh hanya dijaga di frontend.
Semua akses harus dikontrol lewat:
- Supabase Auth
- tabel `profiles`
- Row Level Security (RLS)

### 2.3 Clean separation
Pisahkan dengan jelas:
- public content
- authenticated dashboard
- admin/verifier tools
- shared UI layer
- data layer

### 2.4 AI-friendly codebase
Struktur codebase harus:
- predictable
- modular
- jelas naming-nya
- tidak terlalu clever
- mudah dibaca agentic AI seperti Claude / Antigravity

---

## 3. High-Level System

```text
User Browser
   ↓
Next.js App (Vercel)
   ↓
Supabase Auth
Supabase Postgres
Supabase Storage
```

### Komponen utama:
- **Next.js**: UI, routing, server actions, SSR
- **Supabase Auth**: login/register/session
- **Supabase Postgres**: database utama
- **Supabase Storage**: aset upload jika nanti ada lampiran/gambar/dokumen
- **Vercel**: hosting frontend + deployment

---

## 4. Application Layers

## 4.1 Presentation Layer
Berisi semua tampilan dan UI components.

Lokasi:
- `src/app`
- `src/components`

Isi:
- pages
- layouts
- forms
- cards
- modals
- tables
- navigation
- empty states
- feedback UI

---

## 4.2 Application Layer
Berisi orchestration logic.

Lokasi:
- `src/lib`
- `src/hooks`
- `src/stores`

Isi:
- supabase clients
- auth helpers
- zod schemas
- utility functions
- role guards
- shared constants

---

## 4.3 Domain Layer
Berisi konsep bisnis utama apoteq.

Domain utama:
- Authentication
- Profiles & Roles
- Drugs
- Drug Monographs
- Verification Workflow
- Public Questions
- Audit Logs

Semua nama fungsi, tipe, folder, dan file sebaiknya mengikuti domain ini.

Contoh:
- `createDrugDraft`
- `publishDrug`
- `submitPublicQuestion`
- `approvePharmacistUser`

---

## 4.4 Data Layer
Berisi koneksi database dan policy akses.

Lokasi:
- `src/lib/supabase`
- `supabase/migrations`

Isi:
- typed database access
- query functions
- migrations SQL
- RLS policies
- seed data

---

## 5. Routing Strategy

Gunakan App Router dengan route groups.

```text
src/app/
  (public)/
  (auth)/
  dashboard/
  api/
```

## 5.1 Public Routes
Halaman ini dapat diakses tanpa login.

Contoh:
- `/`
- `/obat`
- `/obat/[slug]`
- `/tanya`
- `/tentang`

## 5.2 Auth Routes
Contoh:
- `/login`
- `/register`
- `/verify-email`
- `/pending-approval`

## 5.3 Protected Dashboard Routes
Contoh:
- `/dashboard`
- `/dashboard/obat`
- `/dashboard/obat/new`
- `/dashboard/obat/[id]/edit`
- `/dashboard/verifikasi`
- `/dashboard/tanya`
- `/dashboard/admin`

---

## 6. Role-Based Access Model

## 6.1 Roles
Role internal:
- `pharmacist`
- `verifier`
- `admin`

Public tidak punya akun wajib, jadi bukan row di `profiles` kecuali nanti ditambah fitur akun user publik.

## 6.2 Access Pattern
Akses dicek di 3 level:

### Frontend level
- sembunyikan menu yang tidak relevan

### Route level
- middleware / server checks redirect jika role tidak sesuai

### Database level
- RLS policies memastikan user tetap tidak bisa akses data terlarang walaupun mem-bypass UI

---

## 7. Auth Architecture

Gunakan Supabase Auth.

### Flow:
1. register user
2. insert profile row
3. set role
4. set `is_active = false`
5. admin approve user
6. setelah approved, user bisa masuk dashboard penuh

### Catatan:
- jangan simpan role di localStorage
- role harus selalu dibaca dari database/profile
- gunakan SSR-safe Supabase client untuk session

---

## 8. Data Model Overview

## 8.1 profiles
Purpose:
- extend dari `auth.users`
- menyimpan role, nama, SIPA, instansi, status aktif

## 8.2 drugs
Purpose:
- entitas utama obat
- nama generik, slug, kategori, status editorial

## 8.3 drug_monograph_sections
Purpose:
- konten isi tiap seksi obat
- section-based supaya fleksibel dan versionable

## 8.4 public_questions
Purpose:
- pertanyaan publik untuk farmasis

## 8.5 audit_logs
Purpose:
- jejak aktivitas penting untuk keamanan dan accountability

---

## 9. Editorial Workflow

Workflow konten obat:

```text
Draft
  ↓
In Review
  ↓
Published
  ↓
Archived (opsional)
```

### Pharmacist
- create draft
- edit own draft

### Verifier
- review draft
- approve / reject / request revision

### Admin
- override jika perlu
- archive / restore

---

## 10. Recommended Query Strategy

### Public Pages
Gunakan server-side fetch.
Contoh:
- daftar obat published
- detail obat by slug
- daftar pertanyaan publik yang sudah publish

### Dashboard Pages
Gunakan:
- SSR untuk initial load
- client hooks untuk interaction/refetch bila perlu

### Mutation
Gunakan:
- server actions untuk form sederhana
- route handlers jika butuh explicit API endpoint

---

## 11. Component Architecture

Pisahkan komponen menjadi:

### UI Primitives
Lokasi: `src/components/ui`
Contoh:
- Button
- Input
- Textarea
- Select
- Badge
- Card
- Dialog
- Sheet
- Table
- Tabs

### Domain Components
Lokasi:
- `src/components/drug`
- `src/components/auth`
- `src/components/dashboard`

Contoh:
- `DrugCard`
- `DrugDetailSection`
- `DrugEditorForm`
- `VerificationQueueTable`
- `PublicQuestionForm`

### Layout Components
Lokasi: `src/components/layout`
Contoh:
- `AppSidebar`
- `TopNavbar`
- `PageHeader`
- `DashboardShell`

---

## 12. Validation Strategy

Semua input wajib divalidasi dengan **Zod**.

Validasi dibutuhkan di:
- form client
- server action
- route handler

Jangan percaya validasi client saja.

Contoh schema:
- login schema
- register pharmacist schema
- create drug schema
- review decision schema
- submit question schema

---

## 13. Error Handling

Semua error handling harus konsisten.

### User-facing
Tampilkan:
- pesan singkat
- konteks apa yang gagal
- action yang bisa dilakukan user

### Developer-facing
Log:
- source action
- payload summary
- stack trace jika perlu

### Jangan lakukan:
- expose raw SQL error ke UI
- tampilkan pesan teknis ke public user

---

## 14. Logging & Audit

Activity penting yang wajib dicatat:
- user register
- admin approve/reject account
- pharmacist create/edit drug
- verifier approve/reject content
- public question submitted
- pharmacist answer question
- admin changes critical settings

Audit logs penting karena ini platform informasi kesehatan.

---

## 15. Performance Strategy

- gunakan server components sebanyak mungkin
- lazy load area dashboard yang berat
- paginate list jika data mulai besar
- gunakan index database pada `slug`, `status`, `created_at`
- jangan fetch seluruh section jika tidak perlu
- gunakan optimized image jika nanti ada aset visual

---

## 16. Security Principles

- aktifkan RLS di semua tabel
- gunakan service role key hanya di server, tidak pernah di client
- sanitize konten rich text/markdown jika nanti editor ditambahkan
- jangan expose hidden draft content ke public routes
- semua admin route harus dicek di server
- email approval flow harus aman dan explicit

---

## 17. Suggested Build Order

### Phase 1
- project setup
- auth setup
- profile table
- basic public pages

### Phase 2
- drug schema
- public drug search
- drug detail page

### Phase 3
- pharmacist dashboard
- create/edit draft

### Phase 4
- verifier dashboard
- approval workflow

### Phase 5
- public Q&A / Tanya Farmasis

### Phase 6
- admin tools
- audit logs
- analytics

---

## 18. Non-Goals (for v1)

Hal-hal berikut jangan dipaksakan di versi awal:
- telemedicine/video consult realtime
- payment gateway
- live chat real-time antar user dan farmasis
- mobile app native
- AI recommendation engine
- OCR resep obat
- e-commerce pharmacy checkout

Fokus v1:
**verified drug information + role-based editorial workflow + public question submission**

---

## 19. Coding Rules

- pakai TypeScript strict
- hindari file terlalu panjang > 300-400 LOC bila bisa dipecah
- satu file satu tanggung jawab utama
- nama function harus eksplisit
- hindari magic values, gunakan constants
- comments hanya jika membantu context
- semua komponen reusable diberi props typed dengan jelas

---

## 20. What AI should do first

Jika AI agent mulai dari nol, urutannya:
1. baca `PROJECT.md`
2. baca `ARCHITECTURE.md`
3. baca `UX-GUIDELINES.md`
4. baca `TASKS.md`
5. setup Next.js + Tailwind + Supabase
6. setup auth flow
7. setup db schema + migrations
8. build public drug listing
9. build dashboard shell
10. build editorial workflow