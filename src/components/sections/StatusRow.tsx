import type { ReactNode } from "react";
import { Row } from "@/components/ui/Frame";
import { StatusSquare } from "@/components/ui/primitives";
import { CopyEmail } from "@/components/ui/CopyEmail";
import type { Profile } from "@/lib/content";
import { cn } from "@/lib/cn";

// Kenarlıklar hücre sayısından bağımsız hesaplanır: mobilde 2, md'de 4 sütun.
const cellBorders = (i: number) =>
  cn(
    i % 2 === 1 ? "border-l" : "border-l-0",
    i >= 2 && "border-t",
    i % 4 !== 0 ? "md:border-l" : "md:border-l-0",
    i >= 4 ? "md:border-t" : "md:border-t-0",
  );

export function StatusRow({ profile }: { profile: Profile }) {
  const cells: { key: string; label: string; tone: Parameters<typeof StatusSquare>[0]["tone"]; body: ReactNode }[] = [
    ...profile.status.map((s) => ({
      key: s.label,
      label: s.label,
      tone: s.tone,
      body: (
        <>
          <b className="text-[14.5px] font-medium">{s.title}</b>
          <span className="text-[13px] text-ink-2">{s.detail}</span>
        </>
      ),
    })),
    {
      key: "iletisim",
      label: "İLETİŞİM",
      tone: "muted",
      body: (
        <div>
          <CopyEmail email={profile.email} />
        </div>
      ),
    },
  ];

  return (
    <Row as="section" aria-label="Durum" className="grid grid-cols-2 md:grid-cols-4">
      {cells.map((c, i) => (
        <div key={c.key} className={cn("grid min-w-0 content-start gap-1.5 border-line px-[18px] pt-4 pb-[18px]", cellBorders(i))}>
          <span className="flex items-center gap-2 font-mono text-xs text-ink-3">
            <StatusSquare tone={c.tone} />
            {c.label}
          </span>
          {c.body}
        </div>
      ))}
    </Row>
  );
}
