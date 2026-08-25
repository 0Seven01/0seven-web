"use client";

import { useOfflineQueue } from "@/hooks/useOfflineQueue";

export function OfflineQueueProvider({ children }: { children: React.ReactNode }) {
  useOfflineQueue(); // mounts the replay listener globally
  return <>{children}</>;
}
