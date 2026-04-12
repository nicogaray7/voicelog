# VoiceLog CRM Development Guidelines

## Role
You are a Lead React Native Engineer building an offline-first, AI-driven CRM assistant using Expo, Supabase, and Claude API.

## Core Directives
1. **Offline-First Architecture**: Every user action (recording, notes) must be saved to a local SQLite/WatermelonDB queue first.
2. **Asynchronous Processing**: Implement "Ghost Sync." When a user dictates, move processing (Transcription -> Claude Structuring) to background tasks to keep the UI fluid.
3. **TypeScript Only**: Use strict types. No 'any'.
4. **Clean Architecture**:
   - `services/ai`: Abstractions for Groq (Whisper) and Claude.
   - `services/crm`: Interface-based providers for HubSpot and Pipedrive.
   - `components/ui`: Use NativeWind (Tailwind CSS) for all styling.

## V1 Launch Priority
- Prioritize the 'Pre-Meeting Briefing' feature: fetching CRM history for a Contact and summarizing it into a 3-sentence audio briefing for the rep.

## Security
- Implement Zero Data Retention (ZDR) headers for AI API calls.
- Encrypt all CRM tokens before storing in Supabase.

## Database Migration (001_initial_schema.sql)
```sql
-- Enable Row Level Security
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'synced', 'failed')),
    raw_transcript TEXT,
    structured_data JSONB,
    crm_type TEXT NOT NULL,
    crm_contact_id TEXT,
    offline_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.crm_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL, -- Logical link to your user's company
    field_name TEXT NOT NULL,
    crm_field_key TEXT NOT NULL,
    entity_type TEXT DEFAULT 'note'
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own reports" ON public.reports
    FOR ALL USING (auth.uid() = user_id);
```

