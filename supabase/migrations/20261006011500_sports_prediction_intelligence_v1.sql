-- Misfit Sports Prediction Intelligence V1
-- Read-only public market research from Polymarket + Kalshi.
-- No wager execution, deposits, account actions, or money movement.

create schema if not exists sports_private;
revoke all on schema sports_private from public, anon, authenticated;

create table if not exists sports_private.provider_runs_v1 (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('polymarket','kalshi')),
  mode text not null check (mode in ('scan','refresh')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'running' check (status in ('running','complete','error')),
  markets_seen integer not null default 0,
  sports_markets_seen integer not null default 0,
  error text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists sports_private.market_latest_v1 (
  provider text not null check (provider in ('polymarket','kalshi')),
  market_id text not null,
  event_id text,
  league text,
  market_type text,
  title text not null,
  subtitle text,
  status text,
  close_time timestamptz,
  yes_bid numeric,
  yes_ask numeric,
  yes_price numeric,
  no_bid numeric,
  no_ask numeric,
  no_price numeric,
  spread numeric,
  volume numeric,
  volume_24h numeric,
  open_interest numeric,
  liquidity numeric,
  result_yes boolean,
  last_provider_update timestamptz,
  observed_at timestamptz not null,
  raw jsonb not null,
  primary key(provider,market_id)
);

create table if not exists sports_private.market_snapshots_v1 (
  id bigserial primary key,
  provider text not null,
  market_id text not null,
  event_id text,
  league text,
  market_type text,
  title text not null,
  status text,
  close_time timestamptz,
  yes_price numeric,
  spread numeric,
  volume numeric,
  open_interest numeric,
  liquidity numeric,
  result_yes boolean,
  observed_at timestamptz not null,
  raw jsonb not null
);

create index if not exists sports_market_snapshots_lookup_v1
on sports_private.market_snapshots_v1(provider,market_id,observed_at desc);

create table if not exists sports_private.calibration_observations_v1 (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  market_id text not null,
  event_id text,
  league text,
  market_type text,
  title text not null,
  opened_observation_at timestamptz not null,
  initial_yes_probability numeric check (initial_yes_probability between 0 and 1),
  initial_spread numeric,
  initial_volume numeric,
  initial_open_interest numeric,
  close_time timestamptz,
  settlement_status text not null default 'pending' check (settlement_status in ('pending','settled','unavailable')),
  settled_yes boolean,
  brier_score numeric,
  scored_at timestamptz,
  research_only boolean not null default true check (research_only=true),
  wager_execution_allowed boolean not null default false check (wager_execution_allowed=false),
  money_moved boolean not null default false check (money_moved=false),
  unique(provider,market_id)
);

create table if not exists sports_private.provider_health_v1 (
  provider text primary key check (provider in ('polymarket','kalshi')),
  last_success_at timestamptz,
  last_error_at timestamptz,
  last_error text,
  latest_market_count integer not null default 0,
  latest_sports_market_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists sports_private.http_requests_v1 (
  request_id bigint primary key,
  provider text not null check (provider in ('polymarket','kalshi')),
  request_kind text not null check (request_kind in ('scan_moneyline','scan_spreads','scan_totals','scan_open','refresh_market')),
  market_id text,
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  status text not null default 'queued' check (status in ('queued','complete','error')),
  response_status integer,
  error text
);

alter table sports_private.provider_runs_v1 enable row level security;
alter table sports_private.market_latest_v1 enable row level security;
alter table sports_private.market_snapshots_v1 enable row level security;
alter table sports_private.calibration_observations_v1 enable row level security;
alter table sports_private.provider_health_v1 enable row level security;
alter table sports_private.http_requests_v1 enable row level security;

revoke all on sports_private.provider_runs_v1 from public,anon,authenticated;
revoke all on sports_private.market_latest_v1 from public,anon,authenticated;
revoke all on sports_private.market_snapshots_v1 from public,anon,authenticated;
revoke all on sports_private.calibration_observations_v1 from public,anon,authenticated;
revoke all on sports_private.provider_health_v1 from public,anon,authenticated;
revoke all on sports_private.http_requests_v1 from public,anon,authenticated;


CREATE OR REPLACE FUNCTION public.misfit_sports_ingest_v1(p_provider text, p_mode text, p_markets jsonb, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_run uuid;
  v_now timestamptz:=now();
  v_count integer:=0;
  m jsonb;
  v_yes numeric;
begin
  if p_provider not in ('polymarket','kalshi') then raise exception 'invalid_provider'; end if;
  if p_mode not in ('scan','refresh') then raise exception 'invalid_mode'; end if;
  if p_markets is null or jsonb_typeof(p_markets)<>'array' then raise exception 'markets_must_be_array'; end if;

  insert into sports_private.provider_runs_v1(provider,mode,metadata)
  values(p_provider,p_mode,coalesce(p_metadata,'{}'::jsonb))
  returning id into v_run;

  for m in select value from jsonb_array_elements(p_markets)
  loop
    if nullif(m->>'market_id','') is null or nullif(m->>'title','') is null then continue; end if;
    v_yes:=nullif(m->>'yes_price','')::numeric;

    insert into sports_private.market_snapshots_v1(
      provider,market_id,event_id,league,market_type,title,status,close_time,
      yes_price,spread,volume,open_interest,liquidity,result_yes,observed_at,raw
    ) values (
      p_provider,m->>'market_id',nullif(m->>'event_id',''),nullif(m->>'league',''),
      nullif(m->>'market_type',''),m->>'title',nullif(m->>'status',''),
      nullif(m->>'close_time','')::timestamptz,
      v_yes,nullif(m->>'spread','')::numeric,nullif(m->>'volume','')::numeric,
      nullif(m->>'open_interest','')::numeric,nullif(m->>'liquidity','')::numeric,
      case when m ? 'result_yes' and m->>'result_yes'<>'' then (m->>'result_yes')::boolean else null end,
      v_now,m
    );

    insert into sports_private.market_latest_v1(
      provider,market_id,event_id,league,market_type,title,subtitle,status,close_time,
      yes_bid,yes_ask,yes_price,no_bid,no_ask,no_price,spread,volume,volume_24h,
      open_interest,liquidity,result_yes,last_provider_update,observed_at,raw
    ) values (
      p_provider,m->>'market_id',nullif(m->>'event_id',''),nullif(m->>'league',''),
      nullif(m->>'market_type',''),m->>'title',nullif(m->>'subtitle',''),
      nullif(m->>'status',''),nullif(m->>'close_time','')::timestamptz,
      nullif(m->>'yes_bid','')::numeric,nullif(m->>'yes_ask','')::numeric,v_yes,
      nullif(m->>'no_bid','')::numeric,nullif(m->>'no_ask','')::numeric,nullif(m->>'no_price','')::numeric,
      nullif(m->>'spread','')::numeric,nullif(m->>'volume','')::numeric,nullif(m->>'volume_24h','')::numeric,
      nullif(m->>'open_interest','')::numeric,nullif(m->>'liquidity','')::numeric,
      case when m ? 'result_yes' and m->>'result_yes'<>'' then (m->>'result_yes')::boolean else null end,
      nullif(m->>'provider_updated_at','')::timestamptz,v_now,m
    )
    on conflict(provider,market_id) do update set
      event_id=excluded.event_id,league=excluded.league,market_type=excluded.market_type,
      title=excluded.title,subtitle=excluded.subtitle,status=excluded.status,close_time=excluded.close_time,
      yes_bid=excluded.yes_bid,yes_ask=excluded.yes_ask,yes_price=excluded.yes_price,
      no_bid=excluded.no_bid,no_ask=excluded.no_ask,no_price=excluded.no_price,
      spread=excluded.spread,volume=excluded.volume,volume_24h=excluded.volume_24h,
      open_interest=excluded.open_interest,liquidity=excluded.liquidity,
      result_yes=coalesce(excluded.result_yes,sports_private.market_latest_v1.result_yes),
      last_provider_update=excluded.last_provider_update,observed_at=excluded.observed_at,raw=excluded.raw;

    if v_yes is not null and v_yes between 0 and 1 then
      insert into sports_private.calibration_observations_v1(
        provider,market_id,event_id,league,market_type,title,opened_observation_at,
        initial_yes_probability,initial_spread,initial_volume,initial_open_interest,close_time
      ) values (
        p_provider,m->>'market_id',nullif(m->>'event_id',''),nullif(m->>'league',''),
        nullif(m->>'market_type',''),m->>'title',v_now,v_yes,
        nullif(m->>'spread','')::numeric,nullif(m->>'volume','')::numeric,
        nullif(m->>'open_interest','')::numeric,nullif(m->>'close_time','')::timestamptz
      )
      on conflict(provider,market_id) do nothing;
    end if;

    v_count:=v_count+1;
  end loop;

  update sports_private.provider_runs_v1
  set status='complete',completed_at=now(),markets_seen=v_count,sports_markets_seen=v_count
  where id=v_run;

  insert into sports_private.provider_health_v1(
    provider,last_success_at,latest_market_count,latest_sports_market_count,updated_at
  )
  values(
    p_provider,now(),
    case when p_mode='scan' then v_count else 0 end,
    case when p_mode='scan' then v_count else 0 end,
    now()
  )
  on conflict(provider) do update set
    last_success_at=excluded.last_success_at,
    last_error=null,
    latest_market_count=case when p_mode='scan' then excluded.latest_market_count else sports_private.provider_health_v1.latest_market_count end,
    latest_sports_market_count=case when p_mode='scan' then excluded.latest_sports_market_count else sports_private.provider_health_v1.latest_sports_market_count end,
    updated_at=excluded.updated_at;

  update sports_private.calibration_observations_v1 o
  set settlement_status='settled',
      settled_yes=l.result_yes,
      brier_score=power(o.initial_yes_probability-(case when l.result_yes then 1 else 0 end),2),
      scored_at=now()
  from sports_private.market_latest_v1 l
  where o.provider=l.provider and o.market_id=l.market_id
    and o.settlement_status='pending' and l.result_yes is not null;

  return jsonb_build_object('ok',true,'provider',p_provider,'mode',p_mode,'markets_ingested',v_count,'run_id',v_run);
end
$function$


CREATE OR REPLACE FUNCTION public.misfit_sports_tracked_markets_v1(p_limit integer DEFAULT 40)
 RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
select coalesce(jsonb_agg(jsonb_build_object(
  'provider',provider,'market_id',market_id,'status',status,'close_time',close_time
) order by observed_at asc),'[]'::jsonb)
from (
  select provider,market_id,status,close_time,observed_at
  from sports_private.market_latest_v1
  where result_yes is null
  order by observed_at asc
  limit greatest(1,least(coalesce(p_limit,40),100))
) x;
$function$


CREATE OR REPLACE FUNCTION sports_private.enqueue_prediction_market_refresh_v1(p_limit integer DEFAULT 24)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare t record; rid bigint; n integer:=0;
begin
  for t in
    select provider,market_id
    from sports_private.calibration_observations_v1
    where settlement_status='pending'
      and (close_time is null or close_time<now()+interval '12 hours')
    order by coalesce(close_time,opened_observation_at) asc
    limit greatest(1,least(coalesce(p_limit,24),40))
  loop
    if t.provider='polymarket' then
      select net.http_get(
        url:='https://gamma-api.polymarket.com/markets/'||t.market_id,
        timeout_milliseconds:=10000
      ) into rid;
    else
      select net.http_get(
        url:='https://external-api.kalshi.com/trade-api/v2/markets/'||t.market_id,
        timeout_milliseconds:=10000
      ) into rid;
    end if;
    insert into sports_private.http_requests_v1(request_id,provider,request_kind,market_id)
    values(rid,t.provider,'refresh_market',t.market_id);
    n:=n+1;
  end loop;
  return jsonb_build_object('ok',true,'requests_enqueued',n,'read_only',true,'wager_execution_allowed',false,'money_moved',false);
end
$function$


CREATE OR REPLACE FUNCTION sports_private.enqueue_prediction_market_scan_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare rid bigint; n integer:=0;
begin
  select net.http_get(
    url:='https://gamma-api.polymarket.com/markets/keyset?sports_market_types=moneyline&closed=false&limit=200',
    timeout_milliseconds:=10000
  ) into rid;
  insert into sports_private.http_requests_v1(request_id,provider,request_kind) values(rid,'polymarket','scan_moneyline');
  n:=n+1;

  select net.http_get(
    url:='https://gamma-api.polymarket.com/markets/keyset?sports_market_types=spreads&closed=false&limit=200',
    timeout_milliseconds:=10000
  ) into rid;
  insert into sports_private.http_requests_v1(request_id,provider,request_kind) values(rid,'polymarket','scan_spreads');
  n:=n+1;

  select net.http_get(
    url:='https://gamma-api.polymarket.com/markets/keyset?sports_market_types=totals&closed=false&limit=200',
    timeout_milliseconds:=10000
  ) into rid;
  insert into sports_private.http_requests_v1(request_id,provider,request_kind) values(rid,'polymarket','scan_totals');
  n:=n+1;

  select net.http_get(
    url:='https://external-api.kalshi.com/trade-api/v2/markets?status=open&limit=1000&mve_filter=exclude',
    timeout_milliseconds:=10000
  ) into rid;
  insert into sports_private.http_requests_v1(request_id,provider,request_kind) values(rid,'kalshi','scan_open');
  n:=n+1;

  return jsonb_build_object('ok',true,'requests_enqueued',n,'read_only',true,'wager_execution_allowed',false,'money_moved',false);
end
$function$


CREATE OR REPLACE FUNCTION sports_private.harvest_prediction_market_http_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  q record;
  r record;
  body jsonb;
  markets jsonb;
  normalized jsonb;
  m jsonb;
  mt text;
  seen integer;
  processed integer:=0;
  failed integer:=0;
begin
  for q in
    select *
    from sports_private.http_requests_v1
    where status='queued'
    order by requested_at asc
    limit 40
  loop
    select * into r
    from net._http_response
    where id=q.request_id
    order by created desc
    limit 1;

    if not found then continue; end if;

    if coalesce(r.status_code,0)<200 or coalesce(r.status_code,0)>=300 or r.error_msg is not null then
      update sports_private.http_requests_v1
      set status='error',processed_at=now(),response_status=r.status_code,
          error=coalesce(r.error_msg,'http_'||coalesce(r.status_code::text,'unknown'))
      where request_id=q.request_id;

      insert into sports_private.provider_health_v1(provider,last_error_at,last_error,updated_at)
      values(q.provider,now(),coalesce(r.error_msg,'http_'||coalesce(r.status_code::text,'unknown')),now())
      on conflict(provider) do update
      set last_error_at=excluded.last_error_at,last_error=excluded.last_error,updated_at=excluded.updated_at;

      failed:=failed+1;
      continue;
    end if;

    begin body:=r.content::jsonb;
    exception when others then
      update sports_private.http_requests_v1
      set status='error',processed_at=now(),response_status=r.status_code,error='invalid_json'
      where request_id=q.request_id;
      failed:=failed+1;
      continue;
    end;

    normalized:='[]'::jsonb;
    seen:=0;

    if q.provider='polymarket' then
      mt:=case q.request_kind when 'scan_moneyline' then 'moneyline' when 'scan_spreads' then 'spreads' when 'scan_totals' then 'totals' else null end;
      if q.request_kind='refresh_market' then
        markets:=jsonb_build_array(body);
      else
        markets:=coalesce(body->'markets','[]'::jsonb);
      end if;

      for m in select value from jsonb_array_elements(markets)
      loop
        normalized:=normalized||jsonb_build_array(sports_private.normalize_polymarket_v1(m,mt));
        seen:=seen+1;
      end loop;
    else
      if q.request_kind='refresh_market' then
        markets:=jsonb_build_array(coalesce(body->'market',body));
      else
        markets:=coalesce(body->'markets','[]'::jsonb);
      end if;

      for m in select value from jsonb_array_elements(markets)
      loop
        if q.request_kind='refresh_market'
           or concat_ws(' ',m->>'title',m->>'subtitle',m->>'yes_sub_title',m->>'no_sub_title',m->>'event_ticker',m->>'ticker')
              ~* '(NFL|NBA|MLB|NHL|NCAA|NCAAF|NCAAB|WNBA|MLS|SUPER BOWL|WORLD SERIES|STANLEY CUP|BASKETBALL|FOOTBALL|BASEBALL|HOCKEY|SOCCER|TENNIS|GOLF|UFC|MMA)'
        then
          normalized:=normalized||jsonb_build_array(sports_private.normalize_kalshi_v1(m));
          seen:=seen+1;
        end if;
      end loop;
    end if;

    perform public.misfit_sports_ingest_v1(
      q.provider,
      case when q.request_kind='refresh_market' then 'refresh' else 'scan' end,
      normalized,
      jsonb_build_object(
        'request_id',q.request_id,
        'request_kind',q.request_kind,
        'provider_http_status',r.status_code,
        'raw_items_seen',case when q.provider='polymarket' then jsonb_array_length(markets) else coalesce(jsonb_array_length(markets),0) end,
        'sports_items_ingested',seen,
        'read_only',true
      )
    );

    update sports_private.http_requests_v1
    set status='complete',processed_at=now(),response_status=r.status_code,error=null
    where request_id=q.request_id;

    processed:=processed+1;
  end loop;

  return jsonb_build_object(
    'ok',failed=0,'processed',processed,'failed',failed,
    'research_only',true,'wager_execution_allowed',false,'money_moved',false,'as_of',now()
  );
end
$function$


CREATE OR REPLACE FUNCTION sports_private.normalize_kalshi_v1(p_market jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
declare
  yb numeric:=nullif(p_market->>'yes_bid_dollars','')::numeric;
  ya numeric:=nullif(p_market->>'yes_ask_dollars','')::numeric;
  nb numeric:=nullif(p_market->>'no_bid_dollars','')::numeric;
  na numeric:=nullif(p_market->>'no_ask_dollars','')::numeric;
  y numeric:=nullif(p_market->>'last_price_dollars','')::numeric;
  np numeric;
  txt text:=concat_ws(' ',p_market->>'title',p_market->>'subtitle',p_market->>'yes_sub_title',p_market->>'no_sub_title',p_market->>'event_ticker',p_market->>'series_ticker');
  league text:='sports';
  res text:=lower(coalesce(p_market->>'result',''));
begin
  if y is null and yb is not null and ya is not null then y:=(yb+ya)/2; end if;
  if nb is not null and na is not null then np:=(nb+na)/2;
  elsif y is not null then np:=1-y; end if;
  if txt~*'\mNFL\M' then league:='nfl';
  elsif txt~*'\mNBA\M' then league:='nba';
  elsif txt~*'\mMLB\M' then league:='mlb';
  elsif txt~*'\mNHL\M' then league:='nhl';
  elsif txt~*'\mNCAAF\M' then league:='ncaaf';
  elsif txt~*'\mNCAAB\M' then league:='ncaab';
  elsif txt~*'\mWNBA\M' then league:='wnba';
  elsif txt~*'\mMLS\M' then league:='mls';
  elsif txt~*'\mUFC\M' then league:='ufc';
  elsif txt~*'BASKETBALL' then league:='basketball';
  elsif txt~*'FOOTBALL' then league:='football';
  elsif txt~*'BASEBALL' then league:='baseball';
  elsif txt~*'HOCKEY' then league:='hockey';
  elsif txt~*'SOCCER' then league:='soccer';
  elsif txt~*'TENNIS' then league:='tennis';
  elsif txt~*'GOLF' then league:='golf';
  end if;

  return jsonb_build_object(
    'market_id',coalesce(p_market->>'ticker',''),
    'event_id',p_market->>'event_ticker',
    'league',league,
    'market_type',coalesce(p_market->>'market_type','binary'),
    'title',coalesce(p_market->>'title',p_market->>'subtitle',p_market->>'ticker','Untitled sports market'),
    'subtitle',coalesce(p_market->>'subtitle',p_market->>'yes_sub_title'),
    'status',p_market->>'status',
    'close_time',coalesce(p_market->>'close_time',p_market->>'expected_expiration_time',p_market->>'expiration_time'),
    'yes_bid',yb,'yes_ask',ya,'yes_price',y,
    'no_bid',nb,'no_ask',na,'no_price',np,
    'spread',case when yb is not null and ya is not null then greatest(0,ya-yb) else null end,
    'volume',nullif(coalesce(p_market->>'volume_fp',p_market->>'volume'),'')::numeric,
    'volume_24h',nullif(coalesce(p_market->>'volume_24h_fp',p_market->>'volume_24h'),'')::numeric,
    'open_interest',nullif(coalesce(p_market->>'open_interest_fp',p_market->>'open_interest'),'')::numeric,
    'liquidity',nullif(coalesce(p_market->>'liquidity_dollars',p_market->>'liquidity'),'')::numeric,
    'result_yes',case when res='yes' then true when res='no' then false else null end,
    'provider_updated_at',p_market->>'updated_time',
    'raw',p_market
  );
end
$function$


CREATE OR REPLACE FUNCTION sports_private.normalize_polymarket_v1(p_market jsonb, p_market_type text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
declare
  y numeric;
  n numeric;
  b numeric;
  a numeric;
  closed boolean:=coalesce((p_market->>'closed')::boolean,false);
  result_yes boolean;
  league text;
begin
  y:=sports_private.polymarket_price_v1(p_market,0);
  n:=sports_private.polymarket_price_v1(p_market,1);
  b:=nullif(coalesce(p_market->>'bestBid',p_market->>'best_bid'),'')::numeric;
  a:=nullif(coalesce(p_market->>'bestAsk',p_market->>'best_ask'),'')::numeric;
  if y is null and b is not null and a is not null then y:=(b+a)/2; end if;
  if n is null and y is not null then n:=1-y; end if;
  if closed and y is not null and y>=0.999 then result_yes:=true;
  elsif closed and n is not null and n>=0.999 then result_yes:=false;
  else result_yes:=null;
  end if;

  league:=lower(coalesce(
    p_market#>>'{sports,league}',
    p_market#>>'{sports,sport}',
    p_market#>>'{events,0,seriesSlug}',
    p_market#>>'{events,0,series,0,slug}',
    'sports'
  ));

  return jsonb_build_object(
    'market_id',coalesce(p_market->>'id',p_market->>'conditionId',p_market->>'condition_id',''),
    'event_id',coalesce(p_market->>'eventId',p_market->>'event_id',p_market#>>'{events,0,id}'),
    'league',league,
    'market_type',coalesce(p_market->>'sportsMarketType',p_market->>'sports_market_type',p_market#>>'{sports,sportsMarketType}',p_market#>>'{sports,sports_market_type}',p_market_type),
    'title',coalesce(p_market->>'question',p_market->>'title',p_market->>'slug','Untitled sports market'),
    'subtitle',p_market->>'description',
    'status',case when closed then 'closed' when coalesce((p_market->>'active')::boolean,false) then 'active' else 'open' end,
    'close_time',coalesce(p_market->>'endDate',p_market->>'end_date',p_market->>'endDateIso',p_market->>'end_date_iso'),
    'yes_bid',b,'yes_ask',a,'yes_price',y,'no_price',n,
    'spread',coalesce(nullif(p_market->>'spread','')::numeric,case when b is not null and a is not null then greatest(0,a-b) else null end),
    'volume',nullif(coalesce(p_market->>'volumeNum',p_market->>'volume_num',p_market->>'volume'),'')::numeric,
    'volume_24h',nullif(coalesce(p_market->>'volume24hr',p_market->>'volume24Hr',p_market->>'volume24h',p_market#>>'{events,0,volume24hr}'),'')::numeric,
    'open_interest',nullif(coalesce(p_market->>'openInterest',p_market->>'open_interest',p_market#>>'{events,0,openInterest}'),'')::numeric,
    'liquidity',nullif(coalesce(p_market->>'liquidityNum',p_market->>'liquidity_num',p_market->>'liquidity',p_market#>>'{events,0,liquidity}'),'')::numeric,
    'result_yes',result_yes,
    'provider_updated_at',coalesce(p_market->>'updatedAt',p_market->>'updated_at'),
    'raw',p_market
  );
end
$function$


CREATE OR REPLACE FUNCTION sports_private.polymarket_price_v1(p_market jsonb, p_index integer)
 RETURNS numeric
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
declare
  v jsonb;
  x numeric;
begin
  if jsonb_typeof(p_market->'outcomePrices')='array' then
    x:=nullif(p_market->'outcomePrices'->>p_index,'')::numeric;
  elsif nullif(p_market->>'outcomePrices','') is not null then
    begin
      v:=(p_market->>'outcomePrices')::jsonb;
      x:=nullif(v->>p_index,'')::numeric;
    exception when others then x:=null;
    end;
  else
    x:=null;
  end if;
  if x is null then return null; end if;
  return greatest(0::numeric,least(1::numeric,x));
end
$function$


CREATE OR REPLACE FUNCTION sports_private.run_sports_prediction_watch_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_org uuid;
  v_now timestamptz:=now();
  v_pm timestamptz;
  v_ks timestamptz;
  v_stale integer:=0;
  v_queue_old integer:=0;
  v_errors integer:=0;
  v_stale_settlements integer:=0;
  v_crons integer:=0;
  v_problem boolean:=false;
begin
  select id into v_org from public.organizations where slug='misfit-mediahouse' limit 1;
  select last_success_at into v_pm from sports_private.provider_health_v1 where provider='polymarket';
  select last_success_at into v_ks from sports_private.provider_health_v1 where provider='kalshi';

  v_stale:=(case when v_pm is null or v_now-v_pm>interval '45 minutes' then 1 else 0 end)
          +(case when v_ks is null or v_now-v_ks>interval '45 minutes' then 1 else 0 end);

  select count(*)::int into v_queue_old
  from sports_private.http_requests_v1
  where status='queued' and requested_at<v_now-interval '15 minutes';

  select count(*)::int into v_errors
  from sports_private.http_requests_v1
  where status='error' and requested_at>v_now-interval '2 hours';

  select count(*)::int into v_stale_settlements
  from sports_private.calibration_observations_v1 o
  join sports_private.market_latest_v1 l
    on l.provider=o.provider and l.market_id=o.market_id
  where o.settlement_status='pending'
    and o.close_time is not null
    and o.close_time<v_now-interval '6 hours'
    and l.observed_at<v_now-interval '45 minutes';

  select count(*)::int into v_crons
  from cron.job
  where active and jobname in (
    'misfit-sports-prediction-scan-v1',
    'misfit-sports-prediction-refresh-v1',
    'misfit-sports-prediction-harvest-v1'
  );

  v_problem:=v_stale>0 or v_queue_old>0 or v_errors>=3 or v_stale_settlements>25 or v_crons<>3;

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'sports_prediction_intelligence_v1',
    v_problem,
    case when v_stale=2 or v_crons<2 then 'high' else 'medium' end,
    'sports_prediction_research',
    'Misfit Sports Prediction Intelligence V1 requires attention',
    jsonb_build_object(
      'polymarket_last_success',v_pm,
      'kalshi_last_success',v_ks,
      'stale_providers',v_stale,
      'queued_older_than_15m',v_queue_old,
      'request_errors_last_2h',v_errors,
      'stale_unresolved_settlements',v_stale_settlements,
      'active_crons',v_crons,
      'research_only',true,
      'wager_execution_allowed',false,
      'account_actions_allowed',false,
      'money_moved',false
    ),
    'Restore public read-only provider ingestion, clear stale request errors, and refresh stale unresolved settlements. Do not add wager execution or account-action rails.',
    false
  );

  return jsonb_build_object(
    'ok',not v_problem,
    'polymarket_last_success',v_pm,
    'kalshi_last_success',v_ks,
    'stale_providers',v_stale,
    'queued_older_than_15m',v_queue_old,
    'request_errors_last_2h',v_errors,
    'stale_unresolved_settlements',v_stale_settlements,
    'active_crons',v_crons,
    'research_only',true,
    'wager_execution_allowed',false,
    'money_moved',false,
    'checked_at',v_now
  );
end
$function$


CREATE OR REPLACE FUNCTION sports_private.sports_market_quality_watchlist_v1(p_limit integer DEFAULT 25)
 RETURNS jsonb
 LANGUAGE sql
 SET search_path TO ''
AS $function$
with ranked as (
  select
    provider,market_id,event_id,league,market_type,title,status,close_time,
    yes_price,spread,volume,volume_24h,open_interest,liquidity,observed_at,
    (
      case when yes_price between 0.05 and 0.95 then 1 else 0 end
      + case when coalesce(spread,1)<=0.10 then 1 else 0 end
      + case when coalesce(volume,0)>=100 then 1 else 0 end
      + case when coalesce(open_interest,0)>=10 or coalesce(liquidity,0)>=100 then 1 else 0 end
    )::int as quality_score
  from sports_private.market_latest_v1
  where result_yes is null
    and (close_time is null or close_time>now()-interval '2 hours')
)
select coalesce(jsonb_agg(jsonb_build_object(
  'provider',provider,'market_id',market_id,'event_id',event_id,'league',league,
  'market_type',market_type,'title',title,'status',status,'close_time',close_time,
  'yes_probability',yes_price,'spread',spread,'volume',volume,'volume_24h',volume_24h,
  'open_interest',open_interest,'liquidity',liquidity,'quality_score',quality_score,
  'observed_at',observed_at,'research_only',true,'wager_recommendation',false
) order by quality_score desc,coalesce(volume,0) desc,observed_at desc),'[]'::jsonb)
from (
  select * from ranked
  order by quality_score desc,coalesce(volume,0) desc,observed_at desc
  limit greatest(1,least(coalesce(p_limit,25),100))
) x;
$function$


CREATE OR REPLACE FUNCTION sports_private.sports_prediction_report_v1()
 RETURNS jsonb
 LANGUAGE sql
 SET search_path TO ''
AS $function$
with latest as (
  select *
  from sports_private.market_latest_v1
),
cal as (
  select *
  from sports_private.calibration_observations_v1
),
providers as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.provider),'[]'::jsonb) rows
  from (
    select provider,last_success_at,last_error_at,last_error,latest_market_count,latest_sports_market_count,updated_at
    from sports_private.provider_health_v1
  ) x
),
leagues as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.market_count desc),'[]'::jsonb) rows
  from (
    select league,count(*)::int market_count
    from latest
    group by league
    order by count(*) desc
    limit 20
  ) x
),
types as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.market_count desc),'[]'::jsonb) rows
  from (
    select coalesce(market_type,'unknown') market_type,count(*)::int market_count
    from latest
    group by coalesce(market_type,'unknown')
    order by count(*) desc
  ) x
)
select jsonb_build_object(
  'status','RESEARCH_ONLY',
  'providers',providers.rows,
  'markets',jsonb_build_object(
    'latest_total',(select count(*) from latest),
    'polymarket',(select count(*) from latest where provider='polymarket'),
    'kalshi',(select count(*) from latest where provider='kalshi'),
    'leagues',leagues.rows,
    'market_types',types.rows
  ),
  'calibration',jsonb_build_object(
    'observations',(select count(*) from cal),
    'pending',(select count(*) from cal where settlement_status='pending'),
    'settled',(select count(*) from cal where settlement_status='settled'),
    'mean_brier_score',round((select avg(brier_score) from cal where settlement_status='settled'),6)
  ),
  'research_only',true,
  'wager_execution_allowed',false,
  'account_actions_allowed',false,
  'money_moved',false,
  'generated_at',now()
)
from providers,leagues,types;
$function$



revoke execute on function public.misfit_sports_ingest_v1(text,text,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.misfit_sports_ingest_v1(text,text,jsonb,jsonb) to service_role;
revoke execute on function public.misfit_sports_tracked_markets_v1(integer) from public,anon,authenticated;
grant execute on function public.misfit_sports_tracked_markets_v1(integer) to service_role;

revoke execute on function sports_private.polymarket_price_v1(jsonb,integer) from public,anon,authenticated;
revoke execute on function sports_private.normalize_polymarket_v1(jsonb,text) from public,anon,authenticated;
revoke execute on function sports_private.normalize_kalshi_v1(jsonb) from public,anon,authenticated;
revoke execute on function sports_private.enqueue_prediction_market_scan_v1() from public,anon,authenticated;
revoke execute on function sports_private.enqueue_prediction_market_refresh_v1(integer) from public,anon,authenticated;
revoke execute on function sports_private.harvest_prediction_market_http_v1() from public,anon,authenticated;
revoke execute on function sports_private.sports_prediction_report_v1() from public,anon,authenticated;
revoke execute on function sports_private.sports_market_quality_watchlist_v1(integer) from public,anon,authenticated;
revoke execute on function sports_private.run_sports_prediction_watch_v1() from public,anon,authenticated;

do $$
declare r record;
begin
  for r in select jobid from cron.job where jobname in (
    'misfit-sports-prediction-scan-v1',
    'misfit-sports-prediction-refresh-v1',
    'misfit-sports-prediction-harvest-v1',
    'misfit-sentinel-core-watch-v1'
  )
  loop perform cron.unschedule(r.jobid); end loop;
end
$$;

select cron.schedule(
  'misfit-sports-prediction-scan-v1',
  '3,18,33,48 * * * *',
  'select sports_private.enqueue_prediction_market_scan_v1();'
);
select cron.schedule(
  'misfit-sports-prediction-refresh-v1',
  '4,19,34,49 * * * *',
  'select sports_private.enqueue_prediction_market_refresh_v1(24);'
);
select cron.schedule(
  'misfit-sports-prediction-harvest-v1',
  '7,22,37,52 * * * *',
  'select sports_private.harvest_prediction_market_http_v1();'
);
select cron.schedule(
  'misfit-sentinel-core-watch-v1',
  '*/10 * * * *',
  'select ghosbc_private.run_misfit_sentinel_core_watch_v1(); select ghosbc_private.run_trader_cognitive_shadow_watch_v1(); select trader_private.run_market_intelligence_watch_v1(); select trader_private.run_market_intelligence_v2_watch_v1(); select sports_private.run_sports_prediction_watch_v1();'
);
