import { renderMonogram } from "@/lib/og/monogram";

// Sekme ikonu: build sırasında bir kez üretilir. 96px, Google'ın favicon için istediği 48'in katı.
export const size = { width: 96, height: 96 };
export const contentType = "image/png";

export default function Icon() {
  return renderMonogram(size.width);
}
