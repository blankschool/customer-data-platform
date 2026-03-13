create extension if not exists citext;
create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'access_profile_name') then
    create type public.access_profile_name as enum ('Admin', 'Editor', 'Viewer');
  end if;

  if not exists (select 1 from pg_type where typname = 'contact_source') then
    create type public.contact_source as enum ('vendas', 'email', 'whatsapp');
  end if;

  if not exists (select 1 from pg_type where typname = 'contact_status') then
    create type public.contact_status as enum ('ativo', 'inativo', 'pendente');
  end if;

  if not exists (select 1 from pg_type where typname = 'contact_import_status') then
    create type public.contact_import_status as enum ('ativo', 'orphaned');
  end if;

  if not exists (select 1 from pg_type where typname = 'import_job_status') then
    create type public.import_job_status as enum ('processando', 'ativa', 'revertida', 'erro');
  end if;

  if not exists (select 1 from pg_type where typname = 'inconsistency_type') then
    create type public.inconsistency_type as enum ('Duplicata', 'Tag ausente', 'Inadimplente', 'Órfão');
  end if;

  if not exists (select 1 from pg_type where typname = 'member_status') then
    create type public.member_status as enum ('ativo', 'inativo');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  avatar_fallback text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.access_profiles (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name public.access_profile_name not null,
  description text not null,
  is_system boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, name)
);

create table if not exists public.access_profile_permissions (
  id uuid primary key default gen_random_uuid(),
  access_profile_id uuid not null references public.access_profiles (id) on delete cascade,
  category text not null,
  action_name text not null,
  allowed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (access_profile_id, category, action_name)
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  access_profile_id uuid not null references public.access_profiles (id) on delete restrict,
  status public.member_status not null default 'ativo',
  last_access_at timestamptz,
  invited_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (workspace_id, user_id)
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  description text not null default '',
  color text not null default '',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, name)
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  avatar_url text,
  avatar_fallback text,
  name text not null,
  email citext not null,
  phone text not null,
  canonical_source public.contact_source not null,
  status public.contact_status not null default 'ativo',
  import_status public.contact_import_status not null default 'ativo',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, email)
);

create table if not exists public.contact_tags (
  contact_id uuid not null references public.contacts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  assigned_by uuid references auth.users (id) on delete set null,
  assigned_at timestamptz not null default timezone('utc', now()),
  primary key (contact_id, tag_id)
);

create table if not exists public.imports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  file_name text not null,
  file_size bigint not null check (file_size >= 0),
  source public.contact_source not null,
  imported_at timestamptz not null default timezone('utc', now()),
  status public.import_job_status not null default 'processando',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.import_contacts (
  import_id uuid not null references public.imports (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  source public.contact_source not null,
  added_at timestamptz not null default timezone('utc', now()),
  is_primary boolean not null default false,
  primary key (import_id, contact_id)
);

create table if not exists public.inconsistency_cases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  type public.inconsistency_type not null,
  primary_source public.contact_source not null,
  source_list public.contact_source[] not null default '{}'::public.contact_source[],
  occurrences integer not null default 1 check (occurrences > 0),
  first_purchase_label text,
  current_tags_snapshot text[] not null default '{}'::text[],
  suggested_tags_snapshot text[] not null default '{}'::text[],
  conflict_label text,
  resolved boolean not null default false,
  resolved_with public.contact_source,
  resolved_at timestamptz,
  resolved_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint inconsistency_resolution_consistency check (
    (resolved = false and resolved_with is null and resolved_at is null)
    or
    (resolved = true and resolved_with is not null)
  )
);

create table if not exists public.inconsistency_conflict_entries (
  id uuid primary key default gen_random_uuid(),
  inconsistency_id uuid not null references public.inconsistency_cases (id) on delete cascade,
  source public.contact_source not null,
  value text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (inconsistency_id, source)
);

create index if not exists access_profile_permissions_profile_idx
  on public.access_profile_permissions (access_profile_id);

create index if not exists workspace_members_user_idx
  on public.workspace_members (user_id);

create index if not exists workspace_members_profile_idx
  on public.workspace_members (access_profile_id);

create index if not exists contacts_workspace_status_idx
  on public.contacts (workspace_id, status);

create index if not exists contacts_workspace_source_idx
  on public.contacts (workspace_id, canonical_source);

create index if not exists contact_tags_tag_idx
  on public.contact_tags (tag_id);

create index if not exists imports_workspace_source_idx
  on public.imports (workspace_id, source, imported_at desc);

create index if not exists import_contacts_contact_idx
  on public.import_contacts (contact_id);

create index if not exists inconsistency_cases_workspace_type_idx
  on public.inconsistency_cases (workspace_id, type, resolved);

create index if not exists inconsistency_cases_contact_idx
  on public.inconsistency_cases (contact_id);

create index if not exists inconsistency_conflict_entries_case_idx
  on public.inconsistency_conflict_entries (inconsistency_id);

drop trigger if exists workspaces_set_updated_at on public.workspaces;
create trigger workspaces_set_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists access_profiles_set_updated_at on public.access_profiles;
create trigger access_profiles_set_updated_at
before update on public.access_profiles
for each row execute function public.set_updated_at();

drop trigger if exists workspace_members_set_updated_at on public.workspace_members;
create trigger workspace_members_set_updated_at
before update on public.workspace_members
for each row execute function public.set_updated_at();

drop trigger if exists tags_set_updated_at on public.tags;
create trigger tags_set_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

drop trigger if exists inconsistency_cases_set_updated_at on public.inconsistency_cases;
create trigger inconsistency_cases_set_updated_at
before update on public.inconsistency_cases
for each row execute function public.set_updated_at();

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
      and wm.status = 'ativo'
  );
$$;

create or replace function public.has_workspace_permission(
  target_workspace_id uuid,
  target_category text,
  target_action text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    join public.access_profile_permissions app
      on app.access_profile_id = wm.access_profile_id
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
      and wm.status = 'ativo'
      and app.category = target_category
      and app.action_name = target_action
      and app.allowed = true
  );
$$;

create or replace function public.seed_access_profiles(target_workspace_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_profile_id uuid;
  editor_profile_id uuid;
  viewer_profile_id uuid;
begin
  insert into public.access_profiles (workspace_id, name, description)
  values
    (target_workspace_id, 'Admin', 'Acesso total à plataforma, incluindo gestão de usuários e configurações.'),
    (target_workspace_id, 'Editor', 'Pode editar contatos, resolver conflitos e exportar dados.'),
    (target_workspace_id, 'Viewer', 'Acesso somente leitura. Pode visualizar dados e exportar relatórios.')
  on conflict (workspace_id, name) do update
    set description = excluded.description;

  select id into admin_profile_id
  from public.access_profiles
  where workspace_id = target_workspace_id
    and name = 'Admin';

  select id into editor_profile_id
  from public.access_profiles
  where workspace_id = target_workspace_id
    and name = 'Editor';

  select id into viewer_profile_id
  from public.access_profiles
  where workspace_id = target_workspace_id
    and name = 'Viewer';

  insert into public.access_profile_permissions (access_profile_id, category, action_name, allowed)
  values
    (admin_profile_id, 'Bases', 'Upload de bases', true),
    (admin_profile_id, 'Bases', 'Excluir bases', true),
    (admin_profile_id, 'Inconsistências', 'Visualizar', true),
    (admin_profile_id, 'Inconsistências', 'Resolver conflitos', true),
    (admin_profile_id, 'Inconsistências', 'Marcar órfão', true),
    (admin_profile_id, 'Contatos', 'Visualizar', true),
    (admin_profile_id, 'Contatos', 'Editar', true),
    (admin_profile_id, 'Contatos', 'Excluir', true),
    (admin_profile_id, 'Tags', 'Criar', true),
    (admin_profile_id, 'Tags', 'Editar', true),
    (admin_profile_id, 'Tags', 'Excluir', true),
    (admin_profile_id, 'Exportação', 'Exportar CSV', true),
    (admin_profile_id, 'Exportação', 'Exportar Excel', true),
    (admin_profile_id, 'Time', 'Convidar usuários', true),
    (admin_profile_id, 'Time', 'Alterar perfis', true),
    (admin_profile_id, 'Time', 'Remover usuários', true),
    (editor_profile_id, 'Bases', 'Upload de bases', true),
    (editor_profile_id, 'Bases', 'Excluir bases', false),
    (editor_profile_id, 'Inconsistências', 'Visualizar', true),
    (editor_profile_id, 'Inconsistências', 'Resolver conflitos', true),
    (editor_profile_id, 'Inconsistências', 'Marcar órfão', true),
    (editor_profile_id, 'Contatos', 'Visualizar', true),
    (editor_profile_id, 'Contatos', 'Editar', true),
    (editor_profile_id, 'Contatos', 'Excluir', false),
    (editor_profile_id, 'Tags', 'Criar', true),
    (editor_profile_id, 'Tags', 'Editar', true),
    (editor_profile_id, 'Tags', 'Excluir', false),
    (editor_profile_id, 'Exportação', 'Exportar CSV', true),
    (editor_profile_id, 'Exportação', 'Exportar Excel', true),
    (editor_profile_id, 'Time', 'Convidar usuários', false),
    (editor_profile_id, 'Time', 'Alterar perfis', false),
    (editor_profile_id, 'Time', 'Remover usuários', false),
    (viewer_profile_id, 'Bases', 'Upload de bases', false),
    (viewer_profile_id, 'Bases', 'Excluir bases', false),
    (viewer_profile_id, 'Inconsistências', 'Visualizar', true),
    (viewer_profile_id, 'Inconsistências', 'Resolver conflitos', false),
    (viewer_profile_id, 'Inconsistências', 'Marcar órfão', false),
    (viewer_profile_id, 'Contatos', 'Visualizar', true),
    (viewer_profile_id, 'Contatos', 'Editar', false),
    (viewer_profile_id, 'Contatos', 'Excluir', false),
    (viewer_profile_id, 'Tags', 'Criar', false),
    (viewer_profile_id, 'Tags', 'Editar', false),
    (viewer_profile_id, 'Tags', 'Excluir', false),
    (viewer_profile_id, 'Exportação', 'Exportar CSV', true),
    (viewer_profile_id, 'Exportação', 'Exportar Excel', false),
    (viewer_profile_id, 'Time', 'Convidar usuários', false),
    (viewer_profile_id, 'Time', 'Alterar perfis', false),
    (viewer_profile_id, 'Time', 'Remover usuários', false)
  on conflict (access_profile_id, category, action_name) do update
    set allowed = excluded.allowed;
end;
$$;

create or replace function public.handle_workspace_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_profile_id uuid;
begin
  perform public.seed_access_profiles(new.id);

  if new.created_by is not null then
    select id into admin_profile_id
    from public.access_profiles
    where workspace_id = new.id
      and name = 'Admin';

    insert into public.workspace_members (
      workspace_id,
      user_id,
      access_profile_id,
      status
    )
    values (new.id, new.created_by, admin_profile_id, 'ativo')
    on conflict (workspace_id, user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists workspaces_after_insert on public.workspaces;
create trigger workspaces_after_insert
after insert on public.workspaces
for each row execute function public.handle_workspace_created();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, avatar_fallback)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url',
    upper(left(coalesce(new.raw_user_meta_data ->> 'full_name', new.email, '?'), 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user_profile();

create or replace function public.refresh_contact_import_statuses()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.contacts c
  set import_status = case
    when not exists (
      select 1
      from public.import_contacts ic
      join public.imports i on i.id = ic.import_id
      where ic.contact_id = c.id
        and i.status <> 'revertida'
    ) then 'orphaned'::public.contact_import_status
    else 'ativo'::public.contact_import_status
  end,
  updated_at = timezone('utc', now())
  where c.id in (
    select ic.contact_id
    from public.import_contacts ic
    where ic.import_id = new.id
  );

  return new;
end;
$$;

drop trigger if exists imports_refresh_contact_status on public.imports;
create trigger imports_refresh_contact_status
after update of status on public.imports
for each row
when (old.status is distinct from new.status)
execute function public.refresh_contact_import_statuses();

create or replace function public.create_workspace_with_defaults(
  p_name text,
  p_slug text
)
returns public.workspaces
language plpgsql
security definer
set search_path = public
as $$
declare
  created_workspace public.workspaces;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.workspaces (name, slug, created_by)
  values (p_name, p_slug, auth.uid())
  returning * into created_workspace;

  return created_workspace;
end;
$$;

create or replace function public.revert_import(p_import_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_workspace_id uuid;
begin
  select workspace_id into target_workspace_id
  from public.imports
  where id = p_import_id;

  if target_workspace_id is null then
    raise exception 'Import not found';
  end if;

  if not public.has_workspace_permission(target_workspace_id, 'Bases', 'Excluir bases') then
    raise exception 'Permission denied';
  end if;

  update public.imports
  set status = 'revertida'
  where id = p_import_id;
end;
$$;

create or replace function public.resolve_inconsistency_case(
  p_case_id uuid,
  p_choice public.contact_source
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_workspace_id uuid;
begin
  select workspace_id into target_workspace_id
  from public.inconsistency_cases
  where id = p_case_id;

  if target_workspace_id is null then
    raise exception 'Inconsistency case not found';
  end if;

  if not public.has_workspace_permission(target_workspace_id, 'Inconsistências', 'Resolver conflitos') then
    raise exception 'Permission denied';
  end if;

  update public.inconsistency_cases
  set
    resolved = true,
    resolved_with = p_choice,
    resolved_at = timezone('utc', now()),
    resolved_by = auth.uid()
  where id = p_case_id;
end;
$$;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.workspaces to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.access_profiles to authenticated;
grant select, insert, update, delete on public.access_profile_permissions to authenticated;
grant select, insert, update, delete on public.workspace_members to authenticated;
grant select, insert, update, delete on public.tags to authenticated;
grant select, insert, update, delete on public.contacts to authenticated;
grant select, insert, update, delete on public.contact_tags to authenticated;
grant select, insert, update, delete on public.imports to authenticated;
grant select, insert, update, delete on public.import_contacts to authenticated;
grant select, insert, update, delete on public.inconsistency_cases to authenticated;
grant select, insert, update, delete on public.inconsistency_conflict_entries to authenticated;
grant execute on function public.create_workspace_with_defaults(text, text) to authenticated;
grant execute on function public.revert_import(uuid) to authenticated;
grant execute on function public.resolve_inconsistency_case(uuid, public.contact_source) to authenticated;

alter table public.workspaces enable row level security;
alter table public.profiles enable row level security;
alter table public.access_profiles enable row level security;
alter table public.access_profile_permissions enable row level security;
alter table public.workspace_members enable row level security;
alter table public.tags enable row level security;
alter table public.contacts enable row level security;
alter table public.contact_tags enable row level security;
alter table public.imports enable row level security;
alter table public.import_contacts enable row level security;
alter table public.inconsistency_cases enable row level security;
alter table public.inconsistency_conflict_entries enable row level security;

drop policy if exists workspaces_select on public.workspaces;
create policy workspaces_select
on public.workspaces
for select
using (public.is_workspace_member(id));

drop policy if exists workspaces_update on public.workspaces;
create policy workspaces_update
on public.workspaces
for update
using (public.has_workspace_permission(id, 'Time', 'Alterar perfis'))
with check (public.has_workspace_permission(id, 'Time', 'Alterar perfis'));

drop policy if exists profiles_select on public.profiles;
create policy profiles_select
on public.profiles
for select
using (
  id = auth.uid()
  or exists (
    select 1
    from public.workspace_members viewer
    join public.workspace_members teammate
      on teammate.workspace_id = viewer.workspace_id
    where viewer.user_id = auth.uid()
      and viewer.status = 'ativo'
      and teammate.user_id = profiles.id
  )
);

drop policy if exists profiles_update on public.profiles;
create policy profiles_update
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists access_profiles_select on public.access_profiles;
create policy access_profiles_select
on public.access_profiles
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists access_profiles_modify on public.access_profiles;
create policy access_profiles_modify
on public.access_profiles
for all
using (public.has_workspace_permission(workspace_id, 'Time', 'Alterar perfis'))
with check (public.has_workspace_permission(workspace_id, 'Time', 'Alterar perfis'));

drop policy if exists access_profile_permissions_select on public.access_profile_permissions;
create policy access_profile_permissions_select
on public.access_profile_permissions
for select
using (
  exists (
    select 1
    from public.access_profiles ap
    where ap.id = access_profile_permissions.access_profile_id
      and public.is_workspace_member(ap.workspace_id)
  )
);

drop policy if exists access_profile_permissions_modify on public.access_profile_permissions;
create policy access_profile_permissions_modify
on public.access_profile_permissions
for all
using (
  exists (
    select 1
    from public.access_profiles ap
    where ap.id = access_profile_permissions.access_profile_id
      and public.has_workspace_permission(ap.workspace_id, 'Time', 'Alterar perfis')
  )
)
with check (
  exists (
    select 1
    from public.access_profiles ap
    where ap.id = access_profile_permissions.access_profile_id
      and public.has_workspace_permission(ap.workspace_id, 'Time', 'Alterar perfis')
  )
);

drop policy if exists workspace_members_select on public.workspace_members;
create policy workspace_members_select
on public.workspace_members
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists workspace_members_modify on public.workspace_members;
create policy workspace_members_modify
on public.workspace_members
for all
using (public.has_workspace_permission(workspace_id, 'Time', 'Alterar perfis'))
with check (public.has_workspace_permission(workspace_id, 'Time', 'Alterar perfis'));

drop policy if exists tags_select on public.tags;
create policy tags_select
on public.tags
for select
using (public.has_workspace_permission(workspace_id, 'Tags', 'Criar') or public.is_workspace_member(workspace_id));

drop policy if exists tags_insert on public.tags;
create policy tags_insert
on public.tags
for insert
with check (public.has_workspace_permission(workspace_id, 'Tags', 'Criar'));

drop policy if exists tags_update on public.tags;
create policy tags_update
on public.tags
for update
using (public.has_workspace_permission(workspace_id, 'Tags', 'Editar'))
with check (public.has_workspace_permission(workspace_id, 'Tags', 'Editar'));

drop policy if exists tags_delete on public.tags;
create policy tags_delete
on public.tags
for delete
using (public.has_workspace_permission(workspace_id, 'Tags', 'Excluir'));

drop policy if exists contacts_select on public.contacts;
create policy contacts_select
on public.contacts
for select
using (public.has_workspace_permission(workspace_id, 'Contatos', 'Visualizar'));

drop policy if exists contacts_insert on public.contacts;
create policy contacts_insert
on public.contacts
for insert
with check (public.has_workspace_permission(workspace_id, 'Contatos', 'Editar'));

drop policy if exists contacts_update on public.contacts;
create policy contacts_update
on public.contacts
for update
using (public.has_workspace_permission(workspace_id, 'Contatos', 'Editar'))
with check (public.has_workspace_permission(workspace_id, 'Contatos', 'Editar'));

drop policy if exists contacts_delete on public.contacts;
create policy contacts_delete
on public.contacts
for delete
using (public.has_workspace_permission(workspace_id, 'Contatos', 'Excluir'));

drop policy if exists contact_tags_select on public.contact_tags;
create policy contact_tags_select
on public.contact_tags
for select
using (
  exists (
    select 1
    from public.contacts c
    where c.id = contact_tags.contact_id
      and public.has_workspace_permission(c.workspace_id, 'Contatos', 'Visualizar')
  )
);

drop policy if exists contact_tags_modify on public.contact_tags;
create policy contact_tags_modify
on public.contact_tags
for all
using (
  exists (
    select 1
    from public.contacts c
    where c.id = contact_tags.contact_id
      and public.has_workspace_permission(c.workspace_id, 'Contatos', 'Editar')
  )
)
with check (
  exists (
    select 1
    from public.contacts c
    where c.id = contact_tags.contact_id
      and public.has_workspace_permission(c.workspace_id, 'Contatos', 'Editar')
  )
);

drop policy if exists imports_select on public.imports;
create policy imports_select
on public.imports
for select
using (public.is_workspace_member(workspace_id));

drop policy if exists imports_insert on public.imports;
create policy imports_insert
on public.imports
for insert
with check (public.has_workspace_permission(workspace_id, 'Bases', 'Upload de bases'));

drop policy if exists imports_update on public.imports;
create policy imports_update
on public.imports
for update
using (public.has_workspace_permission(workspace_id, 'Bases', 'Excluir bases'))
with check (public.has_workspace_permission(workspace_id, 'Bases', 'Excluir bases'));

drop policy if exists imports_delete on public.imports;
create policy imports_delete
on public.imports
for delete
using (public.has_workspace_permission(workspace_id, 'Bases', 'Excluir bases'));

drop policy if exists import_contacts_select on public.import_contacts;
create policy import_contacts_select
on public.import_contacts
for select
using (
  exists (
    select 1
    from public.imports i
    where i.id = import_contacts.import_id
      and public.is_workspace_member(i.workspace_id)
  )
);

drop policy if exists import_contacts_modify on public.import_contacts;
create policy import_contacts_modify
on public.import_contacts
for all
using (
  exists (
    select 1
    from public.imports i
    where i.id = import_contacts.import_id
      and public.has_workspace_permission(i.workspace_id, 'Bases', 'Upload de bases')
  )
)
with check (
  exists (
    select 1
    from public.imports i
    where i.id = import_contacts.import_id
      and public.has_workspace_permission(i.workspace_id, 'Bases', 'Upload de bases')
  )
);

drop policy if exists inconsistency_cases_select on public.inconsistency_cases;
create policy inconsistency_cases_select
on public.inconsistency_cases
for select
using (public.has_workspace_permission(workspace_id, 'Inconsistências', 'Visualizar'));

drop policy if exists inconsistency_cases_insert on public.inconsistency_cases;
create policy inconsistency_cases_insert
on public.inconsistency_cases
for insert
with check (public.has_workspace_permission(workspace_id, 'Inconsistências', 'Resolver conflitos'));

drop policy if exists inconsistency_cases_update on public.inconsistency_cases;
create policy inconsistency_cases_update
on public.inconsistency_cases
for update
using (public.has_workspace_permission(workspace_id, 'Inconsistências', 'Resolver conflitos'))
with check (public.has_workspace_permission(workspace_id, 'Inconsistências', 'Resolver conflitos'));

drop policy if exists inconsistency_cases_delete on public.inconsistency_cases;
create policy inconsistency_cases_delete
on public.inconsistency_cases
for delete
using (public.has_workspace_permission(workspace_id, 'Inconsistências', 'Marcar órfão'));

drop policy if exists inconsistency_conflict_entries_select on public.inconsistency_conflict_entries;
create policy inconsistency_conflict_entries_select
on public.inconsistency_conflict_entries
for select
using (
  exists (
    select 1
    from public.inconsistency_cases ic
    where ic.id = inconsistency_conflict_entries.inconsistency_id
      and public.has_workspace_permission(ic.workspace_id, 'Inconsistências', 'Visualizar')
  )
);

drop policy if exists inconsistency_conflict_entries_modify on public.inconsistency_conflict_entries;
create policy inconsistency_conflict_entries_modify
on public.inconsistency_conflict_entries
for all
using (
  exists (
    select 1
    from public.inconsistency_cases ic
    where ic.id = inconsistency_conflict_entries.inconsistency_id
      and public.has_workspace_permission(ic.workspace_id, 'Inconsistências', 'Resolver conflitos')
  )
)
with check (
  exists (
    select 1
    from public.inconsistency_cases ic
    where ic.id = inconsistency_conflict_entries.inconsistency_id
      and public.has_workspace_permission(ic.workspace_id, 'Inconsistências', 'Resolver conflitos')
  )
);
