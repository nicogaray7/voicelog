# VoiceLog

VoiceLog is a mobile app that lets field sales reps dictate visit notes right after a meeting and turns them into structured CRM updates, automatically.

Instead of typing reports later from memory, the rep records a short voice note. VoiceLog transcribes it, structures it into CRM-ready fields, and syncs it to the team's CRM, even if the rep was offline when they recorded it.

## How it works

1. **1-tap recording**: the rep taps to record a short voice note after a visit.
2. **Offline-first queue**: the recording and its processing state are stored locally (SQLite) first, so nothing is lost without network coverage.
3. **Ghost Sync**: transcription and structuring run asynchronously in the background, so the UI stays responsive; the rep gets notified once processing completes.
4. **Transcription**: audio is transcribed via Groq's Whisper API for low-latency speech-to-text.
5. **Structuring**: the raw transcript is turned into structured note data (summary, entities, next steps) via the Claude API.
6. **CRM sync**: structured reports are pushed to the connected CRM (HubSpot or Pipedrive) through a provider-based sync service.

## Tech stack

- **App**: React Native + Expo (TypeScript, strict types)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Local storage**: Expo SQLite, offline-first queue
- **Backend**: Supabase (Postgres, Auth, Storage, Row Level Security)
- **Speech-to-text**: Groq (Whisper)
- **Structuring**: Claude API
- **CRM integrations**: HubSpot, Pipedrive (interface-based providers, extensible to other CRMs)

## Project structure

- `services/ai`: transcription and structuring integrations (Groq, Claude)
- `services/crm`: CRM provider interfaces and implementations (HubSpot, Pipedrive)
- `services/sync`: sync orchestration between the local queue and the CRM
- `db`: local SQLite schema, migrations, and repositories for the offline queue
- `components/ui`: shared UI components (NativeWind)
- `screens`: app screens (e.g. one-tap recording)
- `contexts` / `providers`: app-level React context and provider setup

## Status

Early-stage, under active development.
