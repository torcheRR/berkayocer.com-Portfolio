import { Row } from "@/components/ui/Frame";
import { LocalTime } from "@/components/ui/LocalTime";
import { MotionToggle } from "./MotionToggle";
import { getProfile } from "@/lib/content";

// Vercel build'inde commit hash'i gelir; yerelde "local".
const rev = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";

export async function SiteFooter() {
  const profile = await getProfile();
  return (
    <Row
      as="footer"
      className="flex flex-wrap justify-between gap-x-5 gap-y-2.5 px-4 pt-4 pb-[calc(18px+env(safe-area-inset-bottom,0px))] font-mono text-xs text-ink-3 sm:px-7 print:hidden"
    >
      <span>
        <LocalTime timeZone={profile.timeZone} prefix="İST " /> · Rev {rev} · © {new Date().getFullYear()} {profile.name}
      </span>
      <ul className="flex flex-wrap items-center gap-3.5">
        <MotionToggle />
        {profile.socials.map((s) => (
          <li key={s.platform}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </Row>
  );
}
