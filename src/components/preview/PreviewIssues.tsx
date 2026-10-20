import { createDataAttribute } from "next-sanity";
import { getEducation, getExperience, getProfile, getProjects, getTechnologies } from "@/lib/content";
import { getIssues, type IssueType } from "@/lib/content/issues";
import { dataset, projectId, studioUrl } from "@/sanity/env";

const TYPE_LABEL: Record<IssueType, string> = {
  profile: "Profil",
  project: "Proje",
  technology: "Teknoloji",
  experience: "Deneyim",
  education: "Eğitim",
};

// Önizlemede doğrulamadan geçemeyen taslakları listeler: sitede neden görünmediklerini açıklar.
// Presentation içinde bir kayda tıklamak Studio'da hatalı alanı açar.
export async function PreviewIssues() {
  // Getter'lar istek boyunca önbellekte; sayfanın zaten yaptığı sorgular tekrarlanmaz.
  await Promise.allSettled([getProfile(), getTechnologies(), getProjects(), getExperience(), getEducation()]);
  const issues = getIssues();
  if (!issues.length) return null;

  return (
    <details className="max-h-[50vh] max-w-[min(560px,calc(100vw-32px))] overflow-auto rounded-xl border border-mark bg-canvas p-3 font-mono text-xs text-ink shadow-[0_10px_30px_rgb(0_0_0/0.45)]">
      <summary className="cursor-pointer">{`${issues.length} içerik sitede gösterilemiyor`}</summary>
      <ul className="mt-2 grid gap-2">
        {issues.map((issue) => (
          <li
            key={`${issue.type}:${issue.id}:${issue.field}`}
            data-sanity={createDataAttribute({ id: issue.id, type: issue.type, path: issue.field, baseUrl: studioUrl, projectId, dataset }).toString()}
            className="grid gap-1 rounded-lg border border-line-2 p-2"
          >
            <span>
              {`${TYPE_LABEL[issue.type]} · ${issue.title} `}
              <span className="text-ink-3">{issue.fallback ? "(yayımlanmış sürüm gösteriliyor)" : "(gizlendi)"}</span>
            </span>
            <pre className="whitespace-pre-wrap text-ink-3">{issue.message}</pre>
          </li>
        ))}
      </ul>
    </details>
  );
}
