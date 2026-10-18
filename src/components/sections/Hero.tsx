import Image from "next/image";
import type { ReactNode } from "react";
import { Row } from "@/components/ui/Frame";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LocalTime, TimeDiff } from "@/components/ui/LocalTime";
import { RichInline } from "@/components/ui/primitives";
import { CopyEmail } from "@/components/ui/CopyEmail";
import type { Education, Profile } from "@/lib/content";
import { cn } from "@/lib/cn";
import { IsoArt } from "./IsoArt";

function Fact({ icon, children, className }: { icon: IconName; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3 border-line px-4 py-3 sm:px-7", className)}>
      <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-line-2 bg-panel text-sm text-ink-2">
        <Icon name={icon} />
      </span>
      <span className="min-w-0 font-mono text-xs [overflow-wrap:anywhere]">{children}</span>
    </div>
  );
}

export function Hero({ profile, education }: { profile: Profile; education?: Education }) {
  const github = profile.socials.find((s) => s.platform === "github");
  const facts: { key: string; icon: IconName; content: ReactNode }[] = [
    { key: "role", icon: "briefcase", content: profile.role },
    { key: "loc", icon: "pin", content: profile.location },
    {
      key: "time",
      icon: "clock",
      content: (
        <>
          <LocalTime timeZone={profile.timeZone} /> <TimeDiff timeZone={profile.timeZone} />
        </>
      ),
    },
    {
      key: "mail",
      icon: "mail",
      content: (
        <span className="flex items-center gap-2">
          {profile.email}
          <CopyEmail email={profile.email} variant="text" />
        </span>
      ),
    },
  ];
  if (github) {
    facts.push({
      key: "github",
      icon: "github",
      content: (
        <a href={github.url} target="_blank" rel="noopener noreferrer" className="hover:text-mark">
          {github.url.replace("https://", "")}
        </a>
      ),
    });
  }
  if (education) {
    facts.push({ key: "edu", icon: "cap", content: `${education.school} · ${education.end ?? "devam ediyor"}` });
  }
  return (
    <Row as="section" aria-labelledby="hero-name">
      <div className="relative h-[220px] overflow-hidden sm:h-[300px]">
        <div className="absolute inset-x-5 top-4 z-[2] flex justify-between gap-3 font-mono text-xs text-ink-3">
          <span>BO/{String(new Date().getFullYear()).slice(2)} · İSTANBUL</span>
          <LocalTime timeZone={profile.timeZone} prefix="İST " />
        </div>
        <IsoArt />
        <span className="absolute right-5 bottom-3.5 z-[2] font-mono text-xs text-ink-3 max-sm:hidden">Fig. 1 · Bileşen bileşen, katman katman.</span>
      </div>

      <div className="relative z-[3] -mt-12 grid grid-cols-1 items-end gap-3.5 px-4 pb-5 sm:-mt-[58px] sm:grid-cols-[auto_1fr] sm:gap-x-[22px] sm:px-7 sm:pb-6">
        <div className="size-[104px] overflow-hidden rounded-[18px] border border-line-2 bg-panel shadow-[0_0_0_6px_var(--color-canvas)] sm:size-[132px] sm:rounded-[22px]">
          <Image src="/IMG_9912.JPG" alt={`${profile.name} portresi`} width={264} height={264} sizes="132px" priority className="size-full object-cover" />
        </div>
        <div>
          <h1 id="hero-name" className="font-mono text-[clamp(2.1rem,5.4vw,3.7rem)] leading-none font-medium tracking-[-0.05em]">
            {profile.name}
          </h1>
          <p className="mt-2.5 max-w-[52ch] text-[15.5px] text-ink-2">
            <RichInline text={profile.tagline} />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {facts.map((f, i) => (
          <Fact
            key={f.key}
            icon={f.icon}
            className={cn(i > 0 && "border-t", i === 1 && "sm:border-t-0", i % 2 === 0 && "sm:border-r")}
          >
            {f.content}
          </Fact>
        ))}
      </div>
    </Row>
  );
}
