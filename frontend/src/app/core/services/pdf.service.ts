import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

export type PdfQuality = 'high' | 'compact';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = 1123;

/** Raster scale and JPEG quality. 3x on a 794px page is about 288 dpi on A4. */
const PROFILES: Record<PdfQuality, { scale: number; jpeg: number }> = {
  high: { scale: 3, jpeg: 0.93 },
  compact: { scale: 2, jpeg: 0.8 },
};

/**
 * Turns the rendered preview pages into an A4 PDF, entirely in the browser.
 * The pages are cloned unscaled into an off-screen holder so the PDF is identical to the
 * preview. Text is shaped by the browser, which is what makes Devanagari render correctly.
 */
@Injectable({ providedIn: 'root' })
export class PdfService {
  private readonly document = inject(DOCUMENT);

  async download(pages: readonly HTMLElement[], fileName: string, quality: PdfQuality = 'high'): Promise<void> {
    if (!pages.length) throw new Error('Nothing to export');
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
    const profile = PROFILES[quality];

    await this.document.fonts.ready;
    const holder = this.createHolder(pages);
    try {
      await this.waitForImages(holder);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const clones = Array.from(holder.children) as HTMLElement[];
      for (let i = 0; i < clones.length; i++) {
        const canvas = await html2canvas(clones[i], {
          scale: profile.scale,
          width: PAGE_WIDTH_PX,
          height: PAGE_HEIGHT_PX,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
        });
        if (i > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(canvas.toDataURL('image/jpeg', profile.jpeg), 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');
        canvas.width = 0;
        canvas.height = 0;
      }
      pdf.save(fileName);
    } finally {
      holder.remove();
    }
  }

  /** Vector output through the browser's own print dialog ("Save as PDF"). */
  print(pages: readonly HTMLElement[]): void {
    const win = this.document.defaultView;
    if (!win || !pages.length) return;
    const root = this.document.createElement('div');
    root.className = 'sp-print-root';
    for (const page of pages) root.appendChild(page.cloneNode(true));
    this.document.body.appendChild(root);
    this.document.body.classList.add('sp-printing');
    const cleanup = (): void => {
      this.document.body.classList.remove('sp-printing');
      root.remove();
      win.removeEventListener('afterprint', cleanup);
    };
    win.addEventListener('afterprint', cleanup);
    win.print();
  }

  private createHolder(pages: readonly HTMLElement[]): HTMLElement {
    const holder = this.document.createElement('div');
    holder.setAttribute('aria-hidden', 'true');
    Object.assign(holder.style, {
      position: 'fixed',
      left: '-10000px',
      top: '0',
      width: `${PAGE_WIDTH_PX}px`,
      pointerEvents: 'none',
    });
    for (const page of pages) {
      const clone = page.cloneNode(true) as HTMLElement;
      Object.assign(clone.style, { transform: 'none', margin: '0', boxShadow: 'none' });
      holder.appendChild(clone);
    }
    this.document.body.appendChild(holder);
    return holder;
  }

  private async waitForImages(root: HTMLElement): Promise<void> {
    const images = Array.from(root.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => undefined))),
    );
  }
}

/** File-system friendly name such as "Ananya-Sharma-Biodata.pdf". */
export function pdfFileName(name: string): string {
  const base = name
    .trim()
    .replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${base || 'Marriage'}-Biodata.pdf`;
}
