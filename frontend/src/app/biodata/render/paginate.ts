import { PageModel, RenderBlock } from '../../core/models/render.model';

/** Measurements of one rendered block, in CSS pixels relative to the block's top edge. */
export interface BlockMetric {
  /** Height of the block box. */
  height: number;
  /** Space between this block and the next one. */
  gap: number;
  /** Distance from the block top to the top of the first row (title area). */
  head: number;
  /** Bottom edge of each row. */
  rowBottoms: number[];
}

const MIN_ROWS = 2;

/**
 * Greedily packs blocks into pages. A block that does not fit is split between rows
 * (never inside a row), keeping at least two rows on each side so titles are not orphaned.
 */
export function paginateFlow(
  blocks: readonly RenderBlock[],
  metrics: Readonly<Record<string, BlockMetric>>,
  firstCapacity: number,
  nextCapacity: number,
): RenderBlock[][] {
  const pages: RenderBlock[][] = [[]];
  let remaining = firstCapacity;

  const newPage = (): void => {
    pages.push([]);
    remaining = nextCapacity;
  };

  for (const original of blocks) {
    let block: RenderBlock = original;
    let m: BlockMetric | undefined = metrics[original.id];
    if (!m) {
      pages[pages.length - 1].push(block);
      continue;
    }
    let part = 0;

    // Bounded loop: each iteration either places the block, moves to a new page, or splits it.
    for (let guard = 0; guard < 200; guard++) {
      const current = pages[pages.length - 1];
      if (m.height <= remaining) {
        current.push(block);
        remaining -= m.height + m.gap;
        break;
      }

      const rows = block.rows;
      const lastBottom = m.rowBottoms[m.rowBottoms.length - 1] ?? m.head;
      const tail = Math.max(0, m.height - lastBottom);
      let k = 0;
      while (k < rows.length && m.rowBottoms[k] + tail <= remaining) k++;
      if (rows.length - k < MIN_ROWS) k = rows.length - MIN_ROWS;

      if (k >= MIN_ROWS) {
        const cut = m.rowBottoms[k - 1];
        current.push({ ...block, rows: rows.slice(0, k) });
        part++;
        const rest: BlockMetric = {
          height: m.head + (lastBottom - cut) + tail,
          gap: m.gap,
          head: m.head,
          rowBottoms: m.rowBottoms.slice(k).map((b) => b - cut + m!.head),
        };
        block = { ...block, id: `${original.id}~${part}`, rows: rows.slice(k), continued: true };
        m = rest;
        newPage();
        continue;
      }

      if (current.length > 0) {
        newPage();
        continue;
      }
      // Larger than a whole page and cannot be split: place it anyway.
      current.push(block);
      remaining = 0;
      break;
    }
  }

  return pages.filter((p, i) => i === 0 || p.length > 0);
}

/** Combines independently paginated main and side flows into page models. */
export function toPageModels(main: RenderBlock[][], side: RenderBlock[][]): PageModel[] {
  const total = Math.max(main.length, side.length, 1);
  const pages: PageModel[] = [];
  for (let i = 0; i < total; i++) {
    pages.push({ index: i, total, first: i === 0, main: main[i] ?? [], side: side[i] ?? [] });
  }
  return pages;
}

/** Splits blocks into the main and side flows for templates that have a sidebar. */
export function splitFlows(
  blocks: readonly RenderBlock[],
  sideKeys: readonly string[] | undefined,
): { main: RenderBlock[]; side: RenderBlock[] } {
  if (!sideKeys?.length) return { main: [...blocks], side: [] };
  const main: RenderBlock[] = [];
  const side: RenderBlock[] = [];
  for (const b of blocks) (sideKeys.includes(b.key) ? side : main).push(b);
  return { main, side };
}
