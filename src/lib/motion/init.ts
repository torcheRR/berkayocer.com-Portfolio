// Sunucu bileşenlerinden de okunabilen sabitler ("use client" modülünden dışa aktarılan değerler
// sunucuda istemci referansına dönüşür, bu yüzden ayrı dosyada).
export const MOTION_STORAGE_KEY = "bo-motion";

// <html data-motion="full|reduced"> boyamadan önce ayarlanır (bkz. app/layout.tsx).
// Sistem "hareketi azalt" diyorsa her zaman reduced; değilse ziyaretçi footer'dan kapatabilir.
export const motionInitScript = `(function(){try{var d=document.documentElement,r=window.matchMedia("(prefers-reduced-motion: reduce)").matches,u=null;try{u=localStorage.getItem("${MOTION_STORAGE_KEY}")}catch(e){}d.dataset.motion=r||u==="reduced"?"reduced":"full"}catch(e){}})();`;
