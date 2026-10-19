import { Row } from "@/components/ui/Frame";
import { PrintButton } from "@/components/ui/PrintButton";
import { getEducation, getExperience, getFeaturedProjects, getProfile, getTechnologies } from "@/lib/content";
import { categoryLabel, formatPeriod, kindLabel, techCategoryOrder } from "@/lib/content/labels";
import type { TechCategory } from "@/lib/content";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Özgeçmiş",
  description: "Berkay Öcer'in özgeçmişi: deneyim, eğitim, yetenekler ve öne çıkan projeler. Yazdırılabilir.",
  path: "/ozgecmisim",
});

const heading = "font-mono text-xs tracking-[0.08em] text-ink-3 uppercase print:text-neutral-500";

export default async function ResumePage() {
  const [profile, experience, education, techs, projects] = await Promise.all([
    getProfile(),
    getExperience(),
    getEducation(),
    getTechnologies(),
    getFeaturedProjects(),
  ]);

  // Her teknoloji, seçili kategorilerinden sıralamada en önde olanın altında bir kez listelenir
  // (Studio kategorileri kendi sırasıyla sakladığı için categories[0]'a güvenilmez).
  const primary = (cats: TechCategory[]) => techCategoryOrder.find((c) => cats.includes(c));
  const groups = techCategoryOrder
    .map((c) => ({ category: c, items: techs.filter((t) => t.inStack && primary(t.categories) === c).map((t) => t.name) }))
    .filter((g) => g.items.length);

  return (
    <Row as="article" aria-labelledby="cv-name" className="grid gap-8 px-4 py-8 sm:px-7 sm:py-10 print:gap-5 print:p-0 print:text-black">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="cv-name" className="font-mono text-[clamp(1.8rem,4.6vw,2.6rem)] leading-none font-medium tracking-[-0.045em]">
            {profile.name}
          </h1>
          <p className="mt-2 text-ink-2 print:text-neutral-700">
            {profile.role} · {profile.location}
          </p>
          <p className="mt-1 font-mono text-xs text-ink-3 print:text-neutral-600">
            {profile.email} · {profile.socials.map((s) => s.url.replace("https://", "").replace("www.", "")).join(" · ")}
          </p>
        </div>
        <PrintButton />
      </header>

      <section aria-labelledby="cv-ozet" className="grid gap-2">
        <h2 id="cv-ozet" className={heading}>
          Özet
        </h2>
        <p className="max-w-[70ch] text-ink-2 print:text-neutral-800">{profile.bio}</p>
      </section>

      <section aria-labelledby="cv-deneyim" className="grid gap-3">
        <h2 id="cv-deneyim" className={heading}>
          Deneyim
        </h2>
        <ol className="grid gap-4">
          {experience.map((e) => (
            <li key={e.id} className="grid gap-1 sm:grid-cols-[150px_1fr] sm:gap-4 print:break-inside-avoid">
              <span className="font-mono text-xs text-ink-3 print:text-neutral-600">{formatPeriod(e.start, e.end)}</span>
              <div>
                <h3 className="font-medium">
                  {e.company} · {e.role}
                </h3>
                <p className="text-sm text-ink-3 print:text-neutral-600">{e.location}</p>
                <p className="mt-1 max-w-[70ch] text-sm text-ink-2 print:text-neutral-800">{e.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="cv-egitim" className="grid gap-3">
        <h2 id="cv-egitim" className={heading}>
          Eğitim
        </h2>
        {education.map((ed) => (
          <div key={ed.school} className="grid gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
            <span className="font-mono text-xs text-ink-3 print:text-neutral-600">
              {ed.start} – {ed.end ?? "devam ediyor"}
            </span>
            <div>
              <h3 className="font-medium">{ed.school}</h3>
              <p className="text-sm text-ink-2 print:text-neutral-800">
                {ed.degree}
                {ed.gpa ? ` · AGNO ${ed.gpa}` : ""}
              </p>
              {ed.note ? <p className="text-sm text-ink-3 print:text-neutral-600">{ed.note}</p> : null}
            </div>
          </div>
        ))}
      </section>

      <section aria-labelledby="cv-yetenek" className="grid gap-3">
        <h2 id="cv-yetenek" className={heading}>
          Yetenekler
        </h2>
        <dl className="grid gap-1.5">
          {groups.map((g) => (
            <div key={g.category} className="grid gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
              <dt className="font-mono text-xs text-ink-3 print:text-neutral-600">{categoryLabel[g.category]}</dt>
              <dd className="text-sm text-ink-2 print:text-neutral-800">{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="cv-proje" className="grid gap-3">
        <h2 id="cv-proje" className={heading}>
          Öne çıkan projeler
        </h2>
        <ul className="grid gap-3">
          {projects.map((p) => (
            <li key={p.slug} className="grid gap-1 sm:grid-cols-[150px_1fr] sm:gap-4 print:break-inside-avoid">
              <span className="font-mono text-xs text-ink-3 print:text-neutral-600">
                {p.year} · {kindLabel[p.kind]}
              </span>
              <div>
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-sm text-ink-2 print:text-neutral-800">{p.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Row>
  );
}
