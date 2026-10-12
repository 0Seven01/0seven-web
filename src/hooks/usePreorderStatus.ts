"use client";

import { useSyncExternalStore } from "react";
import { isPreorderOpen } from "@/config/preorder";

const emptySubscribe = () => () => {};

function getClientSnapshot(): boolean {
  return isPreorderOpen(new Date());
}

function getServerSnapshot(): boolean {
  return isPreorderOpen(new Date(), { override: null });
}

export function usePreorderStatus() {
  const isOpen = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  return { isOpen };
}
