import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { ImageRef, Project } from "@/lib/content/schemas";

type BodyImage = { _type: "image"; _key: string; caption?: string; image?: ImageRef; figure?: number };

// Panelde yazılan case study gövdesi. "Vurgula" işareti sitenin sarı kalemine dönüşür.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="max-w-[68ch] text-ink-2">{children}</p>,
    h2: ({ children }) => <h2 className="pt-4 font-mono text-[1.35rem] font-medium tracking-[-0.03em]">{children}</h2>,
    h3: ({ children }) => <h3 className="pt-2 text-[17px] font-medium">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="max-w-[68ch] border-l-2 border-mark pl-4 text-ink-2 italic">{children}</blockquote>,
  },
  marks: {
    // Gövdede uzun ifadeler de vurgulanabildiği için satır kırabilen bir kalem çizgisi kullanılır.
    highlight: ({ children }) => (
      <mark className="bg-[linear-gradient(transparent_58%,color-mix(in_srgb,var(--color-mark)_32%,transparent)_58%,color-mix(in_srgb,var(--color-mark)_32%,transparent)_92%,transparent_92%)] text-ink [box-decoration-break:clone]">
        {children}
      </mark>
    ),
    code: ({ children }) => <code className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = href.startsWith("http");
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-mark underline underline-offset-2">
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: BodyImage }) =>
      value.image ? (
        <figure className="grid gap-2">
          <Image
            src={value.image.url}
            alt={value.image.alt}
            width={value.image.width}
            height={value.image.height}
            sizes="(min-width: 920px) 864px, 100vw"
            placeholder={value.image.lqip ? "blur" : "empty"}
            blurDataURL={value.image.lqip}
            className="h-auto w-full rounded-[10px] border border-line"
          />
          <figcaption className="font-mono text-xs text-ink-3">
            Fig. {String(value.figure ?? 1).padStart(2, "0")}
            {value.caption ? ` · ${value.caption}` : ""}
          </figcaption>
        </figure>
      ) : null,
  },
  list: {
    bullet: ({ children }) => <ul className="grid max-w-[68ch] list-disc gap-1 pl-5 text-ink-2 marker:text-mark">{children}</ul>,
    number: ({ children }) => <ol className="grid max-w-[68ch] list-decimal gap-1 pl-5 text-ink-2">{children}</ol>,
  },
};

export function CaseStudyBody({ body }: { body: Project["body"] }) {
  if (!body.length) return null;
  return (
    <div className="grid gap-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- bloklar adapter'da doğrulandı */}
      <PortableText value={body as any} components={components} />
    </div>
  );
}
