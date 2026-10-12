"use client";

import { useState, useEffect } from "react";
import { isPreorderOpen } from "@/config/preorder";

export function usePreorderStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional two-pass rendering for client URL override hydration
    setIsMounted(true);
  }, []);

  const isOpen = isPreorderOpen(
    new Date(),
    isMounted ? undefined : { override: null }
  );

  return { isOpen, isMounted };
}

