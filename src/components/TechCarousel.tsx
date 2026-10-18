"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import TechBadge from "./TechBadge";

const technologies: { label: string; url: string }[] = [
  { label: "C#", url: "https://dotnet.microsoft.com/languages/csharp" },
  { label: ".NET", url: "https://dotnet.microsoft.com/" },
  { label: "Java", url: "https://www.java.com/" },
  { label: "TypeScript", url: "https://www.typescriptlang.org/" },
  { label: "JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { label: "React.js", url: "https://react.dev/" },
  { label: "React Native", url: "https://reactnative.dev/" },
  { label: "Next.js", url: "https://nextjs.org/" },
  { label: "TailwindCSS", url: "https://tailwindcss.com/" },
  { label: "CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { label: "MySQL", url: "https://www.mysql.com/" },
  { label: "MSSQL", url: "https://www.microsoft.com/sql-server/" },
  { label: "SQL", url: "https://www.microsoft.com/en-us/sql-server" },
  { label: "Firebase", url: "https://firebase.google.com/" },
  { label: "Supabase", url: "https://supabase.com/" },
];

const arrowClass = "!relative !w-10 !h-10 !mt-0 grid place-items-center rounded-lg hover:cursor-pointer hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-yellow-400";

export default function TechCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const id = window.setTimeout(() => {
      const prevEl = prevRef.current;
      const nextEl = nextRef.current;
      if (!prevEl || !nextEl) return;

      if (typeof swiper.params.navigation === "boolean" || !swiper.params.navigation) {
        swiper.params.navigation = { enabled: true, prevEl, nextEl };
      } else {
        swiper.params.navigation.prevEl = prevEl;
        swiper.params.navigation.nextEl = nextEl;
      }

      if (swiper.navigation) {
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      }
    }, 0);

    // Hareketi azaltmayı tercih eden ziyaretçide otomatik kaydırma başlamaz (WCAG 2.2.2).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      swiper.autoplay?.stop();
      setPaused(true);
    }

    return () => window.clearTimeout(id);
  }, []);

  const togglePause = () => {
    const autoplay = swiperRef.current?.autoplay;
    if (!autoplay) return;
    if (paused) autoplay.start();
    else autoplay.stop();
    setPaused(!paused);
  };

  return (
    <div className="w-full" role="region" aria-roledescription="carousel" aria-label="Kullandığım teknolojiler">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={12}
        slidesPerView="auto"
        navigation={false}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop={true}
        className="!pb-12"
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {technologies.map(({ label, url }) => (
          <SwiperSlide key={label} className="!w-auto">
            <a href={url} target="_blank" rel="noopener noreferrer" className="cursor-pointer block">
              <TechBadge label={label} />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center gap-2 mt-2">
        <button ref={prevRef} type="button" aria-label="Önceki teknoloji" className={arrowClass}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={paused}
          aria-label={paused ? "Otomatik kaydırmayı başlat" : "Otomatik kaydırmayı durdur"}
          className={arrowClass}
        >
          {paused ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
            </svg>
          )}
        </button>
        <button ref={nextRef} type="button" aria-label="Sonraki teknoloji" className={arrowClass}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
