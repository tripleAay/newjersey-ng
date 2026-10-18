begin;
create table public.newsletter_subscribers (
 id uuid primary key default gen_random_uuid(),
 email text not null unique check (email=lower(trim(email)) and length(email) between 3 and 254),
 status text not null default 'pending' check(status in ('pending','suppressed')),
 source text not null default 'website-newsletter',
 consent_version text not null default 'newsletter-v1',
 consent_text text not null default 'I’d like NewJersey.ng email updates. I can unsubscribe from future emails.',
 consented_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 suppressed_by uuid references public.admin_users(id)
);
create table public.newsletter_rate_limits (
 rate_key text primary key,
 attempts integer not null default 0,
 expires_at timestamptz not null
);
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_rate_limits enable row level security;
revoke all on public.newsletter_subscribers,public.newsletter_rate_limits from public,anon,authenticated;
grant all on public.newsletter_subscribers,public.newsletter_rate_limits to service_role;
create index newsletter_created_idx on public.newsletter_subscribers(created_at desc,id desc);
create or replace function public.request_newsletter_subscription(p_email text,p_rate_key text)
returns void language plpgsql set search_path='' as $$
declare v_attempts integer;
begin
 if p_email is null or p_email <> lower(trim(p_email)) or length(p_email)>254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'invalid_email'; end if;
 if p_rate_key is null or p_rate_key !~ '^[0-9a-f]{64}$' then raise exception 'invalid_bucket';end if;
 delete from public.newsletter_rate_limits where expires_at<now();
 insert into public.newsletter_rate_limits(rate_key,attempts,expires_at) values(p_rate_key,1,now()+interval '1 day')
 on conflict(rate_key) do update set attempts=public.newsletter_rate_limits.attempts+1
 returning attempts into v_attempts;
 if v_attempts>10 then raise exception 'newsletter_rate_limit';end if;
 -- Never disclose existing addresses or reactivate an opt-out through a public form.
 insert into public.newsletter_subscribers(email) values(p_email) on conflict(email) do nothing;
end;$$;
revoke all on function public.request_newsletter_subscription(text,text) from public,anon,authenticated;
grant execute on function public.request_newsletter_subscription(text,text) to service_role;
commit;
