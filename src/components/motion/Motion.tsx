"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { syncMotionAttribute, useMotionEnabled } from "@/lib/motion/preference";

// GSAP + Lenis ayrı bir parçadır; hareket azaltılmışsa hiç indirilmez.
const loadRuntime = () => import("./MotionRuntime");

// Hareket açıksa parça, hidrasyonu beklemeden bu modül değerlendirilirken istenir (şelale olmaz).
if (typeof document !== "undefined" && document.documentElement.dataset.motion === "full") void loadRuntime();

const MotionRuntime = dynamic(loadRuntime, { ssr: false });

export function Motion() {
  const enabled = useMotionEnabled();

  // Sistem ayarı oturum sırasında değişirse hemen uyulur.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => syncMotionAttribute();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return enabled ? <MotionRuntime /> : null;
}
