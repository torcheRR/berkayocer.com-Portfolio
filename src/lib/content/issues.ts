import "server-only";
import { cache } from "react";

// Önizlemede doğrulamadan geçemeyen taslaklar istek boyunca burada toplanır ve önizleme panelinde listelenir.
export type IssueType = "profile" | "project" | "technology" | "experience" | "education";
export type ContentIssue = { type: IssueType; id: string; title: string; field: string; message: string; fallback?: boolean };

const store = cache((): ContentIssue[] => []);

export function reportIssue(issue: ContentIssue) {
  const list = store();
  // Aynı getter bir istekte birden çok kez çalışabilir (ör. yayımlanmış profile dönüş); kayıt tekrarlanmaz.
  if (!list.some((i) => i.type === issue.type && i.id === issue.id && i.field === issue.field)) list.push(issue);
}

export const getIssues = () => [...store()];
