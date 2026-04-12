import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Screen } from "../components/ui/Screen";

/**
 * 1-Tap Recording — UI shell only. Microphone + enqueue pipeline hooks in when `expo-av` / permissions land.
 */
export function OneTapRecordingScreen(): React.ReactElement {
  const [pressed, setPressed] = useState(false);

  return (
    <Screen>
      <View className="flex-1 justify-between pb-10">
        <View className="gap-2">
          <Text className="text-2xl font-semibold text-slate-900">
            New visit report
          </Text>
          <Text className="text-base leading-6 text-slate-600">
            Tap once after your meeting. Your note is saved on-device first, then
            processed in the background (Ghost Sync).
          </Text>
        </View>

        <View className="items-center gap-6">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start recording visit report"
            accessibilityHint="Recording will begin when microphone capture is enabled"
            onPressIn={() => {
              setPressed(true);
            }}
            onPressOut={() => {
              setPressed(false);
            }}
            className={`h-40 w-40 items-center justify-center rounded-full border-4 border-white shadow-lg ${
              pressed ? "bg-rose-700" : "bg-rose-600"
            }`}
            style={{
              shadowColor: "#0f172a",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.2,
              shadowRadius: 24,
              elevation: 12,
            }}
          >
            <Text className="text-center text-lg font-semibold text-white">
              Tap to{"\n"}record
            </Text>
          </Pressable>

          <Text className="text-center text-sm text-slate-500">
            Offline-first: audio and transcripts are queued in SQLite before any
            cloud sync.
          </Text>
        </View>

        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Next up
          </Text>
          <Text className="mt-1 text-sm text-slate-600">
            Microphone capture, waveform, and automatic enqueue into the local
            reports table.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
