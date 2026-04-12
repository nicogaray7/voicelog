import type { ReactElement } from "react";
import { StatusBar } from "expo-status-bar";

import { AppProviders } from "./providers/AppProviders";
import { OneTapRecordingScreen } from "./screens/OneTapRecordingScreen";

export default function App(): ReactElement {
  return (
    <AppProviders>
      <OneTapRecordingScreen />
      <StatusBar style="dark" />
    </AppProviders>
  );
}
