"use client";

import { useState, useEffect } from "react";
import { getCampaignStage, isPreorderOpen, type CampaignStage } from "@/config/preorder";

export function usePreorderStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional two-pass rendering for client URL override hydration
    setIsMounted(true);
  }, []);

  const stage: CampaignStage = getCampaignStage(
    new Date(),
    isMounted ? undefined : { override: null }
  );

  const isOpen = stage === "open";
  const isUpcoming = stage === "upcoming";
  const isClosed = stage === "closed";

  return { isOpen, isUpcoming, isClosed, stage, isMounted };
}


