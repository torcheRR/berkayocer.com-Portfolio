import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("İçerik")
    .items([
      S.listItem().title("Profil").id("profile").child(S.document().schemaType("profile").documentId("profile").title("Profil")),
      S.divider(),
      orderableDocumentListDeskItem({ type: "project", title: "Projeler (sürükle-bırak sıralama)", S, context }),
      orderableDocumentListDeskItem({ type: "technology", title: "Teknolojiler (sürükle-bırak sıralama)", S, context }),
      S.documentTypeListItem("experience").title("Deneyim"),
      S.documentTypeListItem("education").title("Eğitim"),
    ]);
