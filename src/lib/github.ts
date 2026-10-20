import "server-only";

export type ContributionDay = { date: string; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number | null; days: ContributionDay[] };

// GitHub'ın herkese açık katkı takvimini okur (token gerekmez). Günde bir yenilenir.
// Biçim değişir ya da istek başarısız olursa null döner ve kart gizlenir.
async function fetchContributions(user: string): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github.com/users/${encodeURIComponent(user)}/contributions`, {
      headers: { "User-Agent": "berkayocer.com" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();

    const days: ContributionDay[] = [];
    for (const tag of html.match(/<td[^>]*ContributionCalendar-day[^>]*>/g) ?? []) {
      const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
      const level = tag.match(/data-level="([0-4])"/)?.[1];
      if (date && level) days.push({ date, level: Number(level) as ContributionDay["level"] });
    }
    if (days.length < 300) return null;
    days.sort((a, b) => a.date.localeCompare(b.date));

    const totalText = html.match(/([\d.,]+)\s+contributions?\s+in\s+the\s+last\s+year/)?.[1];
    const total = totalText ? Number(totalText.replace(/[.,]/g, "")) : null;
    return { total: Number.isFinite(total) ? total : null, days };
  } catch {
    return null;
  }
}

// Draft mode fetch önbelleğini (revalidate: 86400) atlar. Önizlemedeki her yenileme GitHub'ı yeniden indirmesin diye
// sonuç sunucu örneğinde kısa süre tutulur.
const PREVIEW_TTL_MS = 15 * 60 * 1000;
const previewMemo = new Map<string, { at: number; value: Promise<Contributions | null> }>();

export function getContributions(user: string, { preview = false }: { preview?: boolean } = {}): Promise<Contributions | null> {
  if (!preview) return fetchContributions(user);
  const hit = previewMemo.get(user);
  if (hit && Date.now() - hit.at < PREVIEW_TTL_MS) return hit.value;
  const value = fetchContributions(user);
  previewMemo.set(user, { at: Date.now(), value });
  return value;
}
