/**
 * Additional original SVG ornaments for the newer designs. Same approach as ornaments.ts:
 * every function returns a data URI that works in <img> tags and CSS backgrounds and is
 * captured reliably by the PDF rasterizer.
 */

const cache = new Map<string, string>();

function build(key: string, w: number, h: number, body: () => string, par = ''): string {
  let uri = cache.get(key);
  if (!uri) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${par}>${body()}</svg>`;
    uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    cache.set(key, uri);
  }
  return uri;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

/** One marigold bloom made of two rings of petals around a centre. */
function marigold(cx: number, cy: number, r: number, outer: string, inner: string, core: string): string {
  let out = `<g transform="translate(${cx} ${cy})">`;
  for (let i = 0; i < 16; i++) {
    out += `<ellipse cx="0" cy="${r2(-r * 0.62)}" rx="${r2(r * 0.2)}" ry="${r2(r * 0.4)}" transform="rotate(${r2(i * 22.5)})" fill="${outer}"/>`;
  }
  for (let i = 0; i < 12; i++) {
    out += `<ellipse cx="0" cy="${r2(-r * 0.4)}" rx="${r2(r * 0.17)}" ry="${r2(r * 0.3)}" transform="rotate(${r2(i * 30 + 15)})" fill="${inner}"/>`;
  }
  return out + `<circle r="${r2(r * 0.2)}" fill="${core}"/></g>`;
}

/** Hanging marigold garland. Tiles horizontally (background-repeat: repeat-x). 46 x 58. */
export function marigoldGarland(outer: string, inner: string, core: string, leaf: string, string: string): string {
  return build(`garland|${outer}|${inner}|${core}|${leaf}|${string}`, 46, 58, () => {
    const leaves =
      `<path d="M23 4Q12 14 6 8Q14 2 23 4Z" fill="${leaf}"/>` + `<path d="M23 4Q34 14 40 8Q32 2 23 4Z" fill="${leaf}"/>`;
    return (
      `<path d="M0 3Q23 8 46 3" fill="none" stroke="${string}" stroke-width="1.6"/>` +
      leaves +
      marigold(23, 29, 21, outer, inner, core) +
      `<circle cx="23" cy="53" r="3.4" fill="${outer}"/>`
    );
  });
}

/** Ornate corner bracket for a top-left corner. Mirror with CSS for the others. 130 x 130. */
export function cornerGold(color: string): string {
  return build(`cornergold|${color}`, 130, 130, () => {
    return (
      `<g fill="none" stroke="${color}" stroke-linecap="round">` +
      `<path d="M4 126V34Q4 4 34 4H126" stroke-width="2.4"/>` +
      `<path d="M16 126V40Q16 16 40 16H126" stroke-width="1"/>` +
      `<path d="M28 34Q28 28 34 28" stroke-width="1.4"/>` +
      `</g>` +
      `<path d="M30 30l9 9-9 9-9-9z" fill="${color}"/>` +
      `<circle cx="64" cy="10" r="2.2" fill="${color}"/><circle cx="84" cy="10" r="1.6" fill="${color}"/>` +
      `<circle cx="10" cy="64" r="2.2" fill="${color}"/><circle cx="10" cy="84" r="1.6" fill="${color}"/>`
    );
  });
}

/** Olive sprig border. Tiles horizontally. 64 x 28. */
export function oliveSprig(leaf: string, stem: string): string {
  return build(`olive|${leaf}|${stem}`, 64, 28, () => {
    const l = (x: number, y: number, a: number): string =>
      `<path d="M0 0Q7 -4.5 14 0Q7 4.5 0 0Z" transform="translate(${x} ${y}) rotate(${a})" fill="${leaf}"/>`;
    return (
      `<path d="M0 14Q16 6 32 14T64 14" fill="none" stroke="${stem}" stroke-width="1.3"/>` +
      l(8, 11, -50) +
      l(8, 14, 50) +
      l(24, 9, -60) +
      l(24, 12, 40) +
      l(40, 17, -40) +
      l(40, 15, 60) +
      l(56, 13, -50) +
      l(56, 14, 55)
    );
  });
}

/** Small diamond with a dot, used as a repeating border. Tiles in both directions. 18 x 18. */
export function diamondDot(color: string, dot = color): string {
  return build(`diamonddot|${color}|${dot}`, 18, 18, () => {
    return `<path d="M9 2l7 7-7 7-7-7z" fill="${color}"/><circle cx="9" cy="9" r="1.8" fill="${dot}"/>`;
  });
}

/** Overlapping half-circle scales, a classic wedding border. Tiles in both directions. 28 x 14. */
export function scaleTile(stroke: string): string {
  return build(`scale|${stroke}`, 28, 14, () => {
    return (
      `<g fill="none" stroke="${stroke}" stroke-width="1">` +
      `<path d="M0 14a14 14 0 0 1 28 0"/><path d="M5 14a9 9 0 0 1 18 0"/><path d="M10 14a4 4 0 0 1 8 0"/>` +
      `</g>`
    );
  });
}

/** Fine diagonal weave, for subtle textured panels. Tiles in both directions. 12 x 12. */
export function twillTile(color: string): string {
  return build(`twill|${color}`, 12, 12, () => `<path d="M0 12L12 0M-3 3L3 -3M9 15L15 9" stroke="${color}" stroke-width="1" fill="none"/>`);
}

/** Open peony-style bloom with leaves, for soft floral accents. 120 x 120. */
export function bloom(petal: string, petalDeep: string, core: string, leaf: string): string {
  return build(`bloom|${petal}|${petalDeep}|${core}|${leaf}`, 120, 120, () => {
    let out = '';
    for (const a of [-60, 20, 100, 180, 250]) {
      out += `<path d="M60 60Q${r2(60 + 38 * Math.cos((a * Math.PI) / 180))} ${r2(60 + 38 * Math.sin((a * Math.PI) / 180))} 60 60Z" fill="${leaf}"/>`;
    }
    out += `<path d="M60 60Q104 30 112 70Q92 100 60 60Z" fill="${leaf}" opacity=".8"/>`;
    out += `<path d="M60 60Q16 30 8 70Q28 100 60 60Z" fill="${leaf}" opacity=".8"/>`;
    const ring = (n: number, r0: number, rx: number, ry: number, fill: string): string => {
      let s = '';
      for (let i = 0; i < n; i++) {
        s += `<ellipse cx="60" cy="${60 - r0}" rx="${rx}" ry="${ry}" transform="rotate(${r2((i * 360) / n)} 60 60)" fill="${fill}"/>`;
      }
      return s;
    };
    return out + ring(9, 27, 15, 24, petal) + ring(7, 17, 11, 17, petalDeep) + ring(5, 9, 7, 10, petal) + `<circle cx="60" cy="60" r="6" fill="${core}"/>`;
  });
}

/** Two-row checker strip. Tiles horizontally. 18 x 18. */
export function checkTile(a: string, b: string): string {
  return build(`check|${a}|${b}`, 18, 18, () => {
    return (
      `<rect width="18" height="18" fill="${a}"/>` +
      `<rect x="9" width="9" height="9" fill="${b}"/>` +
      `<rect y="9" width="9" height="9" fill="${b}"/>`
    );
  });
}

/**
 * Full-page sheet with chamfered corners: a filled, gold-outlined sheet inset from the page edge,
 * with a second hairline inside it. Drawn as one image because the PDF rasterizer cannot clip
 * HTML elements to a polygon. 794 x 1123 (A4 at 96 dpi).
 */
export function chamferSheet(fill: string, stroke: string, inset = 24, cut = 34): string {
  return build(`chamfer|${fill}|${stroke}|${inset}|${cut}`, 794, 1123, () => {
    const poly = (i: number, c: number): string => {
      const x0 = i;
      const y0 = i;
      const x1 = 794 - i;
      const y1 = 1123 - i;
      return `${x0 + c},${y0} ${x1 - c},${y0} ${x1},${y0 + c} ${x1},${y1 - c} ${x1 - c},${y1} ${x0 + c},${y1} ${x0},${y1 - c} ${x0},${y0 + c}`;
    };
    return (
      `<polygon points="${poly(inset, cut)}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="miter"/>` +
      `<polygon points="${poly(inset + 7, cut - 5)}" fill="none" stroke="${stroke}" stroke-width="1" stroke-opacity=".6"/>`
    );
  });
}

/**
 * Octagonal photo frame to lay over a rectangular photo: the four corners are painted in the
 * page colour and the octagon is outlined. 136 x 160.
 */
export function octagonMask(corner: string, stroke: string): string {
  return build(`octagon|${corner}|${stroke}`, 136, 160, () => {
    const o = '38,2 98,2 134,35 134,125 98,158 38,158 2,125 2,35';
    return (
      `<path fill-rule="evenodd" fill="${corner}" d="M0 0H136V160H0Z M38 2L98 2L134 35L134 125L98 158L38 158L2 125L2 35Z"/>` +
      `<polygon points="${o}" fill="none" stroke="${stroke}" stroke-width="4" stroke-linejoin="miter"/>`
    );
  });
}

/**
 * Header slab cut on the diagonal with a copper edge. Drawn in a 100 x 100 box that stretches to
 * whatever height the header has, so a long name can make the header taller without breaking it.
 */
export function diagonalHeader(slab: string, edge: string): string {
  return build(
    `diag|${slab}|${edge}`,
    100,
    100,
    () =>
      `<polygon points="0,0 100,0 100,78 0,100" fill="${slab}"/>` +
      `<polygon points="0,96 100,74 100,78 0,100" fill="${edge}"/>`,
    ' preserveAspectRatio="none"',
  );
}

/**
 * Cream card with rounded top corners, a solid outline and a fine inner line, drawn as one
 * full-page image (794 x 1123) so no rounded, bordered HTML box is needed for it.
 */
export function roundedCard(fill: string, stroke: string, inner: string, top: number, left: number, right: number, bottom: number, radius = 22): string {
  return build(`rcard|${fill}|${stroke}|${inner}|${top}|${left}|${right}|${bottom}|${radius}`, 794, 1123, () => {
    const x0 = left;
    const x1 = 794 - right;
    const y0 = top;
    const y1 = 1123 - bottom;
    const path = (i: number, r: number): string =>
      `M${x0 + i} ${y1}V${y0 + i + r}Q${x0 + i} ${y0 + i} ${x0 + i + r} ${y0 + i}H${x1 - i - r}Q${x1 - i} ${y0 + i} ${x1 - i} ${y0 + i + r}V${y1}`;
    return (
      `<path d="${path(1, radius)}Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>` +
      `<path d="${path(7, radius - 5)}" fill="none" stroke="${inner}" stroke-width="1"/>`
    );
  });
}
