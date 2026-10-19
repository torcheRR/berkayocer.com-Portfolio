// Hero'daki izometrik blok çizimi. Sunucuda üretilir (istemciye JS gitmez);
// imleçle etkileşim Faz 5'te hareket katmanıyla eklenecek.
const HEIGHTS = [
  [1, 2, 3, 2, 1, 0, 1, 2],
  [2, 3, 4, 3, 2, 1, 0, 1],
  [1, 2, 3, 5, 2, 2, 1, 0],
  [0, 1, 2, 1, 2, 3, 2, 1],
  [0, 0, 1, 2, 3, 4, 3, 2],
];
const HOT = { i: 3, j: 2 }; // sarı işaretli blok
const W = 46;
const TH = 23;
const U = 20;

type Pt = [number, number];
const pts = (list: Pt[]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

type Shape =
  | { key: string; tile: Pt[] }
  | { key: string; tile?: undefined; left: Pt[]; right: Pt[]; top: Pt[]; hot: boolean };

// Geometri sabit olduğu için modül yüklenirken bir kez hesaplanır.
function buildIso(): { shapes: Shape[]; viewBox: string } {
  const cells = HEIGHTS.flatMap((row, j) => row.map((h, i) => ({ i, j, h }))).sort(
    (a, b) => a.i + a.j - (b.i + b.j) || a.i - b.i,
  );

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const track = (list: Pt[]) =>
    list.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });

  const shapes = cells.map(({ i, j, h }): Shape => {
    const cx = ((i - j) * W) / 2;
    const by = ((i + j) * TH) / 2;
    if (!h) {
      const tile: Pt[] = [[cx, by - TH / 2], [cx + W / 2, by], [cx, by + TH / 2], [cx - W / 2, by]];
      track(tile);
      return { key: `${i}-${j}`, tile };
    }
    const cy = by - h * U;
    const left: Pt[] = [[cx - W / 2, cy], [cx, cy + TH / 2], [cx, cy + TH / 2 + h * U], [cx - W / 2, cy + h * U]];
    const right: Pt[] = [[cx, cy + TH / 2], [cx + W / 2, cy], [cx + W / 2, cy + h * U], [cx, cy + TH / 2 + h * U]];
    const top: Pt[] = [[cx, cy - TH / 2], [cx + W / 2, cy], [cx, cy + TH / 2], [cx - W / 2, cy]];
    track([...left, ...right, ...top]);
    return { key: `${i}-${j}`, left, right, top, hot: i === HOT.i && j === HOT.j };
  });

  const padX = 40;
  const padTop = 54;
  const viewBox = `${minX - padX} ${minY - padTop} ${maxX - minX + padX * 2} ${maxY - minY + padTop + 26}`;
  return { shapes, viewBox };
}

const { shapes, viewBox } = buildIso();
const stroke = { stroke: "var(--color-line-2)", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };

export function IsoArt() {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 size-full"
      aria-hidden="true"
      data-iso
      data-hero-hide
    >
      <defs>
        <pattern id="iso-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill="#0f1013" />
          <line x1="0" y1="0" x2="0" y2="5" stroke="#262930" strokeWidth="1" />
        </pattern>
        <pattern id="iso-hatch-hot" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill="#1d1a0b" />
          <line x1="0" y1="0" x2="0" y2="5" stroke="var(--color-mark)" strokeWidth="1.2" />
        </pattern>
      </defs>
      {shapes.map((s) =>
        s.tile ? (
          <polygon key={s.key} points={pts(s.tile)} fill="none" stroke="var(--color-line)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ) : (
          // Üst yüzün merkezi: imleçle yükselme hesabı için (hareket katmanı).
          <g key={s.key} data-block data-cx={s.top[0][0].toFixed(1)} data-cy={s.top[1][1].toFixed(1)}>
            <polygon points={pts(s.left)} fill="#0c0d0f" {...stroke} />
            <polygon points={pts(s.right)} fill="#101114" {...stroke} />
            <polygon
              points={pts(s.top)}
              fill={s.hot ? "url(#iso-hatch-hot)" : "url(#iso-hatch)"}
              {...stroke}
              stroke={s.hot ? "rgb(250 204 21 / .55)" : stroke.stroke}
            />
          </g>
        ),
      )}
    </svg>
  );
}
