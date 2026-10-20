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

// Önizlemede (Presentation iframe'i ya da draft mode) hareket kilitlidir: düzenleme katmanları sabit bir DOM ister.
// Kilit, sayfa boyanmadan önce <html data-preview> ile konur (bkz. init.ts).
export const isMotionLocked = () => document.documentElement.hasAttribute("data-preview");

// Sistem ayarı ya da önizleme kilidi hareketi kapatıyorsa ziyaretçi tercihi devre dışıdır (anahtar gizlenir).
export function systemPrefersReducedMotion() {
  return isMotionLocked() || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  // Önizleme kilidindeyken tercih yazılmaz: localStorage normal sekmelerle ortak.
  if (isMotionLocked()) return;
  try {
    if (reduced) localStorage.setItem(MOTION_STORAGE_KEY, "reduced");
    else localStorage.removeItem(MOTION_STORAGE_KEY);
  } catch {
    // Depolama kapalıysa tercih yalnızca bu sayfa için geçerli olur.
  }
  syncMotionAttribute(reduced);
}
