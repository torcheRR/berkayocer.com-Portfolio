// Presentation'ın seçili perspektifi bu çerezde tutulur (@sanity/preview-url-secret'teki perspectiveCookieName).
export const PERSPECTIVE_COOKIE = "sanity-preview-perspective";

// Yalnızca taslak ve yayımlanmış desteklenir. Bilinmeyen değerler (ör. release yığınları, boş) taslak olarak okunur.
export const perspectiveFromCookie = (value: string | undefined): "drafts" | "published" => (value === "published" ? "published" : "drafts");
