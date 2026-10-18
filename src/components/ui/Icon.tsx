import type { SVGProps } from "react";

const paths = {
  briefcase: (
    <>
      <rect x="2" y="4" width="12" height="9" rx="2" />
      <path d="M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" />
    </>
  ),
  pin: (
    <>
      <path d="M8 14s4.5-4 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 10 8 14 8 14Z" />
      <circle cx="8" cy="6.5" r="1.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4.5V8l2.5 1.5" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="m2.5 4.5 5.5 4 5.5-4" />
    </>
  ),
  cap: (
    <>
      <path d="M1.5 6 8 3l6.5 3L8 9 1.5 6Z" />
      <path d="M4 7.3v3.2c0 .8 1.8 2 4 2s4-1.2 4-2V7.3" />
    </>
  ),
  arrowUpRight: <path d="M5 11 11 5M6 5h5v5" />,
} as const;

const brands = {
  github: (
    <path d="M8 1.5a6.5 6.5 0 0 0-2.06 12.67c.33.06.45-.14.45-.31v-1.1c-1.8.39-2.19-.87-2.19-.87-.3-.75-.72-.95-.72-.95-.59-.4.04-.4.04-.4.65.05 1 .67 1 .67.58 1 1.52.71 1.89.54.06-.42.23-.71.41-.87-1.44-.16-2.95-.72-2.95-3.2 0-.71.25-1.29.67-1.74-.07-.17-.29-.82.06-1.71 0 0 .55-.18 1.79.66a6.2 6.2 0 0 1 3.26 0c1.24-.84 1.79-.66 1.79-.66.35.89.13 1.54.06 1.71.42.45.67 1.03.67 1.74 0 2.49-1.51 3.04-2.96 3.2.24.2.44.6.44 1.21v1.79c0 .17.12.38.45.31A6.5 6.5 0 0 0 8 1.5Z" />
  ),
  linkedin: (
    <path d="M3.6 5.9h2v6.6h-2V5.9Zm1-3.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Zm2.3 3.2h1.9v.9c.27-.5.93-1.05 1.9-1.05 2.03 0 2.4 1.33 2.4 3.07v3.68h-2V9.24c0-.78-.01-1.78-1.08-1.78-1.09 0-1.25.85-1.25 1.72v3.32h-2V5.9Z" />
  ),
  x: <path d="M9.47 7.03 13.73 2h-1.01L9.03 6.37 6.08 2H2.68l4.46 6.5L2.68 14h1.01l3.9-4.53L10.7 14h3.4L9.47 7.03Zm-1.38 1.6-.45-.65-3.6-5.2h1.55l2.9 4.17.45.65 3.77 5.43h-1.55L8.09 8.63Z" />,
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="11" height="11" rx="3.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.4" cy="4.6" r=".8" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths | keyof typeof brands;

type Props = SVGProps<SVGSVGElement> & { name: IconName; title?: string };

// Küçük, satır içi ikon seti. Varsayılan olarak dekoratif (aria-hidden); anlam taşıyorsa title ver.
export function Icon({ name, title, ...rest }: Props) {
  const isBrand = name in brands;
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill={isBrand ? "currentColor" : "none"}
      stroke={isBrand ? undefined : "currentColor"}
      strokeWidth={isBrand ? undefined : 1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {isBrand ? brands[name as keyof typeof brands] : paths[name as keyof typeof paths]}
    </svg>
  );
}
