import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { draftModeClient } from "@/sanity/client";
import { previewAvailable } from "@/lib/content";

// Presentation, önizleme iframe'ini bu adresle açar. Anahtar (secret) Viewer token'ıyla Sanity'de doğrulanır;
// geçersizse 401. Geçerliyse draft mode çerezi yazılır ve aynı origin'deki yola yönlendirilir.
export const dynamic = "force-dynamic";

const handler = previewAvailable && draftModeClient ? defineEnableDraftMode({ client: draftModeClient }) : null;

export function GET(request: Request) {
  if (!handler) return new Response("Önizleme yapılandırılmamış.", { status: 404 });
  return handler.GET(request);
}
