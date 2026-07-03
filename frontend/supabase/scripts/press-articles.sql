create table if not exists press_articles (
  id uuid primary key default gen_random_uuid(),
  title_fr text not null,
  title_en text not null,
  title_ar text not null,
  excerpt_fr text not null,
  excerpt_en text not null,
  excerpt_ar text not null,
  body_fr text not null,
  body_en text not null,
  body_ar text not null,
  category text not null,
  icon text not null default 'governance',
  is_published boolean not null default false,
  display_order int default 0,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table press_articles enable row level security;

create policy "public read published press"
  on press_articles for select
  using (is_published = true);

create policy "service role manage press"
  on press_articles for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
