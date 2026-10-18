import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Sayfanın 1px çerçeveli dar sütunu.
export function Frame({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-col border-x border-line", className)}>{children}</div>;
}

// Kesişim noktalarındaki "+" işaretleri.
function Crosses() {
  const cross =
    "pointer-events-none absolute -top-[6px] z-[2] size-[11px] before:absolute before:top-0 before:left-[5px] before:h-[11px] before:w-px before:bg-ink-3 before:content-[''] after:absolute after:top-[5px] after:left-0 after:h-px after:w-[11px] after:bg-ink-3 after:content-['']";
  return (
    <>
      <span aria-hidden="true" className={cn(cross, "-left-[6px]")} />
      <span aria-hidden="true" className={cn(cross, "-right-[6px]")} />
    </>
  );
}

type RowProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

// Sütun içindeki yatay bölüm: üst çizgisi ekran kenarına uzanır, köşelerde artı işareti var.
export function Row<T extends ElementType = "div">({ as, className, children, ...rest }: RowProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag className={cn("row-line", className)} {...rest}>
      <Crosses />
      {children}
    </Tag>
  );
}

export function Band() {
  return (
    <div className="row-line band-hatch" aria-hidden="true">
      <Crosses />
    </div>
  );
}
