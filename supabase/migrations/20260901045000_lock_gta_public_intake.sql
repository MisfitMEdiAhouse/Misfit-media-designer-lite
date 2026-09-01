-- Public GTA submissions must enter through the rate-limited public-catalog edge function.
-- Keep approved directory reads public; remove direct table mutation authority.

drop policy if exists gaming_requests_public_submit on public.gaming_portal_requests;
drop policy if exists gaming_servers_public_submit on public.gaming_servers;
drop policy if exists gaming_creators_public_submit on public.gaming_creators;

revoke all privileges on table public.gaming_portal_requests from anon, authenticated;
revoke all privileges on table public.gaming_servers from anon, authenticated;
revoke all privileges on table public.gaming_creators from anon, authenticated;

grant select on table public.gaming_servers to anon, authenticated;
grant select on table public.gaming_creators to anon, authenticated;
