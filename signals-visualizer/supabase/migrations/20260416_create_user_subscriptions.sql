create table if not exists public.user_subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  provider text not null default 'razorpay',
  plan_tier text not null default 'free',
  status text not null default 'inactive',
  provider_subscription_id text,
  provider_customer_id text,
  checkout_link_id text,
  last_manage_url text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_subscriptions_status_idx on public.user_subscriptions (status);

alter table public.user_subscriptions enable row level security;

drop policy if exists "Users can view their own subscription" on public.user_subscriptions;
create policy "Users can view their own subscription"
on public.user_subscriptions
for select
using (auth.uid() = user_id);

drop policy if exists "Service role can manage subscriptions" on public.user_subscriptions;
create policy "Service role can manage subscriptions"
on public.user_subscriptions
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create or replace function public.set_updated_at_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists user_subscriptions_set_updated_at on public.user_subscriptions;
create trigger user_subscriptions_set_updated_at
before update on public.user_subscriptions
for each row
execute function public.set_updated_at_timestamp();
