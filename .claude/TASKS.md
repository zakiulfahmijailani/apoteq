# apoteq — TASKS.md
> Backlog awal implementasi.
> Kerjakan berurutan. Jangan loncat ke fitur kompleks sebelum fondasi selesai.

---

## 0. Rules of Execution

Sebelum mengerjakan task:
1. baca `PROJECT.md`
2. baca `ARCHITECTURE.md`
3. baca `UX-GUIDELINES.md`
4. pahami task ini
5. kerjakan satu task sampai selesai
6. commit dengan pesan yang jelas

---

## 1. Project Setup

### T1.1 Initialize Next.js app
- setup Next.js App Router
- setup TypeScript
- setup Tailwind
- setup ESLint
- setup folder structure awal

### T1.2 Install core dependencies
- `@supabase/supabase-js`
- `@supabase/ssr`
- `zod`
- `react-hook-form`
- `@hookform/resolvers`
- `lucide-react`
- optional state lib jika perlu

### T1.3 Setup env files
- `.env.example`
- `.env.local`
- define Supabase URL + anon key + service role key placeholders

### T1.4 Setup code quality
- lint scripts
- format scripts
- optional prettier config

**Definition of done**
- app jalan lokal
- folder structure sesuai
- env example tersedia
- lint berhasil

---

## 2. Supabase Foundation

### T2.1 Create Supabase project
- region Singapore
- simpan URL dan keys

### T2.2 Create migrations
Buat migration untuk:
- `profiles`
- `drug_categories`
- `drugs`
- `drug_monograph_sections`
- `public_questions`
- `audit_logs`

### T2.3 Enable RLS
- aktifkan RLS di semua tabel
- tambahkan policies minimal untuk public read published drugs

### T2.4 Seed basic categories
- analgesik
- antibiotik
- antipiretik
- antihistamin
- gastrointestinal
- dll

**Definition of done**
- migration sukses dijalankan
- schema terbentuk
- RLS aktif
- seed data ada

---

## 3. Auth & Profiles

### T3.1 Supabase auth client setup
- browser client
- server client
- middleware helper

### T3.2 Register page
- form register pharmacist/verifier
- fields sesuai role
- zod validation
- insert ke `profiles`

### T3.3 Login page
- email + password
- error handling jelas
- redirect sesuai role

### T3.4 Pending approval page
- user yang belum aktif diarahkan ke halaman ini

### T3.5 Logout flow
- logout button
- session clear
- redirect ke homepage

**Definition of done**
- user bisa register
- user bisa login
- pending approval flow jalan
- profile row tercipta

---

## 4. Public App Shell

### T4.1 Build public layout
- navbar
- footer
- dark mode toggle
- responsive mobile nav

### T4.2 Homepage
- hero
- search bar
- intro platform
- trust signal
- CTA ke drug search dan Tanya Farmasis

### T4.3 About section/page
- jelaskan apa itu apoteq
- disclaimer
- bagaimana verifikasi bekerja

**Definition of done**
- public pages punya layout rapi
- mobile responsive
- CTA jelas

---

## 5. Public Drug Discovery

### T5.1 Drug listing page
- fetch published drugs
- search by name
- filter kategori
- status badge verified
- pagination/simple load more

### T5.2 Drug detail page
- by slug
- tampilkan section monograph
- tampilkan verified by + updated at
- disclaimer medis

### T5.3 Empty state & loading state
- skeleton
- no result state

**Definition of done**
- public bisa cari obat
- public bisa buka detail obat
- loading/error/empty state tersedia

---

## 6. Dashboard Shell

### T6.1 Protected dashboard layout
- sidebar
- topbar
- role-aware nav items

### T6.2 Dashboard overview
- placeholder stats cards
- quick actions
- role-based dashboard variants

### T6.3 Route guards
- only authenticated users
- role-based access checks

**Definition of done**
- dashboard shell reusable
- role nav tampil benar
- unauthorized users diblok

---

## 7. Pharmacist Workflow

### T7.1 My Drugs page
- list draft/published milik user
- filter by status

### T7.2 Create drug draft
- create drug basic metadata
- create monograph sections
- save as draft

### T7.3 Edit draft
- edit allowed only if own draft and not locked
- update sections

### T7.4 Submit for review
- ubah status draft → review

**Definition of done**
- pharmacist bisa buat draft
- pharmacist bisa edit draft
- pharmacist bisa submit review

---

## 8. Verifier Workflow

### T8.1 Verification queue page
- tampilkan semua drugs status review
- filter/sort

### T8.2 Review detail page
- compare metadata + sections
- reviewer notes field

### T8.3 Approve / reject action
- approve → status published
- reject/request revision → kembali ke draft/revision state

### T8.4 Audit logging
- semua keputusan review masuk audit_logs

**Definition of done**
- verifier bisa lihat queue
- verifier bisa approve/reject
- audit log tercatat

---

## 9. Public Questions (Tanya Farmasis)

### T9.1 Public question form
- submit pertanyaan publik
- optional related drug
- success state

### T9.2 Pharmacist question inbox
- lihat pertanyaan pending
- filter unanswered

### T9.3 Answer question
- pharmacist menjawab
- set published true/false

### T9.4 Public Q&A list
- tampilkan pertanyaan terjawab yang published

**Definition of done**
- pertanyaan publik bisa masuk
- farmasis bisa menjawab
- jawaban published bisa dibaca publik

---

## 10. Admin Features

### T10.1 User management
- list pharmacist/verifier/admin
- approve user
- suspend user
- search/filter

### T10.2 Content admin view
- lihat semua drugs
- lihat semua questions
- override jika perlu

### T10.3 Audit logs page
- tampilkan aktivitas utama
- filter by date/user/action

**Definition of done**
- admin bisa approve akun
- admin bisa manage user
- admin bisa lihat audit logs

---

## 11. UX Polish

### T11.1 Design system refinement
- final button states
- final input states
- consistent spacing
- badges and alerts

### T11.2 Feedback states
- toast/inline feedback
- empty states
- loading states
- error states

### T11.3 Mobile refinement
- responsive fixes public pages
- responsive fixes dashboard

**Definition of done**
- UI konsisten
- tidak ada broken layout di mobile
- feedback states lengkap

---

## 12. Security & Data Integrity

### T12.1 Review RLS policies
- test tiap role
- test public access
- test unauthorized access

### T12.2 Validate all server actions
- zod validation
- no unsafe mutation

### T12.3 Secret handling review
- no service role in client
- env variables aman

**Definition of done**
- access control aman
- validation lengkap
- no sensitive exposure

---

## 13. Testing

### T13.1 Basic unit/integration coverage
- validation helpers
- role guards
- utility functions

### T13.2 E2E tests
- register/login
- public drug search
- create draft
- submit review
- approve draft

### T13.3 Manual QA checklist
- mobile
- dark mode
- accessibility
- loading states

**Definition of done**
- critical paths tested
- no blocker bug di flow utama

---

## 14. Deployment

### T14.1 Vercel setup
- connect repo
- set env vars
- preview deploys

### T14.2 Production Supabase config
- envs production
- redirect URL auth

### T14.3 Final smoke test
- login
- public pages
- dashboard actions

**Definition of done**
- app deployed
- auth works in production
- public pages accessible

---

## 15. Nice-to-Have After v1

Kerjakan hanya setelah semua task inti selesai.

- saved search / favorites
- version history monograph
- change diff between revisions
- richer markdown editor
- reviewer comments thread
- analytics charts
- multilingual support
- AI-assisted draft helper untuk pharmacist
- citation/reference management untuk tiap monograph

---

## 16. Suggested Git Branching

- `main` → production
- `develop` → active integration
- `feature/auth`
- `feature/public-drugs`
- `feature/pharmacist-dashboard`
- `feature/verifier-workflow`
- `feature/public-questions`
- `feature/admin-panel`

---

## 17. First Task Recommendation

Mulai dari urutan ini:

1. T1 Project Setup
2. T2 Supabase Foundation
3. T3 Auth & Profiles
4. T4 Public App Shell
5. T5 Public Drug Discovery

Jangan langsung bikin dashboard verifier/admin sebelum search obat publik jadi.

---

## 18. Definition of MVP

Versi MVP dianggap selesai jika:

- public bisa cari dan baca informasi obat published
- pharmacist bisa register/login
- admin bisa approve pharmacist
- pharmacist bisa buat draft obat
- verifier bisa approve draft jadi published
- public bisa kirim pertanyaan
- pharmacist bisa jawab pertanyaan
- semua berjalan di Vercel + Supabase