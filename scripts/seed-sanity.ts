/**
 * Yerel seed içeriğini (src/content) Sanity'ye taşır.
 *
 *   npm run seed:sanity            # yalnızca olmayan belgeleri oluşturur (panel düzenlemelerine dokunmaz)
 *   npm run seed:sanity -- --force # tüm belgeleri seed'deki haliyle değiştirir
 *   npm run seed:sanity -- --dry   # hiçbir şey yazmadan ne yapılacağını gösterir
 *
 * Gereken ortam değişkenleri (.env.local): NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * SANITY_API_WRITE_TOKEN (Editor yetkili token; yalnızca bu script için, Vercel'e eklenmez).
 */
import { createReadStream } from "node:fs";
import { basename, join } from "node:path";
import { createClient } from "@sanity/client";
import { LexoRank } from "lexorank";
import { z } from "zod";
import { profile } from "../src/content/profile";
import { technologies } from "../src/content/technologies";
import { projects } from "../src/content/projects";
import { education, experience } from "../src/content/experience";
import { Education, Experience, Profile, Project, Technology } from "../src/lib/content/schemas";

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const dry = args.has("--dry");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || (!token && !dry)) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID ve SANITY_API_WRITE_TOKEN .env.local içinde tanımlı olmalı.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-10-01", useCdn: false });

// Seed önce aynı şemalardan geçer: Sanity'ye geçersiz içerik gitmez.
const p = Profile.parse(profile);
const techs = z.array(Technology).parse(technologies);
const projs = z.array(Project).parse(projects);
const exps = z.array(Experience).parse(experience);
const edus = z.array(Education).parse(education);

const loc = (type: "localeString" | "localeText", tr?: string) => (tr ? { _type: type, tr } : undefined);
const key = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12) || Math.random().toString(36).slice(2, 10);

function ranks(count: number) {
  const out: string[] = [];
  let rank = LexoRank.min();
  for (let i = 0; i < count; i++) {
    rank = rank.genNext().genNext();
    out.push(rank.toString());
  }
  return out;
}

async function uploadPortrait() {
  if (!p.portrait?.url.startsWith("/")) return undefined;
  const file = join(process.cwd(), "public", p.portrait.url);
  if (dry) return { _type: "image", alt: p.portrait.alt, asset: { _type: "reference", _ref: "image-dry-run" } };
  // Sanity aynı dosyayı içerik hash'iyle tanır; tekrar çalıştırmak yeni kopya oluşturmaz.
  const asset = await client.assets.upload("image", createReadStream(file), { filename: basename(file) });
  return { _type: "image", alt: p.portrait.alt, asset: { _type: "reference", _ref: asset._id } };
}

async function main() {
  const techRanks = ranks(techs.length);
  const projRanks = ranks(projs.length);
  const portrait = await uploadPortrait();

  const docs: Array<{ _id: string; _type: string } & Record<string, unknown>> = [
    {
      _id: "profile",
      _type: "profile",
      name: p.name,
      role: p.role,
      tagline: loc("localeString", p.tagline),
      bio: loc("localeText", p.bio),
      portrait,
      location: loc("localeString", p.location),
      timeZone: p.timeZone,
      email: p.email,
      githubUser: p.githubUser,
      showGithubActivity: p.showGithubActivity,
      availability: loc("localeString", p.availability),
      socials: p.socials.map((s) => ({ _key: s.platform, _type: "social", ...s })),
      status: p.status.map((s, i) => ({
        _key: `status${i}`,
        _type: "statusCell",
        label: loc("localeString", s.label),
        title: loc("localeString", s.title),
        detail: loc("localeString", s.detail),
        tone: s.tone,
      })),
      workflow: { text: loc("localeText", p.workflow.text), steps: p.workflow.steps },
    },
    ...techs.map((t, i) => ({
      _id: `technology-${t.slug}`,
      _type: "technology",
      orderRank: techRanks[i],
      name: t.name,
      slug: { _type: "slug", current: t.slug },
      categories: t.categories,
      color: t.color,
      url: t.url,
      inStack: t.inStack,
    })),
    ...projs.map((pr, i) => ({
      _id: `project-${pr.slug}`,
      _type: "project",
      orderRank: projRanks[i],
      title: pr.title,
      slug: { _type: "slug", current: pr.slug },
      summary: loc("localeText", pr.summary),
      description: loc("localeText", pr.description),
      year: pr.year,
      kind: pr.kind,
      status: pr.status,
      featured: pr.featured,
      tech: pr.tech.map((slug) => ({ _key: key(slug), _type: "reference", _ref: `technology-${slug}` })),
      links: { repo: pr.links.repo, demo: pr.links.demo },
      cover: { mark: pr.cover.mark, brand: pr.cover.brand },
    })),
    ...exps.map((e) => ({
      _id: `experience-${e.id}`,
      _type: "experience",
      company: e.company,
      role: loc("localeString", e.role),
      type: e.type,
      start: e.start,
      end: e.end ?? undefined,
      location: loc("localeString", e.location),
      summary: loc("localeText", e.summary),
      tags: e.tags,
    })),
    ...edus.map((ed) => ({
      _id: `education-${key(ed.school).toLowerCase()}`,
      _type: "education",
      school: ed.school,
      degree: loc("localeString", ed.degree),
      start: ed.start,
      end: ed.end ?? undefined,
      gpa: ed.gpa,
      note: loc("localeString", ed.note),
    })),
  ];

  // Projeler teknolojilere referans verdiği için aynı transaction'da, teknolojilerle birlikte yazılır.
  const tx = client.transaction();
  for (const doc of docs) {
    if (force) tx.createOrReplace(doc);
    else tx.createIfNotExists(doc);
  }

  const counts = docs.reduce<Record<string, number>>((acc, d) => ({ ...acc, [d._type]: (acc[d._type] ?? 0) + 1 }), {});
  console.log(`${dry ? "[dry] " : ""}${force ? "createOrReplace" : "createIfNotExists"} → ${projectId}/${dataset}`, counts);
  if (dry) return;

  const result = await tx.commit({ visibility: "async" });
  console.log(`Tamam: ${result.results.length} işlem (transaction ${result.transactionId}).`);
}

main().catch((err) => {
  console.error("Seed başarısız:", err instanceof Error ? err.message : err);
  process.exit(1);
});
