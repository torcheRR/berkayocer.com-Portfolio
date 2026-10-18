// Koşullu class birleştirme. Çakışan Tailwind sınıflarını birleştirmez; bileşenler bunu gerektirmeyecek şekilde yazıldı.
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
