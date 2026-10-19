"use client";

import { useSyncExternalStore } from "react";
import { MOTION_STORAGE_KEY } from "./init";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => observer.disconnect();
}

// Sunucuda ve ilk hidrasyonda false: hareket yalnızca istemcide, karar verildikten sonra devreye girer.
export function useMotionEnabled() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.motion === "full",
    () => false,
  );
}

export function systemPrefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function storedReduced() {
  try {
    return localStorage.getItem(MOTION_STORAGE_KEY) === "reduced";
  } catch {
    return false;
  }
}

// data-motion'ı sistem ayarı ve kayıtlı tercihten yeniden hesaplar (init.ts'teki satır içi script ile aynı kural).
export function syncMotionAttribute(reduced = storedReduced()) {
  document.documentElement.dataset.motion = systemPrefersReducedMotion() || reduced ? "reduced" : "full";
}

// Tercih canlı uygulanır: useMotionEnabled özniteliği izler; hareket katmanı kapanırken kendi
// animasyonlarını geri alır, açılırken yeniden kurulur. Sayfa yenilenmez, odak ve form içeriği korunur.
export function setMotionPreference(reduced: boolean) {
  try {
    if (reduced) localStorage.setItem(MOTION_STORAGE_KEY, "reduced");
    else localStorage.removeItem(MOTION_STORAGE_KEY);
  } catch {
    // Depolama kapalıysa tercih yalnızca bu sayfa için geçerli olur.
  }
  syncMotionAttribute(reduced);
}
