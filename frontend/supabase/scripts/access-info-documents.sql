create table if not exists info_access_documents (
  id uuid primary key default gen_random_uuid(),
  title_fr text not null,
  title_en text not null,
  title_ar text not null,
  category text not null,
  file_path text not null,
  file_size_bytes bigint,
  mime_type text default 'application/pdf',
  is_published boolean not null default true,
  display_order int default 0,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table info_access_documents enable row level security;

create policy "public read published docs"
  on info_access_documents for select
  using (is_published = true);

create policy "service role manage docs"
  on info_access_documents for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
