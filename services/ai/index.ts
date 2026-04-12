/**
 * AI layer (Groq Whisper + Claude structuring). Interfaces and adapters live here; no providers wired in V1 foundation.
 */

export type TranscriptionJobId = string;

export interface TranscriptionPort {
  enqueueTranscription(localAudioUri: string): Promise<TranscriptionJobId>;
}
