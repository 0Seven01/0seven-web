"use client";

import { useEffect, useCallback } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export type QueuedSubmission = {
  id: string;
  type: "email_capture" | "footwear_waitlist";
  payload: Record<string, string>;
  queuedAt: string;
};

const QUEUE_KEY = "0s_offline_queue";

export function getQueue(): QueuedSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function enqueue(
  type: QueuedSubmission["type"],
  payload: Record<string, string>
): void {
  const queue = getQueue();
  queue.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    payload,
    queuedAt: new Date().toISOString(),
  });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

async function replayQueue() {
  const queue = getQueue();
  if (queue.length === 0) return;

  // In Phase 0 there's no backend — just log and clear.
  // Wire to real API endpoint in Sprint 2.
  console.info(
    `[0Seven] Replaying ${queue.length} offline submission(s):`,
    queue
  );
  clearQueue();
}

export function useOfflineQueue() {
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (isOnline) replayQueue();
  }, [isOnline]);

  const submitOrQueue = useCallback(
    async (
      type: QueuedSubmission["type"],
      payload: Record<string, string>,
      onlineHandler: () => Promise<void>
    ) => {
      if (!navigator.onLine) {
        enqueue(type, payload);
        return { queued: true };
      }
      await onlineHandler();
      return { queued: false };
    },
    []
  );

  return { submitOrQueue };
}
