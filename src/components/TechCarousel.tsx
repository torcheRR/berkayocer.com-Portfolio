"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import TechBadge from "./TechBadge";

const technologies: { label: string; url: string }[] = [
  { label: "C#", url: "https://dotnet.microsoft.com/" },
  { label: ".NET", url: "https://dotnet.microsoft.com/" },
  { label: "Java", url: "https://www.java.com/" },
  { label: "TypeScript", url: "https://www.typescriptlang.org/" },
  { label: "ReactJS", url: "https://react.dev/" },
  { label: "MySQL", url: "https://www.mysql.com/" },
  { label: "MSSQL", url: "https://www.microsoft.com/sql-server/" },
  { label: "Firebase", url: "https://firebase.google.com/" },
  { label: "Supabase", url: "https://supabase.com/" },
];

export default function TechCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const id = window.setTimeout(() => {
      const prevEl = prevRef.current;
      const nextEl = nextRef.current;
      if (!prevEl || !nextEl) return;

      if (typeof swiper.params.navigation === "boolean") {
        swiper.params.navigation = {
          enabled: true,
          prevEl,
          nextEl,
        };
      } else if (swiper.params.navigation) {
        swiper.params.navigation.prevEl = prevEl;
        swiper.params.navigation.nextEl = nextEl;
      } else {
        swiper.params.navigation = {
          enabled: true,
          prevEl,
          nextEl,
        };
      }

      if (swiper.navigation) {
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      }
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={12}
        slidesPerView="auto"
        navigation={false}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop={true}
        className="!pb-12"
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {technologies.map(({ label, url }) => (
          <SwiperSlide key={label} className="!w-auto">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer block"
            >
              <TechBadge label={label} />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center gap-2 mt-2">
        <button
          ref={prevRef}
          className="!relative !w-10 !h-10 !mt-0 hover:cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          ref={nextRef}
          className="!relative !w-10 !h-10 !mt-0 hover:cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
