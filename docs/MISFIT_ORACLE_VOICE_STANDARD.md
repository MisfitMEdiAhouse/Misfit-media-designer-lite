# Misfit Voice Standard

Status: ACTIVE / OWNER APPROVED  
Owner: Misfit Mediahouse  
Canonical benchmark: Stan Hansen / Egnyte tour voice rail

## Canonical voice

- Provider: AI Voice Generator
- Voice profile: `fancy`
- Presentation: Female · Fancy
- Delivery: refined, polished, human-sounding enterprise narrator
- Playback rate: 1.0
- Pitch processing: disabled
- Mixed browser-TTS fallback: disabled for canonical narrated flows
- Brand pronunciation: written `GHOSBC OS`, spoken `Ghost BC OS`

## Owner directive

The shipped Stan Hansen / Egnyte narration is the canonical Misfit Voice identity.

Do not replace it with a different male, baritone, robotic, novelty, or browser-default voice unless the owner explicitly approves a new standard.

New Misfit narrated surfaces should use the same `fancy` voice profile and pacing so the brand sounds consistent across demos, products, sales guides, Trader, and future public experiences.

## Interaction rule

Do not rely on surprise autoplay with sound. Modern browsers frequently block it and users should control audio.

Preferred pattern:

1. Visible `Misfit Voice` control.
2. User taps to play.
3. One canonical voice profile per experience.
4. Pause/stop remains available.
5. Product functionality never depends on audio playback.

## Sales use

Misfit Voice may explain public products, direct visitors toward free diagnostics, public checkout, or agency contact, and narrate public-safe demonstrations.

It must not:

- make guaranteed revenue claims;
- claim a demo is a finished product when it is not;
- expose private GHOSBC / Soul Cipher internals;
- imply brokerage authority or guaranteed trading returns;
- fabricate customer results;
- speak secrets, API keys, or private audit material.

## Source of truth

The public metadata rail is mirrored in:

`/public/misfit-voice-standard.json`

Existing deployed Stan/Egnyte compatibility files remain valid:

- `public/stan-voice-profile.json`
- `public/stan-consistent-neural-voice.js`
- `public/stan-voice-upgrade.js`

Trader compatibility remains on the approved voice rail through its existing tour/dial-in scripts.

## Change control

Finding another voice that sounds good is not authorization to replace the canonical voice.

A canonical voice change requires explicit owner approval.
