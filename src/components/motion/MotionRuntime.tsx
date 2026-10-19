"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Bileşenler hareketi data-* öznitelikleriyle bildirir; sahne her rota için burada kurulur.
// Böylece sunucu bileşenleri GSAP'ı hiç bilmez ve hareket katmanı ayrı bir parça olarak yüklenir.
//
//   data-hero-name / data-hero-tagline / data-hero-facts / data-hero-status  açılış zaman çizelgesi
//   data-hero-hide     açılışa kadar CSS'in gizlediği öğeler (yalnızca isim ve bloklar)
//   data-iso + data-block[data-cx,data-cy]                                   imleçle yükselen bloklar
//   data-reveal        ekrana girince yukarı kayarak belirir
//   data-rule          bölüm çizgisi soldan çizilir
//   .marker            sarı kalem çizgisi çizilir
//   data-count         sayı 0'dan sayar
//   data-contrib       katkı takvimi hücreleri sırayla belirir
//   data-log / data-log-line / data-log-dot   deneyim çizgisi scroll ile dolar
//   data-magnetic      imleç yaklaşınca buton ona doğru çekilir
//   data-spotlight     kartta imleci izleyen ışık (CSS + --mx/--my)

/** Açılışa kadar CSS'in 8px aşağıda beklettiği (gizlemediği) hero öğeleri; globals.css ile aynı liste. */
const HERO_RISE = "[data-hero-tagline], [data-hero-facts] > *, [data-hero-status] > :not([aria-hidden])";

let lenis: Lenis | null = null;

const toArray = <T extends Element>(selector: string, scope: ParentNode = document) => Array.from(scope.querySelectorAll<T>(selector));

/** Tarayıcı boşa çıkınca çalıştırır; iptal fonksiyonu döner. */
function whenIdle(fn: () => void) {
  // Safari'de requestIdleCallback yok.
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fn, { timeout: 300 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 1);
  return () => clearTimeout(id);
}

function setupScene(ctx: gsap.Context) {
  const cleanups: Array<() => void> = [];
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Ölçüm: bütün okumalar tek geçişte, hiçbir yazmadan önce ---------- */
  const vh = window.innerHeight;
  const name = document.querySelector<HTMLElement>("[data-hero-name]");
  // CSS hero'yu hâlâ bekletiyorsa (fareli cihaz, ilk 0.8 sn) açılış oynar. Değilse içerik zaten
  // görünür durumdadır (mobil, parça geç geldi ya da hareket sonradan açıldı); tekrar canlandırılmaz.
  const gated = !!name && getComputedStyle(name).visibility === "hidden";
  // Yalnızca henüz görülmemiş (ekranın altındaki) öğeler gizlenip animasyonla gelir; görünenler yerinde kalır.
  const belowFold = (selector: string, keep: (el: HTMLElement) => boolean = () => true) =>
    toArray<HTMLElement>(selector).filter((el) => keep(el) && el.getBoundingClientRect().top > vh * 0.9);
  const reveal = belowFold("[data-reveal]");
  const rules = belowFold("[data-rule]");
  const markers = belowFold(".marker", (m) => !m.closest("[data-hero-tagline]"));
  const counts = belowFold("[data-count]")
    .map((el) => ({ el, target: Number(el.textContent), done: false }))
    .filter((c) => c.el.textContent !== "" && Number.isFinite(c.target));
  const grids = belowFold("[data-contrib]").map((grid) => Array.from(grid.children) as HTMLElement[]);
  const logs = toArray<HTMLElement>("[data-log]");
  const dots = logs.flatMap((log) => toArray<HTMLElement>("[data-log-dot]", log));

  /* ---------- Açılış ---------- */
  if (gated && name) {
    const split = SplitText.create(name, { type: "chars", mask: "chars", aria: "auto" });
    // CSS kapısı kalkar ve GSAP başlangıç değerlerini aynı karede yazar: görünür sıçrama olmaz.
    for (const el of toArray<HTMLElement>(`[data-hero-hide], ${HERO_RISE}, [data-hero-tagline] .marker`)) {
      el.style.visibility = "visible";
      el.style.translate = "none";
      el.style.animation = "none";
    }
    gsap
      .timeline({ defaults: { ease: "expo.out" }, onComplete: () => split.revert() })
      .from(split.chars, { yPercent: 110, duration: 0.9, stagger: 0.035 })
      .from(HERO_RISE, { y: 8, duration: 0.7, stagger: 0.05 }, 0.2)
      .fromTo("[data-hero-tagline] .marker", { "--marker": 0 }, { "--marker": 1, duration: 0.7, ease: "power3.inOut" }, 0.55)
      .from("[data-iso] [data-block]", { y: 26, autoAlpha: 0, duration: 0.7, stagger: { each: 0.02, from: "center" } }, 0);
  }

  /* ---------- Başlangıç durumları (yazma) ---------- */
  // Yalnızca opaklık: öğeler Tab sırasında ve erişilebilirlik ağacında kalır.
  if (reveal.length) gsap.set(reveal, { opacity: 0, y: 24 });
  if (rules.length) gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
  if (markers.length) gsap.set(markers, { "--marker": 0 });
  for (const c of counts) c.el.textContent = "0";
  for (const cells of grids) gsap.set(cells, { opacity: 0 });
  const dotStates = dots.map((dot) => dot.dataset.on);
  for (const dot of dots) dot.dataset.on = "false";

  const finishCount = (c: (typeof counts)[number]) => {
    c.done = true;
    c.el.textContent = String(c.target);
  };
  // Sahne geri alınınca (rota ya da hareket tercihi değişti) metin ve noktalar ilk haline döner.
  cleanups.push(() => {
    counts.forEach((c) => !c.done && finishCount(c));
    dots.forEach((dot, i) => (dot.dataset.on = dotStates[i]));
  });

  // Klavyeyle henüz belirmemiş bir karta gelinirse beklemeden gösterilir.
  if (reveal.length) {
    const onFocus = (e: FocusEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>("[data-reveal]");
      if (card && reveal.includes(card)) gsap.to(card, { opacity: 1, y: 0, duration: 0.2, overwrite: true });
    };
    document.addEventListener("focusin", onFocus);
    cleanups.push(() => document.removeEventListener("focusin", onFocus));
  }

  // Kaydırılmadan yazdırılırsa sayılar son değerleriyle basılır (görünürlük print CSS'inde).
  const onPrint = () => counts.forEach((c) => !c.done && finishCount(c));
  window.addEventListener("beforeprint", onPrint);
  cleanups.push(() => window.removeEventListener("beforeprint", onPrint));

  /* ---------- Tetikleyiciler: açılış karesini uzatmamak için boşta kurulur ---------- */
  cleanups.push(
    whenIdle(() =>
      ctx.add(() => {
        if (reveal.length) {
          ScrollTrigger.batch(reveal, {
            start: "top 92%",
            once: true,
            onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.07, overwrite: true }),
          });
        }

        for (const rule of rules) {
          ScrollTrigger.create({ trigger: rule, start: "top 92%", once: true, onEnter: () => gsap.to(rule, { scaleX: 1, duration: 1, ease: "expo.out" }) });
        }

        for (const marker of markers) {
          ScrollTrigger.create({
            trigger: marker,
            start: "top 85%",
            once: true,
            onEnter: () => gsap.to(marker, { "--marker": 1, duration: 0.9, ease: "power3.inOut" }),
          });
        }

        for (const c of counts) {
          ScrollTrigger.create({
            trigger: c.el,
            start: "top 92%",
            once: true,
            onEnter: () => {
              if (c.done) return;
              const counter = { value: 0 };
              gsap.to(counter, {
                value: c.target,
                duration: 1.2,
                ease: "power2.out",
                onUpdate: () => (c.el.textContent = String(Math.round(counter.value))),
                onComplete: () => finishCount(c),
              });
            },
          });
        }

        for (const cells of grids) {
          ScrollTrigger.create({
            trigger: cells[0]?.parentElement,
            start: "top 92%",
            once: true,
            onEnter: () => gsap.to(cells, { opacity: 1, duration: 0.4, stagger: { each: 0.0018, from: "start" } }),
          });
        }

        /* Deneyim çizgisi */
        for (const log of logs) {
          const line = log.querySelector<HTMLElement>("[data-log-line]");
          if (line) {
            gsap.fromTo(
              line,
              { scaleY: 0, transformOrigin: "top center" },
              { scaleY: 1, ease: "none", scrollTrigger: { trigger: log, start: "top 70%", end: "bottom 65%", scrub: 0.6 } },
            );
          }
        }
        for (const dot of dots) {
          ScrollTrigger.create({
            trigger: dot,
            start: "top 68%",
            onEnter: () => (dot.dataset.on = "true"),
            onLeaveBack: () => (dot.dataset.on = "false"),
          });
        }
      }),
    ),
  );

  /* ---------- İmleçle yükselen izometrik bloklar ---------- */
  const iso = document.querySelector<SVGSVGElement>("svg[data-iso]");
  if (iso && fine) {
    const area = (iso.parentElement ?? iso) as HTMLElement;
    const blocks = toArray<SVGGElement>("[data-block]", iso).map((g) => ({
      cx: Number(g.dataset.cx),
      cy: Number(g.dataset.cy),
      lift: gsap.quickTo(g, "y", { duration: 0.45, ease: "power3.out" }),
      last: 0,
    }));
    const pt = iso.createSVGPoint();
    let frame = 0;
    const setLift = (b: (typeof blocks)[number], to: number) => {
      if (to === b.last) return;
      b.last = to;
      b.lift(to);
    };
    // Hesap kare başına bir kez yapılır; yalnızca hedefi değişen bloğun tween'i güncellenir.
    const update = () => {
      frame = 0;
      const ctm = iso.getScreenCTM();
      if (!ctm) return;
      const p = pt.matrixTransform(ctm.inverse());
      for (const b of blocks) {
        const d = Math.hypot(b.cx - p.x, b.cy - p.y);
        setLift(b, d < 95 ? Math.round(-(1 - d / 95) * 180) / 10 : 0);
      }
    };
    const onMove = (e: PointerEvent) => {
      pt.x = e.clientX;
      pt.y = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      blocks.forEach((b) => setLift(b, 0));
    };
    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      cancelAnimationFrame(frame);
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    });
  }

  /* ---------- Fareli cihaz etkileşimleri ---------- */
  if (fine) {
    for (const btn of toArray<HTMLElement>("[data-magnetic]")) {
      const zone = btn.parentElement ?? btn;
      const x = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      const y = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const near = Math.hypot(dx, dy) < 180;
        x(near ? dx * 0.3 : 0);
        y(near ? dy * 0.3 : 0);
      };
      const onLeave = () => {
        x(0);
        y(0);
      };
      zone.addEventListener("pointermove", onMove);
      zone.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        zone.removeEventListener("pointermove", onMove);
        zone.removeEventListener("pointerleave", onLeave);
      });
    }

    const onSpot = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onSpot, { passive: true });
    cleanups.push(() => document.removeEventListener("pointermove", onSpot));
  }

  return () => cleanups.forEach((fn) => fn());
}

export default function MotionRuntime() {
  const pathname = usePathname();

  // Lenis ve GSAP tek zaman kaynağını paylaşır (uygulama ömrü boyunca bir kez).
  useEffect(() => {
    const instance = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      // Aynı sayfadaki #bolum linkleri yumuşak kayar; menü payını hedefin scroll-margin-top'u (5rem) verir.
      // Varsayılan davranış engellenmez: atlama linki odağı hedefe taşımaya devam eder.
      anchors: true,
      // Başka sayfaya giden link tıklanınca süren kaydırma kesilir; Next'in yeni sayfayı en üste almasıyla yarışmaz.
      stopInertiaOnNavigate: true,
    });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);

  // Linksiz gezinmelerde de (komut paleti) yeni rota çizildiği anda süren kaydırma durur
  // (stop + start, Lenis'in iç reset'ini çağırır).
  useLayoutEffect(() => {
    lenis?.stop();
    lenis?.start();
  }, [pathname]);

  // Her rota için sahne: önceki rotanın tween'leri ve ScrollTrigger'ları geri alınır.
  useEffect(() => {
    let ctx: gsap.Context | null = null;
    const frame = requestAnimationFrame(() => {
      lenis?.resize();
      ctx = gsap.context((self) => setupScene(self));
    });
    return () => {
      cancelAnimationFrame(frame);
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
