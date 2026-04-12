import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DatabaseProvider } from "../contexts/DatabaseContext";

export function AppProviders({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>{children}</DatabaseProvider>
    </SafeAreaProvider>
  );
}
