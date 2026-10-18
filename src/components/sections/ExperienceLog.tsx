import { Row } from "@/components/ui/Frame";
import { SectionHead, Tags } from "@/components/ui/primitives";
import { experienceTypeLabel, formatPeriod } from "@/lib/content/labels";
import type { Education, Experience } from "@/lib/content";

type Entry = { key: string; period: string; title: string; summary: string; tags: string[] };

export function ExperienceLog({ experience, education }: { experience: Experience[]; education: Education[] }) {
  const entries: Entry[] = [
    ...experience.map((e) => ({
      key: e.id,
      period: formatPeriod(e.start, e.end),
      title: `${e.company} · ${e.role}`,
      summary: e.summary,
      tags: [...e.tags, e.location.split(",")[0], experienceTypeLabel[e.type]],
    })),
    ...education.map((ed) => ({
      key: `edu-${ed.school}`,
      period: `${ed.start} – ${ed.end ?? "şimdi"}`,
      title: `${ed.school} · ${ed.degree}`,
      summary: ed.note ?? "",
      tags: [],
    })),
  ];

  return (
    <Row as="section" id="deneyim" aria-labelledby="h-deneyim">
      <SectionHead fig="Fig. 05" title="Deneyim" count="(log)" id="h-deneyim" />
      <ol className="relative px-4 pb-6 sm:px-7 sm:pb-7">
        <span aria-hidden="true" className="absolute top-1.5 bottom-9 left-[27px] w-px bg-mark/70 sm:left-[39px]" />
        {entries.map((e, i) => (
          <li
            key={e.key}
            className="relative grid grid-cols-[24px_1fr] gap-x-3 gap-y-1.5 border-b border-line py-3.5 last:border-b-0 sm:grid-cols-[24px_150px_1fr] sm:gap-4"
          >
            <span
              aria-hidden="true"
              className={
                "relative z-[1] mt-1.5 ml-[7px] size-[9px] rounded-full border " +
                (i === 0 ? "border-mark bg-mark" : "border-ink-3 bg-canvas")
              }
            />
            <span className="font-mono text-xs text-ink-3 max-sm:col-start-2">{e.period}</span>
            <div className="max-sm:col-start-2">
              <h3 className="text-[15px] font-medium">{e.title}</h3>
              {e.summary ? <p className="mt-1 max-w-[60ch] text-[13.5px] text-ink-2">{e.summary}</p> : null}
              {e.tags.length ? (
                <div className="mt-2">
                  <Tags items={e.tags} />
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Row>
  );
}
