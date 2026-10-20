import { renderMonogram } from "@/lib/og/monogram";

// iOS ana ekran ikonu (köşeleri sistem yuvarlatır).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderMonogram(size.width, { backdrop: true });
}
