import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";

// Önizleme aracı: hangi adreste hangi belge düzenlenir (mainDocuments) ve bir belge sitede nerelerde görünür (locations).
// Yönlendirilen eski adresler (/portfoyum, /iletisim) burada kullanılmaz.

type Resolve = NonNullable<PresentationPluginOptions["resolve"]>;

export const mainDocuments: Resolve["mainDocuments"] = defineDocuments([
  { route: "/projeler/:slug", filter: `_type == "project" && slug.current == $slug` },
  { route: ["/", "/ozgecmisim"], filter: `_type == "profile" && _id == "profile"` },
]);

export const locations: Resolve["locations"] = {
  profile: defineLocations({
    locations: [
      { title: "Ana sayfa", href: "/" },
      { title: "Özgeçmiş", href: "/ozgecmisim" },
    ],
    message: "Ad, saat dilimi ve sosyal bağlantılar her sayfanın alt bilgisinde de kullanılır.",
  }),
  project: defineLocations({
    select: { title: "title", slug: "slug.current", featured: "featured" },
    resolve: (doc) => {
      if (!doc?.slug) return { message: "Önizleme için önce bir slug oluştur.", tone: "caution" };
      return {
        locations: [
          { title: doc.title || "Proje sayfası", href: `/projeler/${doc.slug}` },
          { title: "Tüm projeler", href: "/projeler" },
          ...(doc.featured
            ? [
                { title: "Ana sayfa · Seçili işler", href: "/#isler" },
                { title: "Özgeçmiş", href: "/ozgecmisim" },
              ]
            : []),
        ],
      };
    },
  }),
  technology: defineLocations({
    select: { inStack: "inStack" },
    resolve: (doc) => ({
      locations: [
        { title: "Tüm projeler", href: "/projeler" },
        ...(doc?.inStack
          ? [
              { title: "Ana sayfa · Bir bakışta", href: "/#bakis" },
              { title: "Özgeçmiş · Yetenekler", href: "/ozgecmisim" },
            ]
          : []),
      ],
      message: "Bu teknolojiyi kullanan proje sayfalarında da görünür.",
    }),
  }),
  experience: defineLocations({
    locations: [
      { title: "Ana sayfa · Deneyim", href: "/#deneyim" },
      { title: "Özgeçmiş", href: "/ozgecmisim" },
    ],
  }),
  education: defineLocations({
    locations: [
      { title: "Ana sayfa · Deneyim", href: "/#deneyim" },
      { title: "Özgeçmiş", href: "/ozgecmisim" },
    ],
  }),
};
