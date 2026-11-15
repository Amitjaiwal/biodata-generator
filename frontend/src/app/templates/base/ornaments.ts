/**
 * Original, programmatically drawn SVG ornaments. Each function returns a data URI so the
 * artwork can be used in <img> tags and CSS backgrounds, renders identically on the server,
 * and is captured reliably by the PDF rasterizer.
 */

const cache = new Map<string, string>();

function build(key: string, viewBox: string, body: () => string): string {
  let uri = cache.get(key);
  if (!uri) {
    // Explicit width and height give the image an intrinsic size, which canvas rasterizers need.
    const [, , w, h] = viewBox.split(' ');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}">${body()}</svg>`;
    uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    cache.set(key, uri);
  }
  return uri;
}

/** Wraps a data URI for use in a CSS `background-image`. */
export const cssUrl = (uri: string): string => `url("${uri}")`;

const r2 = (n: number): number => Math.round(n * 100) / 100;

function petal(r0: number, r1: number, w: number): string {
  const a = r0 + (r1 - r0) * 0.35;
  const b = r0 + (r1 - r0) * 0.7;
  return `M0 ${-r0}C${w} ${-a} ${w} ${-b} 0 ${-r1}C${-w} ${-b} ${-w} ${-a} 0 ${-r0}Z`;
}

function ring(n: number, r0: number, r1: number, w: number, attrs = ''): string {
  let out = '';
  for (let i = 0; i < n; i++) out += `<path d="${petal(r0, r1, w)}" transform="rotate(${r2((i * 360) / n)})" ${attrs}/>`;
  return out;
}

function leaf(x: number, y: number, len: number, angle: number, fill: string): string {
  const h = r2(len * 0.36);
  return `<path d="M0 0Q${len / 2} ${-h} ${len} 0Q${len / 2} ${h} 0 0Z" transform="translate(${x} ${y}) rotate(${angle})" fill="${fill}"/>`;
}

function flower(cx: number, cy: number, r: number, fill: string, center: string, petals = 6): string {
  let out = `<g transform="translate(${cx} ${cy})">`;
  for (let i = 0; i < petals; i++) {
    out += `<ellipse cx="0" cy="${r2(-r * 0.55)}" rx="${r2(r * 0.34)}" ry="${r2(r * 0.5)}" transform="rotate(${r2((i * 360) / petals)})" fill="${fill}"/>`;
  }
  return out + `<circle r="${r2(r * 0.26)}" fill="${center}"/></g>`;
}

/** Concentric petal mandala. */
export function mandala(stroke: string, tint = stroke): string {
  return build(`mandala|${stroke}|${tint}`, '-100 -100 200 200', () => {
    let dots = '';
    for (let i = 0; i < 32; i++) {
      const a = (i * Math.PI * 2) / 32;
      dots += `<circle cx="${r2(Math.cos(a) * 94)}" cy="${r2(Math.sin(a) * 94)}" r="1.3" fill="${stroke}" stroke="none"/>`;
    }
    return (
      `<g fill="none" stroke="${stroke}" stroke-width="0.9">` +
      `<circle r="98"/><circle r="90"/>${dots}` +
      ring(24, 66, 89, 7.5) +
      `<circle r="66"/>` +
      ring(16, 40, 64, 9, `fill="${tint}" fill-opacity="0.18"`) +
      `<circle r="40"/>` +
      ring(12, 16, 38, 7) +
      `<circle r="16"/>` +
      ring(8, 4, 15, 4, `fill="${tint}" fill-opacity="0.3"`) +
      `</g>`
    );
  });
}

/** Floral spray for a top-left corner. Rotate with CSS for the other corners. */
export function cornerFloral(leafColor: string, flowerColor: string, centerColor: string): string {
  return build(`cfloral|${leafColor}|${flowerColor}|${centerColor}`, '0 0 220 220', () => {
    const branch =
      `<path d="M20 20C70 34 122 20 204 42" fill="none" stroke="${leafColor}" stroke-width="2.2" stroke-linecap="round"/>` +
      leaf(62, 28, 30, -38, leafColor) +
      leaf(70, 30, 26, 42, leafColor) +
      leaf(104, 28, 28, -40, leafColor) +
      leaf(112, 28, 24, 44, leafColor) +
      leaf(150, 30, 24, -36, leafColor) +
      leaf(160, 33, 22, 48, leafColor) +
      leaf(190, 38, 18, -20, leafColor) +
      flower(132, 22, 13, flowerColor, centerColor, 5) +
      flower(86, 44, 9, flowerColor, centerColor, 5) +
      `<circle cx="206" cy="43" r="4" fill="${flowerColor}"/>`;
    return (
      branch +
      `<g transform="matrix(0 1 1 0 0 0)">${branch}</g>` +
      leaf(40, 40, 40, 45, leafColor) +
      flower(38, 38, 30, flowerColor, centerColor, 8) +
      flower(38, 38, 17, centerColor, flowerColor, 6)
    );
  });
}

/** Line-work bracket with curls for a top-left corner. */
export function cornerClassic(color: string): string {
  return build(`cclassic|${color}`, '0 0 120 120', () => {
    return (
      `<g fill="none" stroke="${color}" stroke-linecap="round">` +
      `<path d="M4 116V4H116" stroke-width="3"/>` +
      `<path d="M13 98V13H98" stroke-width="1"/>` +
      `<path d="M24 74V38A14 14 0 0 1 38 24H74" stroke-width="1.6"/>` +
      `<path d="M24 74c0 12 16 12 16 0s-10-9-10-2" stroke-width="1.6"/>` +
      `<path d="M74 24c12 0 12 16 0 16s-9-10-2-10" stroke-width="1.6"/>` +
      `</g>` +
      `<rect x="33" y="33" width="12" height="12" transform="rotate(45 39 39)" fill="${color}"/>` +
      `<circle cx="104" cy="13" r="2.4" fill="${color}"/><circle cx="13" cy="104" r="2.4" fill="${color}"/>`
    );
  });
}

/** Repeatable door-garland (toran) tile of leaves and marigolds. Use with background-repeat: repeat-x. */
export function toranTile(leafColor: string, flowerColor: string, stringColor: string): string {
  return build(`toran|${leafColor}|${flowerColor}|${stringColor}`, '0 0 80 56', () => {
    const drop = (x: number, y: number, len: number): string =>
      `<path d="M${x} ${y}q-7 ${r2(len * 0.5)} 0 ${len}q7 ${r2(-len * 0.5)} 0 ${-len}z" fill="${leafColor}"/>`;
    const marigold = (x: number, y: number): string =>
      `<circle cx="${x}" cy="${y}" r="7" fill="${flowerColor}"/><circle cx="${x}" cy="${y}" r="3.4" fill="${stringColor}"/>`;
    return (
      `<path d="M0 7Q40 15 80 7" fill="none" stroke="${stringColor}" stroke-width="2"/>` +
      drop(13, 10, 30) +
      drop(27, 12, 40) +
      drop(53, 12, 40) +
      drop(67, 10, 30) +
      marigold(0, 7) +
      marigold(40, 11) +
      marigold(80, 7)
    );
  });
}

/** Horizontal flourish used between header elements. */
export function divider(color: string): string {
  return build(`divider|${color}`, '0 0 240 20', () => {
    return (
      `<g fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round">` +
      `<path d="M4 10H92M148 10H236"/>` +
      `<path d="M92 10c6-9 14-9 16 0M148 10c-6-9-14-9-16 0"/>` +
      `<path d="M92 10c6 9 14 9 16 0M148 10c-6 9-14 9-16 0"/>` +
      `</g>` +
      `<path d="M120 2l8 8-8 8-8-8z" fill="${color}"/>` +
      `<circle cx="4" cy="10" r="2" fill="${color}"/><circle cx="236" cy="10" r="2" fill="${color}"/>`
    );
  });
}

export function lotus(petalColor: string, coreColor: string): string {
  return build(`lotus|${petalColor}|${coreColor}`, '0 0 120 84', () => {
    const p = 'M60 76C44 58 46 30 60 8C74 30 76 58 60 76Z';
    const at = (deg: number, fill: string, op: number): string =>
      `<path d="${p}" transform="rotate(${deg} 60 76)" fill="${fill}" fill-opacity="${op}"/>`;
    return (
      at(-62, petalColor, 0.55) +
      at(62, petalColor, 0.55) +
      at(-32, petalColor, 0.8) +
      at(32, petalColor, 0.8) +
      at(0, coreColor, 1) +
      `<path d="M22 79q38 9 76 0" fill="none" stroke="${petalColor}" stroke-width="2.5" stroke-linecap="round"/>`
    );
  });
}

export function kalash(potColor: string, accent: string, leafColor: string): string {
  return build(`kalash|${potColor}|${accent}|${leafColor}`, '0 0 100 120', () => {
    const lf = 'M50 56C39 42 41 26 50 14C59 26 61 42 50 56Z';
    const leaves = [-56, -28, 28, 56].map((d) => `<path d="${lf}" transform="rotate(${d} 50 58)" fill="${leafColor}"/>`).join('');
    return (
      leaves +
      `<ellipse cx="50" cy="38" rx="13" ry="17" fill="${accent}"/><path d="M50 12l-5 11h10z" fill="${accent}"/>` +
      `<path d="M33 62C10 72 14 110 50 112C86 110 90 72 67 62Z" fill="${potColor}"/>` +
      `<rect x="32" y="53" width="36" height="11" rx="4" fill="${accent}"/>` +
      `<path d="M21 86q29 11 58 0" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>` +
      `<circle cx="50" cy="98" r="3" fill="${accent}"/>`
    );
  });
}

export function diya(bowlColor: string, flameColor: string): string {
  return build(`diya|${bowlColor}|${flameColor}`, '0 0 100 84', () => {
    return (
      `<path d="M50 46C36 32 46 18 50 4C54 18 64 32 50 46Z" fill="${flameColor}"/>` +
      `<path d="M50 44C44 36 48 28 50 22C52 28 56 36 50 44Z" fill="#fff" fill-opacity="0.65"/>` +
      `<path d="M6 46C12 78 88 78 94 46C70 56 30 56 6 46Z" fill="${bowlColor}"/>` +
      `<path d="M30 78h40l6 4H24z" fill="${bowlColor}"/>`
    );
  });
}

export function crescent(color: string): string {
  return build(`crescent|${color}`, '0 0 100 100', () => {
    let star = '';
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? 11 : 4.6;
      const a = ((-90 + i * 36) * Math.PI) / 180;
      star += `${i ? 'L' : 'M'}${r2(63 + Math.cos(a) * rad)} ${r2(48 + Math.sin(a) * rad)}`;
    }
    return (
      `<path fill-rule="evenodd" fill="${color}" d="M46 12a38 38 0 1 0 0.01 0zM56 21a27 27 0 1 0 0.01 0z"/>` +
      `<path d="${star}Z" fill="${color}"/>`
    );
  });
}

export function cross(color: string): string {
  return build(`cross|${color}`, '0 0 100 100', () => `<path d="M42 6h16v26h24v16H58v46H42V48H18V32h24z" fill="${color}"/>`);
}

/** Jain emblem of the raised palm with the wheel. */
export function jainHand(color: string, wheelBg: string): string {
  return build(`jain|${color}|${wheelBg}`, '0 0 100 120', () => {
    let spokes = '';
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      spokes += `<path d="M50 80L${r2(50 + Math.cos(a) * 11)} ${r2(80 + Math.sin(a) * 11)}" stroke="${color}" stroke-width="1.6"/>`;
    }
    return (
      `<g fill="${color}">` +
      `<rect x="27" y="48" width="48" height="62" rx="16"/>` +
      `<rect x="27" y="24" width="11" height="44" rx="5.5"/>` +
      `<rect x="39.4" y="14" width="11" height="54" rx="5.5"/>` +
      `<rect x="51.8" y="16" width="11" height="52" rx="5.5"/>` +
      `<rect x="64" y="27" width="11" height="42" rx="5.5"/>` +
      `<rect x="11" y="56" width="12" height="38" rx="6" transform="rotate(-30 17 75)"/>` +
      `</g>` +
      `<circle cx="50" cy="80" r="13" fill="${wheelBg}"/>${spokes}<circle cx="50" cy="80" r="3.2" fill="${color}"/>`
    );
  });
}

export function paisley(color: string, inner: string): string {
  return build(`paisley|${color}|${inner}`, '0 0 100 130', () => {
    const p = 'M50 122C16 122 6 86 22 58C36 34 62 34 70 12C76 30 96 54 88 88C82 110 68 122 50 122Z';
    return (
      `<path d="${p}" fill="${color}"/>` +
      `<path d="${p}" fill="${inner}" transform="translate(52 84) scale(0.62) translate(-52 -84)"/>` +
      `<path d="${p}" fill="${color}" transform="translate(52 90) scale(0.3) translate(-52 -84)"/>`
    );
  });
}

export function peacockFeather(teal: string, blue: string, gold: string): string {
  return build(`feather|${teal}|${blue}|${gold}`, '0 0 60 150', () => {
    let barbs = '';
    for (let i = 0; i < 7; i++) {
      const y = 96 + i * 7;
      barbs += `<path d="M30 ${y}q-12 -4 -18 -14M30 ${y}q12 -4 18 -14" fill="none" stroke="${teal}" stroke-width="1" stroke-opacity="0.7"/>`;
    }
    return (
      `<path d="M30 150V60" stroke="${gold}" stroke-width="1.6"/>${barbs}` +
      `<ellipse cx="30" cy="50" rx="25" ry="46" fill="${teal}" fill-opacity="0.3"/>` +
      `<ellipse cx="30" cy="46" rx="18" ry="31" fill="${teal}"/>` +
      `<ellipse cx="30" cy="43" rx="12" ry="19" fill="${gold}"/>` +
      `<ellipse cx="30" cy="41" rx="7.5" ry="11" fill="${blue}"/>`
    );
  });
}

/** Eight-point star lattice. Tiles in both directions. */
export function starTile(color: string): string {
  return build(`star|${color}`, '0 0 40 40', () => {
    return (
      `<g fill="none" stroke="${color}" stroke-width="1.1">` +
      `<rect x="10" y="10" width="20" height="20"/>` +
      `<rect x="10" y="10" width="20" height="20" transform="rotate(45 20 20)"/>` +
      `<path d="M0 20h5.86M34.14 20H40M20 0v5.86M20 34.14V40"/>` +
      `<circle cx="20" cy="20" r="3.5"/>` +
      `</g>`
    );
  });
}

/** Climbing vine. Tiles vertically (background-repeat: repeat-y). */
export function vineTile(leafColor: string, stemColor: string): string {
  return build(`vine|${leafColor}|${stemColor}`, '0 0 30 60', () => {
    return (
      `<path d="M15 0C25 10 25 20 15 30S5 50 15 60" fill="none" stroke="${stemColor}" stroke-width="1.4"/>` +
      leaf(20, 13, 12, -35, leafColor) +
      leaf(10, 43, 12, 215, leafColor) +
      `<circle cx="15" cy="30" r="1.8" fill="${stemColor}"/>`
    );
  });
}

/** Diamond chain inspired by woven sari borders. Tiles in both directions. */
export function weaveTile(gold: string, accent: string): string {
  return build(`weave|${gold}|${accent}`, '0 0 40 40', () => {
    return (
      `<path d="M20 3l13 17-13 17L7 20z" fill="${gold}"/>` +
      `<path d="M20 11l7 9-7 9-7-9z" fill="${accent}"/>` +
      `<path d="M0 0l5 20L0 40zM40 0l-5 20 5 20z" fill="${gold}"/>` +
      `<circle cx="20" cy="20" r="2" fill="${gold}"/>`
    );
  });
}

/** Row of hanging scallops. Tiles horizontally. */
export function scallopTile(color: string): string {
  return build(`scallop|${color}`, '0 0 24 12', () => `<path d="M0 0h24a12 12 0 0 1-24 0z" fill="${color}"/>`);
}

/** Multifoil (cusped) arch outline as seen on palace windows. Stretches horizontally. */
export function multifoilArch(stroke: string, fill = 'none'): string {
  return build(`arch|${stroke}|${fill}`, '0 0 200 100', () => {
    const d =
      'M2 100V52C2 40 14 38 22 32C24 22 36 22 44 18C50 8 64 12 72 8C82 0 92 4 100 2' +
      'C108 4 118 0 128 8C136 12 150 8 156 18C164 22 176 22 178 32C186 38 198 40 198 52V100';
    return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  });
}
