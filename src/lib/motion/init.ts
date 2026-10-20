// Sunucu bileşenlerinden de okunabilen sabitler ("use client" modülünden dışa aktarılan değerler
// sunucuda istemci referansına dönüşür, bu yüzden ayrı dosyada).
export const MOTION_STORAGE_KEY = "bo-motion";

// <html data-motion="full|reduced"> boyamadan önce ayarlanır (bkz. app/layout.tsx).
// Sistem "hareketi azalt" diyorsa her zaman reduced; değilse ziyaretçi footer'dan kapatabilir.
// Sayfa bir iframe içindeyse (yalnızca aynı origin'deki Studio'nun Önizleme aracı çerçeveleyebilir: frame-ancestors 'self')
// data-preview eklenir ve hareket kilitlenir: düzenleme katmanları sabit bir DOM ister.
export const motionInitScript = `(function(){try{var d=document.documentElement,p=true;try{p=window.self!==window.top}catch(e){}if(p)d.dataset.preview="";var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches,u=null;try{u=localStorage.getItem("${MOTION_STORAGE_KEY}")}catch(e){}d.dataset.motion=p||r||u==="reduced"?"reduced":"full"}catch(e){}})();`;

// Draft mode açıkken (önizleme) normal sekmede de aynı kilit, kök layout'un <head>'inde istemci kodundan önce uygulanır.
export const previewLockScript = `(function(){var d=document.documentElement;d.dataset.preview="";d.dataset.motion="reduced"})();`;
