import { Band } from "@/components/ui/Frame";
import { Hero } from "@/components/sections/Hero";
import { StatusRow } from "@/components/sections/StatusRow";
import { AtAGlance } from "@/components/sections/AtAGlance";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { ExperienceLog } from "@/components/sections/ExperienceLog";
import { ContactSection } from "@/components/sections/ContactSection";
import { stegaClean } from "next-sanity";
import { getEducation, getExperience, getFeaturedProjects, getProfile, getProjects, getTechMap, getTechnologies, isPreview } from "@/lib/content";
import { getContributions } from "@/lib/github";
import { pageMetadata, site } from "@/lib/site";

export const metadata = pageMetadata({ description: site.description, path: "/" });

export default async function HomePage() {
  const [profile, techs, techMap, featured, all, experience, education, preview] = await Promise.all([
    getProfile(),
    getTechnologies(),
    getTechMap(),
    getFeaturedProjects(),
    getProjects(),
    getExperience(),
    getEducation(),
    isPreview(),
  ]);
  const contributions = profile.showGithubActivity ? await getContributions(profile.githubUser, { preview }) : null;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: site.url,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: "İstanbul", addressCountry: "TR" },
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
    knowsAbout: techs.filter((t) => t.inStack).map((t) => t.name),
    sameAs: profile.socials.map((s) => s.url),
  };

  return (
    <>
      {/* Önizlemede ad, unvan ve okul adları görünmez işaret taşır; yapılandırılmış veri temiz kalmalı. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(stegaClean(personJsonLd)).replace(/</g, "\\u003c") }} />
      <Hero profile={profile} education={education[0]} />
      <StatusRow profile={profile} />
      <Band />
      <AtAGlance profile={profile} techs={techs} education={education[0]} contributions={contributions} projectCount={all.length} />
      <FeaturedWork projects={featured} techMap={techMap} total={all.length} />
      <ExperienceLog experience={experience} education={education} />
      <Band />
      <ContactSection profile={profile} preview={preview} />
    </>
  );
}
