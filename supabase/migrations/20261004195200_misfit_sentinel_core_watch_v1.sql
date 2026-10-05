-- Misfit Sentinel Core Watch V1
-- Production-verified on 2026-10-04. Infrastructure-only; no money movement or external mutation.

create or replace function ghosbc_private.sentinel_set_watch_v1(
  p_organization_id uuid,
  p_watch_key text,
  p_problem boolean,
  p_severity text,
  p_lane text,
  p_summary text,
  p_evidence jsonb,
  p_recommended_action text,
  p_human_gate boolean default false
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid;
  v_now timestamptz := now();
begin
  if p_problem then
    select id into v_id
    from public.sentinel_alerts
    where organization_id is not distinct from p_organization_id
      and status='open'
      and evidence->>'watch_key'=p_watch_key
    order by created_at desc
    limit 1;

    if v_id is null then
      insert into public.sentinel_alerts(
        organization_id,severity,lane,status,summary,evidence,recommended_action,human_gate
      )
      values(
        p_organization_id,p_severity,p_lane,'open',p_summary,
        coalesce(p_evidence,'{}'::jsonb) || jsonb_build_object(
          'watch_key',p_watch_key,
          'last_checked_at',v_now
        ),
        p_recommended_action,p_human_gate
      )
      returning id into v_id;
    else
      update public.sentinel_alerts
      set severity=p_severity,
          lane=p_lane,
          summary=p_summary,
          evidence=coalesce(p_evidence,'{}'::jsonb) || jsonb_build_object(
            'watch_key',p_watch_key,
            'last_checked_at',v_now
          ),
          recommended_action=p_recommended_action,
          human_gate=p_human_gate,
          resolved_at=null
      where id=v_id;
    end if;
  else
    update public.sentinel_alerts
    set status='resolved',
        resolved_at=v_now,
        evidence=coalesce(evidence,'{}'::jsonb) || jsonb_build_object(
          'resolved_by',p_watch_key,
          'verified_at',v_now
        )
    where organization_id is not distinct from p_organization_id
      and status='open'
      and evidence->>'watch_key'=p_watch_key;
  end if;

  return v_id;
end
$$;

revoke execute on function ghosbc_private.sentinel_set_watch_v1(
  uuid,text,boolean,text,text,text,jsonb,text,boolean
) from public, anon, authenticated;

create or replace function ghosbc_private.run_misfit_sentinel_core_watch_v1()
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := now();
  v_org uuid;
  v_surface jsonb;
  v_intel timestamptz;
  v_shadow timestamptz;
  v_consensus timestamptz;
  v_report timestamptz;
  v_trader_stale boolean := false;
  v_trader_stale_high boolean := false;
  v_live record;
  v_live_unsafe boolean := false;
  v_recent_position_errors integer := 0;
  v_cron_failures integer := 0;
  v_cron_failure_jobs jsonb := '[]'::jsonb;
  v_control_rpc_exposure text[] := '{}'::text[];
  v_public_reporting_rpc_exposure text[] := '{}'::text[];
  v_dispatch_def text := '';
  v_dispatch_credential_literal boolean := false;
  v_open_watch_alerts integer := 0;
begin
  select id into v_org
  from public.organizations
  where slug='misfit-mediahouse'
  limit 1;

  begin
    v_surface := public.run_misfit_surface_security_watch();
  exception when others then
    v_surface := jsonb_build_object(
      'ok',false,
      'error','surface_security_watch_failed',
      'detail',sqlerrm
    );
  end;

  select max(observed_at) into v_intel
  from public.misfit_trader_intelligence_snapshots;

  select max(observed_at) into v_shadow
  from public.misfit_trader_shadow_performance;

  select max(observed_at) into v_consensus
  from public.misfit_trader_position_consensus_snapshots;

  select max(generated_at) into v_report
  from public.misfit_trader_reconsideration_daily_reports;

  v_trader_stale :=
    v_intel is null or v_now-v_intel > interval '35 minutes'
    or v_shadow is null or v_now-v_shadow > interval '35 minutes'
    or v_consensus is null or v_now-v_consensus > interval '35 minutes'
    or v_report is null or v_now-v_report > interval '45 minutes';

  v_trader_stale_high :=
    v_intel is null or v_now-v_intel > interval '90 minutes'
    or v_shadow is null or v_now-v_shadow > interval '90 minutes'
    or v_consensus is null or v_now-v_consensus > interval '90 minutes'
    or v_report is null or v_now-v_report > interval '120 minutes';

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'trader_runtime_freshness_v1',
    v_trader_stale,
    case when v_trader_stale_high then 'high' else 'medium' end,
    'trader_runtime',
    case
      when v_trader_stale_high then 'Misfit Trader runtime evidence is materially stale'
      else 'Misfit Trader runtime evidence missed expected refresh cadence'
    end,
    jsonb_build_object(
      'intelligence_latest',v_intel,
      'shadow_performance_latest',v_shadow,
      'consensus_latest',v_consensus,
      'daily_report_latest',v_report,
      'thresholds',jsonb_build_object(
        'intelligence_minutes',35,
        'shadow_minutes',35,
        'consensus_minutes',35,
        'daily_report_minutes',45
      )
    ),
    'Keep live capital disabled. Inspect Trader cron/job health and restore fresh intelligence, shadow performance, consensus and report evidence before trusting new decisions.',
    false
  );

  select * into v_live
  from public.misfit_trader_live_config
  where config_key='primary'
  limit 1;

  if found then
    v_live_unsafe :=
      (
        coalesce(v_live.execution_enabled,false)
        and (
          coalesce(v_live.mode,'disabled')='disabled'
          or not coalesce(v_live.broker_account_bound,false)
          or not coalesce(v_live.broker_kyc_approved,false)
          or not coalesce(v_live.buying_power_synced,false)
          or not coalesce(v_live.broker_credentials_verified,false)
          or not coalesce(v_live.server_side_order_authority,false)
          or v_live.max_position_usd is null
          or v_live.daily_loss_limit_usd is null
          or not coalesce(v_live.kill_switch_enabled,false)
          or coalesce(v_live.kill_switch_engaged,false)
          or not coalesce(v_live.immutable_audit_required,false)
          or not coalesce(v_live.manual_approval_required,false)
        )
      )
      or (
        coalesce(v_live.ai_authority_enabled,false)
        and (
          not coalesce(v_live.execution_enabled,false)
          or coalesce(v_live.mode,'disabled') not in ('ai_live','live_ai')
        )
      );
  else
    v_live_unsafe := true;
  end if;

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'trader_live_fail_closed_v1',
    v_live_unsafe,
    'high',
    'trader_live_safety',
    'Misfit Trader live-money configuration violated fail-closed invariants',
    case when v_live is null then
      jsonb_build_object('config_present',false)
    else
      jsonb_build_object(
        'config_present',true,
        'mode',v_live.mode,
        'execution_enabled',v_live.execution_enabled,
        'ai_authority_enabled',v_live.ai_authority_enabled,
        'broker_account_bound',v_live.broker_account_bound,
        'broker_kyc_approved',v_live.broker_kyc_approved,
        'buying_power_synced',v_live.buying_power_synced,
        'broker_credentials_verified',v_live.broker_credentials_verified,
        'server_side_order_authority',v_live.server_side_order_authority,
        'max_position_limit_present',v_live.max_position_usd is not null,
        'daily_loss_limit_present',v_live.daily_loss_limit_usd is not null,
        'kill_switch_enabled',v_live.kill_switch_enabled,
        'kill_switch_engaged',v_live.kill_switch_engaged,
        'manual_approval_required',v_live.manual_approval_required,
        'immutable_audit_required',v_live.immutable_audit_required
      )
    end,
    'Engage/keep the kill switch, disable order execution and AI authority, and restore every required broker/risk/audit prerequisite before any live order path is allowed.',
    true
  );

  select count(*)::int into v_recent_position_errors
  from public.misfit_trader_position_requests
  where requested_at > v_now - interval '2 hours'
    and (status='error' or error is not null);

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'trader_position_request_errors_v1',
    v_recent_position_errors > 0,
    case when v_recent_position_errors >= 5 then 'high' else 'medium' end,
    'trader_runtime',
    'Misfit Trader position-intelligence requests are erroring',
    jsonb_build_object(
      'errors_last_2h',v_recent_position_errors,
      'window','2 hours'
    ),
    'Keep execution disabled and inspect position-request provider responses before relying on consensus.',
    false
  );

  select
    count(*)::int,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'jobname',x.jobname,
          'status',x.status,
          'start_time',x.start_time,
          'message',x.return_message
        )
        order by x.start_time desc
      ),
      '[]'::jsonb
    )
  into v_cron_failures,v_cron_failure_jobs
  from (
    select j.jobname,d.status,d.start_time,d.return_message
    from cron.job j
    join lateral (
      select d.status,d.start_time,d.return_message
      from cron.job_run_details d
      where d.jobid=j.jobid
      order by d.start_time desc
      limit 1
    ) d on true
    where d.status not in ('succeeded','running')
      and (
        j.jobname like 'misfit-trader-%'
        or j.jobname in (
          'misfit-agent-scheduler-v1',
          'misfit-surface-security-watch',
          'misfit-signal-feed-refresh',
          'misfit-sentinel-core-watch-v1'
        )
      )
    order by d.start_time desc
  ) x;

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'core_cron_failures_v1',
    v_cron_failures > 0,
    case when v_cron_failures >= 3 then 'high' else 'medium' end,
    'runtime_reliability',
    'One or more core Misfit cron jobs currently have a failed latest run',
    jsonb_build_object(
      'currently_failed_job_count',v_cron_failures,
      'failures',v_cron_failure_jobs,
      'rule','latest-run status only; recovered historical failures do not remain open'
    ),
    'Inspect the currently failed job and restore a successful run. Recovered historical incidents remain in cron.job_run_details but do not hold Sentinel open.',
    false
  );

  select coalesce(array_agg(p.proname order by p.proname),'{}'::text[])
  into v_control_rpc_exposure
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public'
    and p.prosecdef
    and p.proname in (
      'misfit_trader_live_audit_append_only',
      'queue_misfit_trader_position_requests',
      'process_misfit_trader_position_responses',
      'run_misfit_trader_score_cycle',
      'run_misfit_trader_shadow_cycle'
    )
    and (
      has_function_privilege('anon',p.oid,'EXECUTE')
      or has_function_privilege('authenticated',p.oid,'EXECUTE')
    );

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'trader_privileged_control_rpc_exposure_v1',
    cardinality(v_control_rpc_exposure) > 0,
    'high',
    'database_security',
    'Privileged Trader control/write RPCs are callable by client roles',
    jsonb_build_object(
      'functions',to_jsonb(v_control_rpc_exposure),
      'client_roles_checked',jsonb_build_array('anon','authenticated')
    ),
    'Review each RPC intent, then revoke client-role EXECUTE from internal write/control functions or replace SECURITY DEFINER with a least-privilege design. Preserve only intentionally public read surfaces.',
    false
  );

  select coalesce(array_agg(p.proname order by p.proname),'{}'::text[])
  into v_public_reporting_rpc_exposure
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public'
    and p.prosecdef
    and p.proname in (
      'misfit_trader_reconsideration_latest_report',
      'misfit_trader_shadow_metrics',
      'misfit_trader_shadow_public'
    )
    and has_function_privilege('anon',p.oid,'EXECUTE');

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'trader_privileged_public_report_rpc_review_v1',
    cardinality(v_public_reporting_rpc_exposure) > 0,
    'medium',
    'database_security',
    'Public Trader reporting RPCs still use anonymous SECURITY DEFINER execution',
    jsonb_build_object(
      'functions',to_jsonb(v_public_reporting_rpc_exposure),
      'intent','public reporting may be intentional; privilege model still requires explicit review'
    ),
    'Preserve public read functionality, but move these reporting surfaces to least-privilege SECURITY INVOKER views/RPCs where possible or document why SECURITY DEFINER is required.',
    false
  );

  select coalesce(pg_get_functiondef(p.oid),'') into v_dispatch_def
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public'
    and p.proname='dispatch_supported_factory_jobs'
  limit 1;

  v_dispatch_credential_literal :=
    position('x-misfit-dispatch-key' in lower(v_dispatch_def)) > 0
    and position('vault.decrypted_secrets' in lower(v_dispatch_def)) = 0;

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'factory_dispatch_credential_hygiene_v1',
    v_dispatch_credential_literal,
    'high',
    'credential_security',
    'Factory dispatcher contains an embedded runtime credential instead of a Vault lookup',
    jsonb_build_object(
      'function','public.dispatch_supported_factory_jobs',
      'secret_value_exposed_in_alert',false,
      'vault_lookup_detected',not v_dispatch_credential_literal
    ),
    'Rotate the affected dispatcher credential, move the replacement into Supabase Vault, and update the dispatcher to read it at runtime. Never expose the credential in source, logs, alerts or UI.',
    false
  );

  select count(*)::int into v_open_watch_alerts
  from public.sentinel_alerts
  where organization_id is not distinct from v_org
    and status='open'
    and evidence ? 'watch_key';

  insert into public.misfit_agent_recovery_notes(
    note_key,security_class,note,updated_at
  )
  values(
    'misfit-sentinel-core-watch-v1',
    'private',
    jsonb_build_object(
      'status',case when v_open_watch_alerts=0 then 'healthy' else 'watching_alerts' end,
      'checked_at',v_now,
      'open_watch_alerts',v_open_watch_alerts,
      'trader_runtime_stale',v_trader_stale,
      'live_money_fail_closed_violation',v_live_unsafe,
      'position_errors_last_2h',v_recent_position_errors,
      'core_cron_current_failures',v_cron_failures,
      'privileged_control_rpc_exposures',to_jsonb(v_control_rpc_exposure),
      'credential_hygiene_issue',v_dispatch_credential_literal,
      'surface_security_watch',v_surface,
      'castle_gate_required',true,
      'sentinel_mode','read_detect_dedupe_resolve',
      'money_moved',false,
      'external_mutation',false
    ),
    v_now
  )
  on conflict(note_key) do update
  set note=excluded.note,updated_at=excluded.updated_at;

  return jsonb_build_object(
    'ok',not v_trader_stale
      and not v_live_unsafe
      and v_recent_position_errors=0
      and v_cron_failures=0
      and cardinality(v_control_rpc_exposure)=0
      and not v_dispatch_credential_literal,
    'checked_at',v_now,
    'open_watch_alerts',v_open_watch_alerts,
    'trader_runtime_stale',v_trader_stale,
    'live_money_fail_closed_violation',v_live_unsafe,
    'position_errors_last_2h',v_recent_position_errors,
    'core_cron_current_failures',v_cron_failures,
    'privileged_control_rpc_exposures',to_jsonb(v_control_rpc_exposure),
    'public_reporting_rpc_review',to_jsonb(v_public_reporting_rpc_exposure),
    'credential_hygiene_issue',v_dispatch_credential_literal,
    'surface_security_watch',v_surface,
    'money_moved',false,
    'external_mutation',false
  );
end
$$;

revoke execute on function ghosbc_private.run_misfit_sentinel_core_watch_v1()
from public, anon, authenticated;

update public.agent_factory_workers
set capabilities =
      case
        when capabilities @> '["sentinel_core_watch"]'::jsonb then capabilities
        else capabilities || '["sentinel_core_watch","trader_runtime_watch","cron_health_watch","database_privilege_watch","credential_hygiene_watch"]'::jsonb
      end,
    instructions =
      case
        when instructions like '%SENTINEL CORE WATCH V1%' then instructions
        else instructions || E'\n\nSENTINEL CORE WATCH V1: Own the read/detect/dedupe/resolve infrastructure watch for Trader freshness, live-money fail-closed invariants, core cron health, privileged RPC exposure and credential hygiene. Do not move money, enable live trading, rotate credentials autonomously, or alter public behavior merely because an alert exists. Record evidence and preserve human gates.'
      end,
    updated_at=now()
where worker_key='reliability-warden';

do $$
declare r record;
begin
  for r in select jobid from cron.job where jobname='misfit-sentinel-core-watch-v1'
  loop
    perform cron.unschedule(r.jobid);
  end loop;
end
$$;

select cron.schedule(
  'misfit-sentinel-core-watch-v1',
  '*/10 * * * *',
  'select ghosbc_private.run_misfit_sentinel_core_watch_v1();'
);
