"use client";

import dynamic from "next/dynamic";

// Önizleme araçları ayrı bir parçada: yalnızca önizlemede çizildiğinde indirilir, ziyaretçinin site kabuğu paketine girmez.
export const PreviewToolsLazy = dynamic(() => import("./PreviewTools").then((m) => m.PreviewTools));
