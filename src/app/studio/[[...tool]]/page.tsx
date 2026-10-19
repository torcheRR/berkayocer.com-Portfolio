import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", padding: 32, maxWidth: 560, lineHeight: 1.5 }}>
        <h1 style={{ fontSize: 20 }}>Sanity Studio henüz bağlı değil</h1>
        <p>
          <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> ortam değişkeni tanımlı değil. Proje kimliğini ekleyip yeniden deploy edince
          panel bu adreste açılır.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
