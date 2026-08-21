alter table public.commerce_orders
  drop constraint if exists commerce_orders_order_kind_check;

alter table public.commerce_orders
  add constraint commerce_orders_order_kind_check
  check (order_kind = any (array['hat'::text, 'patch'::text, 'crate'::text, 'bundle'::text]));

alter table public.commerce_fulfillment_items
  drop constraint if exists commerce_fulfillment_items_item_kind_check;

alter table public.commerce_fulfillment_items
  add constraint commerce_fulfillment_items_item_kind_check
  check (item_kind = any (array['hat'::text, 'patch'::text, 'crate'::text]));

create table if not exists public.coffee_affiliate_commissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.commerce_orders(id) on delete cascade,
  affiliate_id uuid not null references public.coffee_affiliates(id),
  affiliate_code text not null,
  commission_base_amount integer not null check (commission_base_amount >= 0),
  commission_bps integer not null check (commission_bps between 0 and 10000),
  commission_amount integer not null check (commission_amount >= 0),
  currency text not null default 'usd',
  status text not null default 'pending_fulfillment'
    check (status = any (array['pending_fulfillment'::text, 'approved'::text, 'paid'::text, 'voided'::text])),
  evidence jsonb not null default '{}'::jsonb,
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.coffee_affiliate_commissions is
  'Private Coffee & A Joint commission ledger. Webhooks create pending records; humans approve payouts after fulfillment and refund review.';

alter table public.coffee_affiliate_commissions enable row level security;
revoke all on table public.coffee_affiliate_commissions from anon, authenticated;

create index if not exists coffee_affiliate_commissions_affiliate_status_idx
  on public.coffee_affiliate_commissions (affiliate_id, status, created_at desc);
