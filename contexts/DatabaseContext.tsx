import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { getDatabase, SqlReportRepository, type ReportRepository } from "../db";

const ReportRepositoryContext = createContext<ReportRepository | null>(null);

export function useReportRepository(): ReportRepository {
  const ctx = useContext(ReportRepositoryContext);
  if (ctx === null) {
    throw new Error(
      "useReportRepository must be used within DatabaseProvider",
    );
  }
  return ctx;
}

export function DatabaseProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [repository, setRepository] = useState<ReportRepository | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        await getDatabase();
        if (!active) {
          return;
        }
        setRepository(new SqlReportRepository(getDatabase));
      } catch (e) {
        if (!active) {
          return;
        }
        setError(
          e instanceof Error ? e : new Error("Database initialization failed"),
        );
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => repository, [repository]);

  if (error !== null) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-center text-base text-red-600">{error.message}</Text>
      </View>
    );
  }

  if (value === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" accessibilityLabel="Loading database" />
      </View>
    );
  }

  return (
    <ReportRepositoryContext.Provider value={value}>
      {children}
    </ReportRepositoryContext.Provider>
  );
}
