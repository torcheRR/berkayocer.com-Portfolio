import { Card, CardLabel } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import type { Contributions } from "@/lib/github";

const levelColor = ["#15171b", "#3a3315", "#6b5a14", "#a8870f", "var(--color-mark)"];
// Dar ekranda yatay kaydırma yerine yalnızca son haftalar gösterilir (en güncel veri her zaman görünür).
const WEEKS_MOBILE = 22;
const WEEKS_TABLET = 40;

export function ContribCard({ data, user, className }: { data: Contributions; user: string; className?: string }) {
  // GitHub takvimi haftalara (sütun) ve haftanın günlerine (satır, Pazar başta) göre dizilir.
  const firstWeekday = new Date(`${data.days[0].date}T00:00:00Z`).getUTCDay();
  const cells: Array<(typeof data.days)[number] | null> = [...Array(firstWeekday).fill(null), ...data.days];
  // Baştan tam haftalar gizlendiği için satır (gün) hizası bozulmaz.
  const weeks = Math.ceil(cells.length / 7);
  const hideBelowSm = Math.max(0, (weeks - WEEKS_MOBILE) * 7);
  const hideBelowMd = Math.max(0, (weeks - WEEKS_TABLET) * 7);
  const active = data.days.filter((d) => d.level > 0).length;

  return (
    <Card className={className}>
      <CardLabel aside={<a href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer" className="hover:text-ink">github.com/{user}</a>}>
        Fig. 03 · GitHub katkıları
      </CardLabel>
      <div
        role="img"
        aria-label={`Son bir yılın GitHub katkı takvimi: ${data.total ?? "bilinmeyen sayıda"} katkı, ${active} aktif gün`}
        className="grid grid-flow-col grid-rows-7 justify-start gap-[3px]"
      >
        {cells.map((d, i) => (
          <span
            key={d?.date ?? `pad-${i}`}
            title={d ? d.date : undefined}
            className={cn("size-2.5 rounded-[2px]", i < hideBelowSm && "max-sm:hidden", i < hideBelowMd && "sm:max-md:hidden")}
            style={{ background: d ? levelColor[d.level] : "transparent" }}
          />
        ))}
      </div>
      <div className="flex flex-wrap justify-between gap-2.5 font-mono text-xs text-ink-3">
        <span>{data.total !== null ? `${data.total} katkı, son 12 ay` : `${active} aktif gün, son 12 ay`}</span>
        <span aria-hidden="true" className="flex items-center gap-1">
          Az
          {levelColor.map((c) => (
            <span key={c} className="inline-block size-2.5 rounded-[2px]" style={{ background: c }} />
          ))}
          Çok
        </span>
      </div>
    </Card>
  );
}
