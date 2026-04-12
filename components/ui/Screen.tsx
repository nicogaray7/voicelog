import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: React.ReactNode;
  className?: string;
};

export function Screen({
  children,
  className = "",
}: ScreenProps): React.ReactElement {
  return (
    <SafeAreaView
      className={`flex-1 bg-slate-50 ${className}`}
      edges={["top", "left", "right"]}
    >
      <View className="flex-1 px-6 pt-4">{children}</View>
    </SafeAreaView>
  );
}
