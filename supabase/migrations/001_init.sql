-- =========================================================
-- apoteq - 001_init.sql
-- Initial schema for verified drug information platform
-- =========================================================

-- Extensions
create extension if not exists "pgcrypto";

-- =========================================================
-- Utility: updated_at trigger
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- Profiles
-- Extends Supabase auth.users
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'pharmacist'
    check (role in ('pharmacist', 'verifier', 'admin')),
  sipa_number text,
  institution text,
  is_active boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_is_active on public.profiles(is_active);

-- =========================================================
-- Drug Categories
-- =========================================================
create table if not exists public.drug_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists idx_drug_categories_slug on public.drug_categories(slug);

-- =========================================================
-- Drugs
-- =========================================================
create table if not exists public.drugs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand_names text[] not null default '{}',
  slug text not null unique,
  category_id uuid references public.drug_categories(id) on delete set null,
  drug_class text,
  summary text,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  submitted_by uuid references public.profiles(id) on delete set null,
  verified_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_drugs_updated_at
before update on public.drugs
for each row
execute function public.set_updated_at();

create index if not exists idx_drugs_slug on public.drugs(slug);
create index if not exists idx_drugs_status on public.drugs(status);
create index if not exists idx_drugs_category_id on public.drugs(category_id);
create index if not exists idx_drugs_submitted_by on public.drugs(submitted_by);
create index if not exists idx_drugs_verified_by on public.drugs(verified_by);
create index if not exists idx_drugs_created_at on public.drugs(created_at desc);

-- =========================================================
-- Drug Monograph Sections
-- =========================================================
create table if not exists public.drug_monograph_sections (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references public.drugs(id) on delete cascade,
  section_type text not null
    check (
      section_type in (
        'indication',
        'contraindication',
        'dosage',
        'side_effects',
        'drug_interactions',
        'mechanism',
        'pharmacokinetics',
        'storage',
        'warnings',
        'pregnancy_category',
        'references'
      )
    ),
  content text not null,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (drug_id, section_type)
);

create trigger set_drug_monograph_sections_updated_at
before update on public.drug_monograph_sections
for each row
execute function public.set_updated_at();

create index if not exists idx_drug_monograph_sections_drug_id
  on public.drug_monograph_sections(drug_id);

create index if not exists idx_drug_monograph_sections_section_type
  on public.drug_monograph_sections(section_type);

-- =========================================================
-- Public Questions (Tanya Farmasis)
-- =========================================================
create table if not exists public.public_questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  asker_name text,
  asker_email text,
  drug_id uuid references public.drugs(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'answered', 'closed')),
  answered_by uuid references public.profiles(id) on delete set null,
  answer_text text,
  answered_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_public_questions_updated_at
before update on public.public_questions
for each row
execute function public.set_updated_at();

create index if not exists idx_public_questions_status on public.public_questions(status);
create index if not exists idx_public_questions_drug_id on public.public_questions(drug_id);
create index if not exists idx_public_questions_answered_by on public.public_questions(answered_by);
create index if not exists idx_public_questions_is_published on public.public_questions(is_published);
create index if not exists idx_public_questions_created_at on public.public_questions(created_at desc);

-- =========================================================
-- Audit Logs
-- =========================================================
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource_type text,
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_user_id on public.audit_logs(user_id);
create index if not exists idx_audit_logs_action on public.audit_logs(action);
create index if not exists idx_audit_logs_resource_type on public.audit_logs(resource_type);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- =========================================================
-- Helper functions for role checks
-- SECURITY DEFINER is used carefully for policy checks only
-- =========================================================
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select is_active
    from public.profiles
    where id = auth.uid()
    limit 1
  ), false);
$$;

create or replace function public.has_role(_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select role = any(_roles) and is_active = true
    from public.profiles
    where id = auth.uid()
    limit 1
  ), false);
$$;

-- =========================================================
-- Auto-create profile on auth signup
-- default role = pharmacist
-- admin/verifier adjustment can be done later by admin
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    role,
    is_active
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'pharmacist'),
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================================================
-- Enable RLS
-- =========================================================
alter table public.profiles enable row level security;
alter table public.drug_categories enable row level security;
alter table public.drugs enable row level security;
alter table public.drug_monograph_sections enable row level security;
alter table public.public_questions enable row level security;
alter table public.audit_logs enable row level security;

-- =========================================================
-- Profiles policies
-- =========================================================

-- Users can view their own profile
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

-- Admin can view all profiles
create policy "profiles_admin_select_all"
on public.profiles
for select
to authenticated
using (public.has_role(array['admin']));

-- Users can update their own basic profile
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Admin can update all profiles
create policy "profiles_admin_update_all"
on public.profiles
for update
to authenticated
using (public.has_role(array['admin']))
with check (public.has_role(array['admin']));

-- No public insert/delete from client for profiles
-- handled by trigger and admin workflows

-- =========================================================
-- Drug categories policies
-- =========================================================

-- Everyone can read categories
create policy "drug_categories_public_read"
on public.drug_categories
for select
to anon, authenticated
using (true);

-- Admin can manage categories
create policy "drug_categories_admin_all"
on public.drug_categories
for all
to authenticated
using (public.has_role(array['admin']))
with check (public.has_role(array['admin']));

-- =========================================================
-- Drugs policies
-- =========================================================

-- Public can read published drugs
create policy "drugs_public_read_published"
on public.drugs
for select
to anon, authenticated
using (status = 'published');

-- Pharmacist can read own submitted drugs
create policy "drugs_pharmacist_read_own"
on public.drugs
for select
to authenticated
using (
  submitted_by = auth.uid()
  and public.has_role(array['pharmacist'])
);

-- Pharmacist can insert own drafts
create policy "drugs_pharmacist_insert"
on public.drugs
for insert
to authenticated
with check (
  public.has_role(array['pharmacist'])
  and submitted_by = auth.uid()
  and status in ('draft', 'review')
);

-- Pharmacist can update own non-published drugs
create policy "drugs_pharmacist_update_own"
on public.drugs
for update
to authenticated
using (
  submitted_by = auth.uid()
  and public.has_role(array['pharmacist'])
  and status in ('draft', 'review')
)
with check (
  submitted_by = auth.uid()
  and public.has_role(array['pharmacist'])
  and status in ('draft', 'review')
);

-- Verifier can read all drugs
create policy "drugs_verifier_select_all"
on public.drugs
for select
to authenticated
using (public.has_role(array['verifier', 'admin']));

-- Verifier/admin can update all drugs
create policy "drugs_verifier_update_all"
on public.drugs
for update
to authenticated
using (public.has_role(array['verifier', 'admin']))
with check (public.has_role(array['verifier', 'admin']));

-- Admin can delete drugs if needed
create policy "drugs_admin_delete"
on public.drugs
for delete
to authenticated
using (public.has_role(array['admin']));

-- =========================================================
-- Drug monograph sections policies
-- =========================================================

-- Public can read sections only if parent drug is published
create policy "drug_sections_public_read_published_parent"
on public.drug_monograph_sections
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.drugs d
    where d.id = drug_monograph_sections.drug_id
      and d.status = 'published'
  )
);

-- Pharmacist can read own draft/review sections
create policy "drug_sections_pharmacist_read_own"
on public.drug_monograph_sections
for select
to authenticated
using (
  exists (
    select 1
    from public.drugs d
    where d.id = drug_monograph_sections.drug_id
      and d.submitted_by = auth.uid()
      and public.has_role(array['pharmacist'])
  )
);

-- Pharmacist can insert sections for own drugs
create policy "drug_sections_pharmacist_insert_own"
on public.drug_monograph_sections
for insert
to authenticated
with check (
  exists (
    select 1
    from public.drugs d
    where d.id = drug_monograph_sections.drug_id
      and d.submitted_by = auth.uid()
      and d.status in ('draft', 'review')
      and public.has_role(array['pharmacist'])
  )
);

-- Pharmacist can update sections for own non-published drugs
create policy "drug_sections_pharmacist_update_own"
on public.drug_monograph_sections
for update
to authenticated
using (
  exists (
    select 1
    from public.drugs d
    where d.id = drug_monograph_sections.drug_id
      and d.submitted_by = auth.uid()
      and d.status in ('draft', 'review')
      and public.has_role(array['pharmacist'])
  )
)
with check (
  exists (
    select 1
    from public.drugs d
    where d.id = drug_monograph_sections.drug_id
      and d.submitted_by = auth.uid()
      and d.status in ('draft', 'review')
      and public.has_role(array['pharmacist'])
  )
);

-- Verifier/admin can read all sections
create policy "drug_sections_verifier_select_all"
on public.drug_monograph_sections
for select
to authenticated
using (public.has_role(array['verifier', 'admin']));

-- Verifier/admin can update all sections
create policy "drug_sections_verifier_update_all"
on public.drug_monograph_sections
for update
to authenticated
using (public.has_role(array['verifier', 'admin']))
with check (public.has_role(array['verifier', 'admin']));

-- =========================================================
-- Public questions policies
-- =========================================================

-- Public can insert questions
create policy "public_questions_public_insert"
on public.public_questions
for insert
to anon, authenticated
with check (true);

-- Public can read only published answered questions
create policy "public_questions_public_read_published"
on public.public_questions
for select
to anon, authenticated
using (
  is_published = true
  and status = 'answered'
);

-- Pharmacist/verifier/admin can read all questions
create policy "public_questions_staff_select_all"
on public.public_questions
for select
to authenticated
using (public.has_role(array['pharmacist', 'verifier', 'admin']));

-- Pharmacist/verifier/admin can update questions
create policy "public_questions_staff_update"
on public.public_questions
for update
to authenticated
using (public.has_role(array['pharmacist', 'verifier', 'admin']))
with check (public.has_role(array['pharmacist', 'verifier', 'admin']));

-- Admin can delete questions
create policy "public_questions_admin_delete"
on public.public_questions
for delete
to authenticated
using (public.has_role(array['admin']));

-- =========================================================
-- Audit logs policies
-- =========================================================

-- Admin can read all logs
create policy "audit_logs_admin_select_all"
on public.audit_logs
for select
to authenticated
using (public.has_role(array['admin']));

-- Staff can insert logs
create policy "audit_logs_staff_insert"
on public.audit_logs
for insert
to authenticated
with check (public.has_role(array['pharmacist', 'verifier', 'admin']));

-- No update/delete policies for audit logs

-- =========================================================
-- Seed categories
-- =========================================================
insert into public.drug_categories (name, slug, description)
values
  ('Analgesik', 'analgesik', 'Obat untuk meredakan nyeri'),
  ('Antibiotik', 'antibiotik', 'Obat untuk menangani infeksi bakteri'),
  ('Antipiretik', 'antipiretik', 'Obat untuk menurunkan demam'),
  ('Antihistamin', 'antihistamin', 'Obat untuk reaksi alergi'),
  ('Gastrointestinal', 'gastrointestinal', 'Obat untuk keluhan saluran cerna')
on conflict (slug) do nothing;