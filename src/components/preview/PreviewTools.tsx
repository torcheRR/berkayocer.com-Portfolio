"use client";

import { useCallback, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { VisualEditing, type VisualEditingProps } from "next-sanity/visual-editing/client-component";
import { studioUrl } from "@/sanity/env";
import { changePreviewPerspective } from "./actions";

type Refresh = NonNullable<VisualEditingProps["refresh"]>;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const noopSubscribe = () => () => {};

// Düzenleme kanalı yalnızca aynı origin'deki bir denetleyiciyle kurulur: Studio'nun iframe'i (frame-ancestors 'self')
// ya da Studio'nun açtığı pencere. Başka bir sitenin açtığı pencerede VisualEditing hiç çalışmaz.
function hasSameOriginController() {
  if (window.self !== window.top) return true;
  try {
    return window.opener?.location.origin === window.location.origin;
  } catch {
    return false;
  }
}

// Yalnızca draft mode'da (site sahibi önizlemedeyken) çizilir; PreviewToolsLazy ile ayrı parçada yüklenir.
export function PreviewTools({ perspective }: { perspective: "drafts" | "published" }) {
  const router = useRouter();
  const pathname = usePathname();
  const seen = useRef(new WeakSet<object>());

  // Kilit normalde kök layout'taki previewLockScript ile, istemci kodu çalışmadan önce konur. Bu, script'in
  // hiç çalışmadığı durumlar için ikinci kalkan (layout efekti, boyamadan önce).
  useLayoutEffect(() => {
    const d = document.documentElement;
    d.dataset.preview = "";
    d.dataset.motion = "reduced";
  }, []);

  const refresh = useCallback<Refresh>(
    (payload) => {
      if (payload.source === "manual") {
        router.refresh();
        return wait(1000);
      }
      // "mutation": Presentation'da açık belge her değiştiğinde @sanity/visual-editing bu fonksiyonu bir kez hemen,
      // bir kez de son değişiklikten 1 sn sonra aynı payload ile çağırır. Yalnızca ikincisinde yenilenir:
      // yazarken istek fırtınası olmaz, yazma bitince tek yenileme.
      if (!seen.current.has(payload)) {
        seen.current.add(payload);
        return Promise.resolve();
      }
      router.refresh();
      return wait(800);
    },
    [router],
  );

  // Studio'nun iframe'i içinde şerit gösterilmez (Presentation'ın kendi araç çubuğu var).
  const framed = useSyncExternalStore(noopSubscribe, () => window.self !== window.top, () => true);
  const controller = useSyncExternalStore(noopSubscribe, hasSameOriginController, () => false);

  return (
    <>
      {controller ? (
        <VisualEditing
          basePath=""
          trailingSlash={false}
          refresh={refresh}
          onPerspectiveChange={(next) => void changePreviewPerspective(next)}
          onSuspiciousStega={process.env.NODE_ENV === "development" ? (reports) => console.warn("[önizleme] şüpheli stega", reports) : undefined}
        />
      ) : null}
      {framed ? null : (
        <div
          role="region"
          aria-label="Önizleme modu"
          className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full border border-mark bg-canvas px-4 py-2 font-mono text-xs text-ink shadow-[0_10px_30px_rgb(0_0_0/0.45)]"
        >
          <span aria-hidden="true" className="size-2 rounded-full bg-mark" />
          <span>{`Önizleme · ${perspective === "published" ? "Yayımlanmış" : "Taslaklar"}`}</span>
          <a href={`${studioUrl}/presentation?preview=${encodeURIComponent(pathname)}`} className="underline underline-offset-2 hover:text-mark">
            {"Studio'da aç"}
          </a>
          <form method="post" action="/api/draft-mode/disable">
            <input type="hidden" name="redirect" value={pathname} />
            <button type="submit" className="underline underline-offset-2 hover:text-mark">
              Önizlemeden çık
            </button>
          </form>
        </div>
      )}
    </>
  );
}
