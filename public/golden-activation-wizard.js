(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (!['/portfolio/golden-essence', '/golden-essence', '/golden-essence-mobile'].includes(path)) return;

  const API = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation';
  const SITE_KEY = 'golden-essence';
  const DRAFT_KEY = 'misfit_golden_activation_draft_v2';
  const OLD_LINKS = [
    'https://buy.stripe.com/9B6cN5caS66q4ym1wY8ww0y',
    'https://buy.stripe.com/fZubJ15MubqK2qefnO8ww0H',
    '/golden-activate.html',
    '/golden-activate-v2.html',
    '/client-launch.html?site=golden-essence',
  ];

  let state = null;
  let draft = loadDraft();
  let selectedSituation = draft.situation || '';
  let selectedDomain = draft.selected_domain || '';
  let domainLookup = draft.domain_lookup || null;
  let existingInspection = draft.existing_inspection || null;
  let step = 'ownership';
  let statusTimer = null;

  const money = (cents) => cents == null ? '' : `$${(Number(cents) / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  function loadDraft() {
    try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || '{}') || {}; } catch (_) { return {}; }
  }

  function saveDraft() {
    draft = {
      situation: selectedSituation,
      selected_domain: selectedDomain,
      domain_lookup: domainLookup,
      existing_inspection: existingInspection,
      current_domain: draft.current_domain || '',
      current_site: draft.current_site || '',
    };
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (_) {}
  }

  function clearDraft() {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch (_) {}
  }

  function modal() {
    let root = document.getElementById('golden-activation-wizard');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'golden-activation-wizard';
    root.innerHTML = `
      <style>
        #golden-activation-wizard{position:fixed;inset:0;z-index:2147483640;display:none;background:rgba(0,10,12,.92);backdrop-filter:blur(12px);overflow:auto;color:#fff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        #golden-activation-wizard *{box-sizing:border-box}
        #golden-activation-wizard .gw-shell{width:min(720px,100%);min-height:100%;margin:0 auto;padding:18px 14px 50px}
        #golden-activation-wizard .gw-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
        #golden-activation-wizard .gw-brand{display:flex;align-items:center;gap:9px;color:#e9b75a;font-family:Georgia,serif;font-weight:700;letter-spacing:.08em;font-size:13px}
        #golden-activation-wizard .gw-close{width:42px;height:42px;border-radius:999px;border:1px solid rgba(231,179,87,.45);background:#06272a;color:#f7e8cf;font-size:22px;cursor:pointer}
        #golden-activation-wizard .gw-card{border:1px solid rgba(226,165,60,.42);border-radius:26px;background:linear-gradient(180deg,rgba(4,40,43,.98),rgba(1,19,21,.98));box-shadow:0 28px 90px rgba(0,0,0,.56);padding:24px}
        #golden-activation-wizard .gw-eyebrow{font-size:10px;letter-spacing:.19em;text-transform:uppercase;color:#efbd61;font-weight:800}
        #golden-activation-wizard h2{font-family:Georgia,serif;font-size:clamp(32px,8vw,48px);line-height:1.02;margin:10px 0 0;color:#fff7ea;font-weight:500}
        #golden-activation-wizard h3{font-family:Georgia,serif;font-size:25px;margin:0;color:#fff7ea;font-weight:500}
        #golden-activation-wizard p{color:#e7dccb;line-height:1.62}
        #golden-activation-wizard .gw-muted{color:#9fb2b2;font-size:13px;line-height:1.55}
        #golden-activation-wizard .gw-rows{display:grid;gap:10px;margin-top:18px}
        #golden-activation-wizard .gw-row{display:flex;gap:10px;align-items:flex-start;border:1px solid rgba(255,255,255,.08);border-radius:15px;background:rgba(255,255,255,.035);padding:13px 14px;font-size:13px;line-height:1.48;color:#e8e0d3}
        #golden-activation-wizard .gw-check{color:#f0ba59;font-weight:900}
        #golden-activation-wizard .gw-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}
        #golden-activation-wizard button,#golden-activation-wizard a{font:inherit}
        #golden-activation-wizard .gw-primary{display:inline-flex;align-items:center;justify-content:center;min-height:50px;border:0;border-radius:999px;background:#e2a53c;color:#07292b;padding:0 22px;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;cursor:pointer}
        #golden-activation-wizard .gw-primary[disabled]{opacity:.42;cursor:not-allowed}
        #golden-activation-wizard .gw-secondary{display:inline-flex;align-items:center;justify-content:center;min-height:48px;border:1px solid rgba(226,165,60,.5);border-radius:999px;background:transparent;color:#efc77d;padding:0 20px;font-size:12px;font-weight:800;text-decoration:none;cursor:pointer}
        #golden-activation-wizard .gw-options{display:grid;gap:10px;margin-top:18px}
        #golden-activation-wizard .gw-option{width:100%;text-align:left;border:1px solid rgba(255,255,255,.11);border-radius:18px;background:rgba(255,255,255,.025);color:#fff;padding:17px;cursor:pointer}
        #golden-activation-wizard .gw-option:hover,#golden-activation-wizard .gw-option.active{border-color:#e2a53c;background:rgba(226,165,60,.07)}
        #golden-activation-wizard .gw-option strong{display:block;font-size:16px;color:#fff5e4}
        #golden-activation-wizard .gw-option span{display:block;color:#aebaba;font-size:12px;line-height:1.5;margin-top:5px}
        #golden-activation-wizard .gw-field{display:grid;gap:7px;margin-top:16px;color:#d9d0c2;font-size:12px;font-weight:700}
        #golden-activation-wizard input{width:100%;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:#02181a;color:#fff;padding:14px 15px;font-size:16px;outline:none}
        #golden-activation-wizard input:focus{border-color:#e2a53c;box-shadow:0 0 0 3px rgba(226,165,60,.12)}
        #golden-activation-wizard .gw-search{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end}
        #golden-activation-wizard .gw-results{display:grid;gap:9px;margin-top:15px}
        #golden-activation-wizard .gw-result{display:flex;justify-content:space-between;gap:10px;align-items:center;border:1px solid rgba(255,255,255,.09);border-radius:16px;background:rgba(0,0,0,.22);padding:13px}
        #golden-activation-wizard .gw-result strong{display:block;font-size:14px;color:#fff}
        #golden-activation-wizard .gw-result small{display:block;color:#94a5a5;margin-top:4px;line-height:1.35}
        #golden-activation-wizard .gw-result button{border:1px solid rgba(226,165,60,.5);border-radius:999px;background:transparent;color:#f1c66f;padding:9px 12px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;white-space:nowrap}
        #golden-activation-wizard .gw-result.selected{border-color:#e2a53c;background:rgba(226,165,60,.08)}
        #golden-activation-wizard .gw-badge{display:inline-flex;border-radius:999px;padding:5px 8px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;margin-top:6px;background:rgba(109,231,183,.12);color:#91efca}
        #golden-activation-wizard .gw-badge.warn{background:rgba(251,191,36,.12);color:#f6cb70}
        #golden-activation-wizard .gw-badge.bad{background:rgba(251,113,133,.12);color:#fda4af}
        #golden-activation-wizard .gw-notice{margin-top:16px;border:1px solid rgba(226,165,60,.22);border-radius:15px;background:rgba(226,165,60,.045);padding:13px;color:#cfdbd9;font-size:12px;line-height:1.55}
        #golden-activation-wizard .gw-found{margin-top:16px;border:1px solid rgba(109,231,183,.22);border-radius:17px;background:rgba(109,231,183,.04);padding:15px;color:#dbe8e5;font-size:13px;line-height:1.55}
        #golden-activation-wizard .gw-review{display:grid;gap:9px;margin-top:18px}
        #golden-activation-wizard .gw-review div{display:flex;justify-content:space-between;gap:14px;border-bottom:1px solid rgba(255,255,255,.07);padding:10px 0;color:#cbd6d4;font-size:13px}
        #golden-activation-wizard .gw-review strong{color:#fff1d8;text-align:right}
        #golden-activation-wizard .gw-error{color:#fda4af;font-size:12px;line-height:1.45;margin-top:12px}
        #golden-activation-wizard .gw-loader{display:inline-block;width:17px;height:17px;border:2px solid rgba(255,255,255,.25);border-top-color:#e2a53c;border-radius:50%;animation:gwspin .8s linear infinite;vertical-align:-3px;margin-right:7px}
        @keyframes gwspin{to{transform:rotate(360deg)}}
        @media(min-width:650px){#golden-activation-wizard .gw-shell{padding-top:28px}#golden-activation-wizard .gw-card{padding:30px}#golden-activation-wizard .gw-options{grid-template-columns:1fr 1fr}}
      </style>
      <div class="gw-shell">
        <div class="gw-top"><div class="gw-brand">✦ GOLDEN ESSENCE THERAPEUTICS</div><button class="gw-close" type="button" aria-label="Close activation">×</button></div>
        <section class="gw-card"><div id="gw-content"></div></section>
      </div>`;
    document.body.append(root);
    qs('.gw-close', root).addEventListener('click', close);
    root.addEventListener('click', (event) => { if (event.target === root) close(); });
    return root;
  }

  function open(forceStep) {
    const root = modal();
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    root.style.display = 'block';
    if (forceStep) step = forceStep;
    render();
  }

  function close() {
    const root = document.getElementById('golden-activation-wizard');
    if (root) root.style.display = 'none';
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');
  }

  function content() { return qs('#gw-content', modal()); }

  function backButton(target = 'situation') {
    return `<button type="button" class="gw-secondary" data-gw-back="${target}">← Back</button>`;
  }

  function bindBack() {
    qsa('[data-gw-back]', modal()).forEach((button) => button.addEventListener('click', () => { step = button.dataset.gwBack; render(); }));
  }

  function renderOwnership() {
    content().innerHTML = `
      <div class="gw-eyebrow">Site activation</div>
      <h2>Your site. Your ownership. $297 once.</h2>
      <p>This activates the Golden Essence Therapeutics website you already reviewed. Before Stripe, we’ll figure out the domain/site situation together so there are no mystery questions at checkout.</p>
      <div class="gw-rows">
        <div class="gw-row"><span class="gw-check">✓</span><span>You own the finished client-specific website and business content.</span></div>
        <div class="gw-row"><span class="gw-check">✓</span><span>You control the domain/registrar account and can move the site later.</span></div>
        <div class="gw-row"><span class="gw-check">✓</span><span>No required monthly Misfit plan just to keep the basic website.</span></div>
        <div class="gw-row"><span class="gw-check">✓</span><span>Misfit handles launch, DNS connection, SSL and the owner/admin handoff.</span></div>
      </div>
      <div class="gw-actions"><button class="gw-primary" id="gw-continue">Continue →</button></div>`;
    qs('#gw-continue').addEventListener('click', () => { step = 'situation'; render(); });
  }

  function renderSituation() {
    content().innerHTML = `
      <div class="gw-eyebrow">Step 1 of 2</div>
      <h2>What do you already have?</h2>
      <p>Pick the closest answer. You do not need to know what DNS, hosting, registrar or nameservers mean.</p>
      <div class="gw-options">
        <button class="gw-option" data-situation="need_domain"><strong>I need a domain</strong><span>I don’t own a web address yet. Help me search and choose one here.</span></button>
        <button class="gw-option" data-situation="own_domain"><strong>I already own a domain</strong><span>I have a web address somewhere. Misfit can detect the registrar and tell me the next step.</span></button>
        <button class="gw-option" data-situation="existing_site"><strong>I already have a website</strong><span>Enter the current URL and Misfit will inspect the setup instead of making me explain it.</span></button>
        <button class="gw-option" data-situation="not_sure"><strong>I’m not sure</strong><span>That’s fine. Pay for the site and Misfit will give me one clear next action.</span></button>
      </div>
      <div class="gw-actions">${backButton('ownership')}</div>`;
    qsa('[data-situation]').forEach((button) => button.addEventListener('click', () => {
      selectedSituation = button.dataset.situation;
      saveDraft();
      if (selectedSituation === 'need_domain') step = 'domain';
      else if (selectedSituation === 'own_domain') step = 'own-domain';
      else if (selectedSituation === 'existing_site') step = 'existing-site';
      else step = 'review';
      render();
    }));
    bindBack();
  }

  function resultLabel(item) {
    if (!item.available) return `<span class="gw-badge bad">Taken</span>`;
    if (item.requires_approval) return `<span class="gw-badge warn">Premium / special price</span>`;
    if (item.included === true) return `<span class="gw-badge">Available · standard domain included</span>`;
    return `<span class="gw-badge">Looks available</span>`;
  }

  async function searchDomains(query) {
    const list = qs('#gw-domain-results');
    const error = qs('#gw-domain-error');
    error.textContent = '';
    list.innerHTML = `<div class="gw-muted"><span class="gw-loader"></span>Checking domain availability…</div>`;
    try {
      const response = await fetch(`${API}/domain-search?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error('Could not check that domain yet.');
      const results = Array.isArray(data.results) ? data.results : [];
      if (!results.length) { list.innerHTML = '<div class="gw-muted">No matches came back. Try the exact domain you want, including .com.</div>'; return; }
      list.innerHTML = results.map((item, index) => {
        const pricing = item.price_cents ? `First year ${money(item.price_cents)}${item.renewal_cents ? ` · renewal ${money(item.renewal_cents)}/yr` : ''}` : (item.note || 'Final registrar pricing is verified before registration.');
        return `<div class="gw-result ${selectedDomain === item.domain ? 'selected' : ''}" data-result-index="${index}">
          <div><strong>${esc(item.domain)}</strong>${resultLabel(item)}<small>${esc(pricing)}</small></div>
          ${item.available && !item.requires_approval ? `<button type="button" data-select-domain="${index}">${selectedDomain === item.domain ? 'Selected' : 'Choose'}</button>` : ''}
        </div>`;
      }).join('');
      qsa('[data-select-domain]').forEach((button) => button.addEventListener('click', () => {
        const item = results[Number(button.dataset.selectDomain)];
        selectedDomain = item.domain;
        domainLookup = item;
        saveDraft();
        renderDomain();
      }));
      if (!data.definitive_search) {
        const note = document.createElement('div');
        note.className = 'gw-notice';
        note.textContent = 'This lookup can identify likely availability. Final registrar availability and price are verified before any domain is registered. Premium/special-priced domains are never purchased without approval.';
        list.append(note);
      }
    } catch (err) {
      list.innerHTML = '';
      error.textContent = err.message || 'Could not check that domain yet.';
    }
  }

  function renderDomain() {
    content().innerHTML = `
      <div class="gw-eyebrow">Step 1 of 2 · Domain</div>
      <h2>Search for the web address you want.</h2>
      <p>You only choose the name here. No GoDaddy account, DNS setup or passwords yet.</p>
      <div class="gw-search">
        <label class="gw-field" style="margin:0">Domain or business name<input id="gw-domain-query" value="${esc(selectedDomain || 'goldenessencetherapeutics.com')}" placeholder="goldenessencetherapeutics.com"></label>
        <button class="gw-primary" id="gw-domain-search" style="min-height:49px">Search</button>
      </div>
      <div id="gw-domain-results" class="gw-results">${selectedDomain ? `<div class="gw-result selected"><div><strong>${esc(selectedDomain)}</strong>${resultLabel(domainLookup || {available:true})}<small>${domainLookup?.price_cents ? `First year ${money(domainLookup.price_cents)}` : 'Selected for launch.'}</small></div><button type="button">Selected</button></div>` : ''}</div>
      <div id="gw-domain-error" class="gw-error"></div>
      <div class="gw-notice"><strong>Simple rule:</strong> standard domains stay in the normal site-launch path. If a domain has premium/special pricing, this wizard makes you pick another one instead of surprising you with an extra bill.</div>
      <div class="gw-actions">${backButton('situation')}<button class="gw-primary" id="gw-domain-next" ${selectedDomain ? '' : 'disabled'}>Continue with domain →</button></div>`;
    qs('#gw-domain-search').addEventListener('click', () => searchDomains(qs('#gw-domain-query').value));
    qs('#gw-domain-query').addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); searchDomains(event.currentTarget.value); } });
    qs('#gw-domain-next').addEventListener('click', () => { if (!selectedDomain) return; step = 'review'; render(); });
    bindBack();
  }

  async function inspectExisting(value, mode) {
    const result = qs('#gw-inspection');
    const error = qs('#gw-inspection-error');
    error.textContent = '';
    result.innerHTML = `<span class="gw-loader"></span>Checking the current setup…`;
    try {
      const response = await fetch(`${API}/inspect-existing`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ value }) });
      const data = await response.json();
      if (!response.ok) throw new Error('Could not inspect that address yet.');
      existingInspection = data;
      if (mode === 'domain') draft.current_domain = data.domain || value;
      else draft.current_site = value;
      saveDraft();
      const registrar = data.registrar || 'Not confidently detected';
      const platform = data.website_platform && data.website_platform !== 'unknown' ? data.website_platform : 'Not confidently detected';
      result.innerHTML = `<div class="gw-found"><strong>We found:</strong><br>Domain: ${esc(data.domain || value)}<br>Registrar: ${esc(registrar)}<br>Website platform: ${esc(platform)}<br><br>You do not need to explain any of that to Misfit. We save it with the purchase and route the correct access step afterward.</div>`;
      qs('#gw-inspection-next').disabled = false;
    } catch (err) {
      result.innerHTML = '';
      error.textContent = err.message || 'Could not inspect that address yet.';
    }
  }

  function renderOwnDomain() {
    const current = draft.current_domain || '';
    content().innerHTML = `
      <div class="gw-eyebrow">Step 1 of 2 · Existing domain</div>
      <h2>What domain do you already own?</h2>
      <p>Enter it. Misfit will try to identify the registrar for you — GoDaddy, Cloudflare, Namecheap, Squarespace, or whatever it actually is.</p>
      <label class="gw-field">Your domain<input id="gw-existing-domain" value="${esc(current)}" placeholder="yourbusiness.com"></label>
      <div id="gw-inspection" class="gw-muted">${existingInspection ? `Previously detected: ${esc(existingInspection.registrar || existingInspection.connection_provider || 'provider found')}` : ''}</div>
      <div id="gw-inspection-error" class="gw-error"></div>
      <div class="gw-actions">${backButton('situation')}<button class="gw-secondary" id="gw-inspect-domain">Check my domain</button><button class="gw-primary" id="gw-inspection-next" ${existingInspection ? '' : 'disabled'}>Continue →</button></div>`;
    qs('#gw-inspect-domain').addEventListener('click', () => {
      const value = qs('#gw-existing-domain').value.trim();
      if (!value) return;
      draft.current_domain = value;
      inspectExisting(value, 'domain');
    });
    qs('#gw-inspection-next').addEventListener('click', () => { step = 'review'; render(); });
    bindBack();
  }

  function renderExistingSite() {
    const current = draft.current_site || '';
    content().innerHTML = `
      <div class="gw-eyebrow">Step 1 of 2 · Existing website</div>
      <h2>Paste the site you already have.</h2>
      <p>We’ll inspect it and try to identify both the domain registrar and website platform, so you don’t have to know what anything is called.</p>
      <label class="gw-field">Current website<input id="gw-existing-site" value="${esc(current)}" placeholder="https://yourbusiness.com"></label>
      <div id="gw-inspection" class="gw-muted">${existingInspection ? `Previously detected: ${esc(existingInspection.registrar || existingInspection.website_platform || 'provider found')}` : ''}</div>
      <div id="gw-inspection-error" class="gw-error"></div>
      <div class="gw-actions">${backButton('situation')}<button class="gw-secondary" id="gw-inspect-site">Check my setup</button><button class="gw-primary" id="gw-inspection-next" ${existingInspection ? '' : 'disabled'}>Continue →</button></div>`;
    qs('#gw-inspect-site').addEventListener('click', () => {
      const value = qs('#gw-existing-site').value.trim();
      if (!value) return;
      draft.current_site = value;
      inspectExisting(value, 'site');
    });
    qs('#gw-inspection-next').addEventListener('click', () => { step = 'review'; render(); });
    bindBack();
  }

  function situationLabel() {
    return ({ need_domain: 'Need a new domain', own_domain: 'Already own a domain', existing_site: 'Already have a website', not_sure: 'Not sure — Misfit guides it' })[selectedSituation] || 'Not selected';
  }

  function domainLine() {
    if (selectedSituation === 'need_domain') return selectedDomain || 'Not selected';
    if (selectedSituation === 'own_domain') return existingInspection?.domain || draft.current_domain || 'Existing domain';
    if (selectedSituation === 'existing_site') return existingInspection?.domain || draft.current_site || 'Existing website';
    return 'Misfit will identify it';
  }

  async function createCheckout(button) {
    const error = qs('#gw-checkout-error');
    error.textContent = '';
    button.disabled = true;
    button.innerHTML = '<span class="gw-loader"></span>Opening secure checkout…';
    const intake = {
      business_name: 'Golden Essence Therapeutics',
      selected_domain: selectedDomain || null,
      desired_domain: selectedDomain || null,
      current_domain: existingInspection?.domain || draft.current_domain || null,
      current_site: draft.current_site || null,
      registrar: existingInspection?.registrar || null,
      registrar_provider: existingInspection?.registrar_provider || null,
      website_platform: existingInspection?.website_platform || null,
      connection_provider: existingInspection?.connection_provider || null,
    };
    try {
      saveDraft();
      const response = await fetch(`${API}/create-checkout`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ site_key: SITE_KEY, situation: selectedSituation, selected_domain: selectedDomain || null, intake, domain_lookup: domainLookup || existingInspection || {} }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.checkout_url) throw new Error(data.error === 'select_domain_before_payment' ? 'Choose an available domain before payment.' : 'Secure checkout could not open yet. Please try again.');
      location.href = data.checkout_url;
    } catch (err) {
      error.textContent = err.message || 'Could not open checkout yet.';
      button.disabled = false;
      button.textContent = 'Pay $297 securely →';
    }
  }

  function renderReview() {
    if (!selectedSituation) { step = 'situation'; render(); return; }
    const provider = existingInspection?.registrar || existingInspection?.connection_provider || 'Misfit will identify it';
    const domainNote = selectedSituation === 'need_domain' && domainLookup?.included === true
      ? 'Standard first year included'
      : selectedSituation === 'need_domain' ? 'Final registrar check before registration' : 'No new domain purchase unless needed';
    content().innerHTML = `
      <div class="gw-eyebrow">Step 2 of 2 · Review</div>
      <h2>Here’s exactly what happens.</h2>
      <div class="gw-review">
        <div><span>Website activation</span><strong>$297 once</strong></div>
        <div><span>Your situation</span><strong>${esc(situationLabel())}</strong></div>
        <div><span>Domain / current site</span><strong>${esc(domainLine())}</strong></div>
        <div><span>Domain registration</span><strong>${esc(domainNote)}</strong></div>
        <div><span>Detected provider</span><strong>${esc(provider)}</strong></div>
        <div><span>Required monthly fee</span><strong>None</strong></div>
        <div><span>Site ownership</span><strong>Yours</strong></div>
      </div>
      <div class="gw-notice">After payment, you come right back to this Golden Essence site. If account access is needed, we show the exact provider and one connect step. You never send Misfit a password. If you don’t know your provider, we detect what we can and Misfit handles the rest.</div>
      <div id="gw-checkout-error" class="gw-error"></div>
      <div class="gw-actions">${backButton(selectedSituation === 'need_domain' ? 'domain' : selectedSituation === 'own_domain' ? 'own-domain' : selectedSituation === 'existing_site' ? 'existing-site' : 'situation')}<button class="gw-primary" id="gw-pay">Pay $297 securely →</button></div>`;
    qs('#gw-pay').addEventListener('click', (event) => createCheckout(event.currentTarget));
    bindBack();
  }

  function postPaymentCopy(summary) {
    const situation = summary?.situation || '';
    const provider = summary?.connection_provider || summary?.registrar_provider || 'unknown';
    if (situation === 'need_domain') {
      return {
        title: 'Payment confirmed. Your domain choice is saved.',
        body: `You chose ${summary?.selected_domain || state?.custom_domain || 'your domain'}. Misfit now verifies final registrar availability/pricing, handles registration/ownership setup, connects DNS and SSL, and completes the handoff. You do not need to text technical answers.`,
        provider,
      };
    }
    if (['own_domain', 'existing_site'].includes(situation)) {
      return {
        title: 'Payment confirmed. We found your existing setup.',
        body: `The saved provider is ${summary?.registrar || provider || 'your current provider'}. The next step is secure delegate/collaborator access — never a password.`,
        provider,
      };
    }
    return {
      title: 'Payment confirmed. Misfit handles the technical part.',
      body: 'You told us you are not sure what you have. That is enough. Misfit will identify the setup and give you one clear next action instead of making you diagnose hosting or DNS.',
      provider,
    };
  }

  function renderPaid() {
    const summary = state?.launch_summary || {};
    const copy = postPaymentCopy(summary);
    const provider = copy.provider;
    const providerName = provider && provider !== 'unknown' && provider !== 'other' ? provider.charAt(0).toUpperCase() + provider.slice(1) : '';
    const connectUrl = summary?.connection_url || '';
    const connect = connectUrl ? `<a class="gw-primary" href="${esc(connectUrl)}" target="_blank" rel="noopener noreferrer">Open ${esc(providerName || 'provider')} connection →</a>` : '';
    const extra = provider === 'godaddy'
      ? '<div class="gw-notice"><strong>GoDaddy:</strong> the domain owner keeps the login and payment details. GoDaddy delegate access lets Misfit manage the domain without seeing the password. If you do not already have a GoDaddy account, GoDaddy can prompt you to create one when access is set up.</div>'
      : '<div class="gw-notice">If your provider supports delegate/collaborator access, Misfit uses that. No password should ever be texted or pasted into this form.</div>';
    content().innerHTML = `
      <div class="gw-eyebrow">Activation paid</div>
      <h2>${esc(copy.title)}</h2>
      <p>${esc(copy.body)}</p>
      <div class="gw-rows">
        <div class="gw-row"><span class="gw-check">✓</span><span>Website ownership confirmed</span></div>
        <div class="gw-row"><span class="gw-check">✓</span><span>Domain/site situation saved with the payment</span></div>
        <div class="gw-row"><span class="gw-check">✓</span><span>Misfit owner task created for the launch handoff</span></div>
        <div class="gw-row"><span class="gw-check">✓</span><span>No mandatory monthly plan added</span></div>
      </div>
      ${extra}
      <div class="gw-actions">${connect}<button class="gw-secondary" id="gw-done">Back to my site</button></div>`;
    clearDraft();
    qs('#gw-done').addEventListener('click', close);
  }

  function renderProcessing() {
    content().innerHTML = `<div class="gw-eyebrow">Payment received</div><h2>Activating your site…</h2><p><span class="gw-loader"></span>Stripe is confirming the payment and attaching your domain/site setup to the launch. This normally takes a few seconds.</p>`;
  }

  function render() {
    if (state?.activated) { renderPaid(); return; }
    if (step === 'processing') { renderProcessing(); return; }
    if (step === 'situation') { renderSituation(); return; }
    if (step === 'domain') { renderDomain(); return; }
    if (step === 'own-domain') { renderOwnDomain(); return; }
    if (step === 'existing-site') { renderExistingSite(); return; }
    if (step === 'review') { renderReview(); return; }
    renderOwnership();
  }

  async function refreshStatus() {
    try {
      const response = await fetch(`${API}/status?site=${SITE_KEY}`, { cache: 'no-store' });
      if (!response.ok) return;
      state = await response.json();
      if (document.getElementById('golden-activation-wizard')?.style.display === 'block') render();
      if (state.activated && statusTimer) { clearInterval(statusTimer); statusTimer = null; }
    } catch (_) {}
  }

  function isActivationLink(anchor) {
    if (!anchor) return false;
    const href = anchor.getAttribute('href') || '';
    const text = (anchor.textContent || '').toLowerCase();
    return OLD_LINKS.includes(href) || href === '#activate' || href.includes('buy.stripe.com') || ((text.includes('activate') || text.includes('finish launch setup')) && anchor.closest('footer, #golden-preview-expired'));
  }

  function normalizeButtonsAndCopy() {
    qsa('a').forEach((anchor) => {
      if (!isActivationLink(anchor)) return;
      anchor.setAttribute('href', '#activate');
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
    });
    const note = document.getElementById('golden-preview-fine-print');
    if (note) {
      const countdown = note.textContent.match(/^48-hour live preview[^.]*\./)?.[0] || '';
      const next = `${countdown ? countdown + ' ' : ''}$297 one-time activation. Tap Activate, choose a new domain or tell us what you already have, then pay securely. Misfit handles launch, DNS and owner/admin handoff — no mandatory monthly plan.`;
      if (note.textContent !== next) note.textContent = next;
    }
    const oldProcessing = document.getElementById('golden-activation-processing');
    if (oldProcessing && document.getElementById('golden-activation-wizard')?.style.display === 'block') oldProcessing.remove();
  }

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest?.('a');
    if (!isActivationLink(anchor)) return;
    event.preventDefault();
    open(state?.activated ? 'paid' : 'ownership');
  }, true);

  window.addEventListener('hashchange', () => { if (location.hash === '#activate') open(); });

  refreshStatus();
  normalizeButtonsAndCopy();
  const observer = new MutationObserver(normalizeButtonsAndCopy);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  const params = new URLSearchParams(location.search);
  if (params.get('activation') === 'processing') {
    step = 'processing';
    open('processing');
    statusTimer = setInterval(refreshStatus, 1800);
  } else if (params.get('activation') === 'cancelled' || params.get('activate') === '1' || location.hash === '#activate') {
    open('ownership');
  }

  window.GoldenActivationWizard = { open, close, refreshStatus };
})();