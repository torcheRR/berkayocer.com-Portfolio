import { Row } from "@/components/ui/Frame";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Marker, StatusSquare } from "@/components/ui/primitives";
import type { Profile } from "@/lib/content";
import { ContactForm } from "./ContactForm";

export function ContactSection({ profile }: { profile: Profile }) {
  return (
    <Row as="section" id="iletisim" aria-labelledby="h-cta" className="grid gap-7 px-4 pt-10 pb-8 sm:px-7 sm:pt-14 sm:pb-10">
      <span className="font-mono text-xs text-ink-3">Fig. 06 · İletişim</span>
      <h2 id="h-cta" className="font-mono text-[clamp(2.1rem,6.6vw,4.8rem)] leading-none font-medium tracking-[-0.055em]">
        Birlikte bir şey
        <br />
        <Marker>inşa edelim.</Marker>
      </h2>

      <div className="grid overflow-hidden rounded-card border border-line bg-panel md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div role="group" aria-label="İletişim bilgileri" className="grid content-start border-b border-line md:border-r md:border-b-0">
          <div className="relative grid min-w-0 gap-1.5 border-b border-line px-[18px] py-4">
            <span className="font-mono text-xs text-ink-3">E-POSTA</span>
            <span className="font-mono text-[13.5px] select-all [overflow-wrap:anywhere]">{profile.email}</span>
            <div className="absolute top-2.5 right-2.5 font-mono text-xs">
              <CopyEmail email={profile.email} variant="text" />
            </div>
          </div>
          <div className="grid gap-1.5 border-b border-line px-[18px] py-4">
            <span className="font-mono text-xs text-ink-3">KONUM</span>
            <span>{profile.location}</span>
          </div>
          <div className="grid gap-1.5 border-b border-line px-[18px] py-4">
            <span className="font-mono text-xs text-ink-3">ÇALIŞMA DURUMU</span>
            <span className="flex items-center gap-2">
              <StatusSquare tone="mark" />
              {profile.availability}
            </span>
          </div>
          <div className="grid gap-1.5 px-[18px] py-4">
            <span className="font-mono text-xs text-ink-3">SOSYAL MEDYA</span>
            <ul className="flex flex-wrap gap-1.5">
              {profile.socials.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-line-2 px-2.5 py-1 font-mono text-xs text-ink-2 hover:border-ink-3 hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ContactForm />
      </div>
    </Row>
  );
}
