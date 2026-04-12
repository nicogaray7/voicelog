# VoiceLog CRM: Product Requirements Document (v1.0)

## 1. Vision & Solution
- **Problem**: Field sales reps (4-8 visits/day) struggle with manual CRM updates, leading to poor data quality and lost follow-ups.
- **Solution**: A mobile app (iOS/Android) for oral dictation of visit reports immediately after meetings.
- **Core Value**: Saves 30 mins/day for reps and provides real-time, reliable data for managers.

## 2. Target Market
- **Niche**: B2B field sales in Tech/SaaS SMEs (50–200 employees).
- **Regions**: Europe, North America, and Australia.

## 3. Tech Stack
- **Frontend**: React Native + Expo.
- **Backend**: Supabase (PostgreSQL, Auth, Storage).
- **AI**: Whisper (via Groq for <3s speed) and Claude 3.5 Sonnet.
- **CRM Sync**: HubSpot (Priority 1) and Pipedrive (Priority 2).

## 4. Feature Backlog (Prioritized)
### Phase 1: MVP + High Priority Enhancements
- **1-Tap Recording**: Native microphone capture.
- **Asynchronous "Ghost Sync"**: Background processing for transcription and structuring; push notification on completion.
- **Pre-Meeting Briefing**: AI summary of the last 3 CRM interactions for the rep before their next visit.
- **Offline-First Queue**: SQLite/WatermelonDB storage for syncing in "dead zones".
- **CRM Integration**: Automatic push to HubSpot and Pipedrive.

### Phase 2: Post-Launch (v1.1+)
- **Salesforce/Zoho Integration**.
- **Custom CRM Mapping**: Dashboard to map AI entities to specific CRM fields.
- **CarPlay & Android Auto**: Hands-free dictation during transit.

## 5. Pricing Structure
- **Starter**: €29/seat/mo (1-10 users, 50 reports/mo).
- **Growth**: €49/seat/mo (11-50 users, Unlimited reports, Pre-Meeting Briefing).
- **Scale**: Custom Quote (50+ users, Salesforce, SSO SAML).
- **Annual Toggle**: 20% discount for yearly commitments.

## 6. Security & Risks
- **GDPR**: Explicit audio consent and no "live" listening.
- **PII Scrubbing**: AI prompt instructions to redact sensitive non-business data before CRM push.

