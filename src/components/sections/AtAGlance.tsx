import { Row } from "@/components/ui/Frame";
import { Card, CardLabel, SectionHead } from "@/components/ui/primitives";
import type { Education, Profile, Technology } from "@/lib/content";
import type { Contributions } from "@/lib/github";
import { ClockCard } from "./ClockCard";
import { StackCard } from "./StackCard";
import { ContribCard } from "./ContribCard";

export function AtAGlance({
  profile,
  techs,
  education,
  contributions,
  projectCount,
}: {
  profile: Profile;
  techs: Technology[];
  education?: Education;
  contributions: Contributions | null;
  projectCount: number;
}) {
  const stack = techs.filter((t) => t.inStack).map(({ slug, name, color, categories }) => ({ slug, name, color, categories }));
  const years = education?.end && education.start ? education.end - education.start : null;

  return (
    <Row as="section" id="bakis" aria-labelledby="h-bakis">
      <SectionHead fig="Fig. 02" title="Bir bakışta" id="h-bakis" />
      <div className="grid grid-cols-1 gap-3 px-4 pb-6 md:grid-cols-6 sm:px-7 sm:pb-7">
        <ClockCard timeZone={profile.timeZone} className="md:col-span-2" />
        <StackCard techs={stack} className="md:col-span-4" />
        {profile.showGithubActivity && contributions ? (
          <ContribCard data={contributions} user={profile.githubUser} className="md:col-span-6" />
        ) : null}
        <Card className="md:col-span-3">
          <CardLabel>ÇALIŞMA BİÇİMİ</CardLabel>
          <p className="text-ink-2">{profile.workflow.text}</p>
          <ol className="grid grid-cols-2 gap-1.5 font-mono text-xs sm:grid-cols-4">
            {profile.workflow.steps.map((step, i) => (
              <li key={step} className="rounded-lg border border-line-2 px-2 py-2.5 text-center">
                <span className="sr-only">{i + 1}. </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
        {education ? (
          <Card className="md:col-span-3">
            <CardLabel aside={`${education.start} – ${education.end ?? "devam ediyor"}`}>EĞİTİM</CardLabel>
            <div>
              <b className="font-medium">{education.school}</b>
              <div className="text-ink-2">{education.degree}</div>
            </div>
            <ul className="grid grid-cols-3 gap-2">
              {[
                ...(years ? [{ value: years, label: "yıl lisans" }] : []),
                { value: projectCount, label: "proje" },
                { value: stack.length, label: "teknoloji" },
              ].map((s) => (
                <li key={s.label} className="grid gap-0.5">
                  <b className="font-mono text-[1.9rem] leading-none font-medium tracking-[-0.04em] tabular-nums">{s.value}</b>
                  <span className="font-mono text-xs text-ink-3">{s.label}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </Row>
  );
}
