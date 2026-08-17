export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const anonymousId = `roads_smoke_${crypto.randomUUID()}`;
  const base = 'https://misfitmediahouse.com';
  const headers = { 'Content-Type': 'application/json', Origin: base };

  try {
    const eventResponse = await fetch(`${base}/api/roads-event`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        anonymousId,
        eventType: 'production_smoke_test',
        source: 'roads_smoke_probe',
        medium: 'synthetic',
        campaign: 'roads_e2e_repair',
        moduleKey: 'roads_smoke',
        landingPage: '/api/roads-smoke',
        metadata: { synthetic: true },
      }),
    });
    const event = await eventResponse.json().catch(() => ({}));

    if (!eventResponse.ok || !event.ok) {
      return res.status(500).json({ ok: false, stage: 'event', anonymousId, status: eventResponse.status, event });
    }

    const intakeResponse = await fetch(`${base}/api/roads-intake`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        anonymousId,
        action: 'save_vehicle_profile',
        vehicle: {
          year: 1997,
          make: 'Chevrolet',
          model: 'Suburban',
          trim: 'LS',
          drivetrain: '4WD',
          mods: { synthetic: true },
          useCases: ['production_smoke_test'],
        },
        metadata: { synthetic: true, source: 'roads_smoke_probe' },
      }),
    });
    const intake = await intakeResponse.json().catch(() => ({}));

    return res.status(intakeResponse.ok && intake.ok ? 200 : 500).json({
      ok: Boolean(event.ok && intake.ok),
      anonymousId,
      eventStatus: eventResponse.status,
      intakeStatus: intakeResponse.status,
      event,
      intake,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, stage: 'exception', error: error instanceof Error ? error.message : String(error) });
  }
}
