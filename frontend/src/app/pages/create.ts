import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BiodataForm } from '../biodata/form/biodata-form';
import { PAGE_WIDTH, PreviewEngine } from '../biodata/preview/preview-engine';
import { BiodataStore, FONT_SCALES } from '../biodata/store/biodata.store';
import { I18nService, LANG_NAMES } from '../core/i18n/i18n.service';
import { LANGS, Lang } from '../core/models/biodata.model';
import { EntitlementGrant } from '../core/models/commerce.model';
import { EntitlementService } from '../core/services/entitlement.service';
import { PdfQuality, PdfService, pdfFileName } from '../core/services/pdf.service';
import { PricingService } from '../core/services/pricing.service';
import { SITE_NAME, SeoService } from '../core/services/seo.service';
import { ConfirmDialog, ConfirmDialogData } from '../shared/confirm-dialog';
import { PurchaseDialogData } from '../shared/purchase-dialog';
import { TemplateThumb } from '../shared/template-thumb';
import { TEMPLATES, findTemplate, isTemplateId } from '../templates/registry';

type Tab = 'details' | 'design';
type MobileView = 'edit' | 'preview';

const ZOOM_STEPS = [0.75, 1, 1.25, 1.5];

/** The builder: one form on the left, the live A4 preview on the right. */
@Component({
  selector: 'app-create',
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTooltipModule,
    BiodataForm,
    PreviewEngine,
    TemplateThumb,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="builder" [class.view-preview]="mobile() === 'preview'">
      <div class="toolbar">
        <div class="container tb">
          <button type="button" class="tpl" (click)="showDesign()" [matTooltip]="t('b.chooseTemplate')">
            <span class="dot" [style.background]="def().accent"></span>
            <span class="tpl-name">
              <small>{{ t('b.template') }}</small>
              <strong>{{ def().name }}</strong>
            </span>
            @if (def().tier === 'premium') {
              <mat-icon class="crown">{{ unlocked() ? 'lock_open' : 'workspace_premium' }}</mat-icon>
            }
            <mat-icon>expand_more</mat-icon>
          </button>

          <mat-button-toggle-group
            class="langs"
            hideSingleSelectionIndicator
            [value]="store.biodata().language"
            (change)="store.setLanguage($event.value)"
            [attr.aria-label]="t('b.lang')"
          >
            @for (l of langs; track l) {
              <mat-button-toggle [value]="l">{{ langNames[l] }}</mat-button-toggle>
            }
          </mat-button-toggle-group>

          <span class="spacer"></span>
          <span class="saved" [class.warn]="!store.saveOk()">
            <mat-icon>{{ store.saveOk() ? 'cloud_done' : 'warning' }}</mat-icon>
            <span>{{ store.saveOk() ? t('b.saved') : t('b.err.storage') }}</span>
          </span>

          <button matIconButton [matMenuTriggerFor]="more" [attr.aria-label]="t('nav.menu')">
            <mat-icon>more_vert</mat-icon>
          </button>
          <button matButton="filled" class="dl" [disabled]="busy()" (click)="download('high')">
            @if (busy()) {
              <mat-spinner diameter="18" />
            } @else {
              <mat-icon>download</mat-icon>
            }
            {{ busy() ? t('b.downloading') : t('b.download') }}
          </button>
        </div>
      </div>

      <mat-menu #more="matMenu">
        <button mat-menu-item (click)="download('compact')">
          <mat-icon>compress</mat-icon>{{ t('b.quality.compact') }}
        </button>
        <button mat-menu-item (click)="print()"><mat-icon>print</mat-icon>{{ t('b.print') }}</button>
        <button mat-menu-item (click)="store.loadSample()"><mat-icon>auto_fix_high</mat-icon>{{ t('b.sample') }}</button>
        <button mat-menu-item (click)="reset()"><mat-icon>restart_alt</mat-icon>{{ t('b.reset') }}</button>
      </mat-menu>

      <div class="container cols">
        <section class="form-col">
          <div class="tabs" role="tablist">
            <button type="button" role="tab" [attr.aria-selected]="tab() === 'details'" [class.on]="tab() === 'details'" (click)="tab.set('details')">
              <mat-icon>edit_note</mat-icon>{{ t('b.tab.details') }}
            </button>
            <button type="button" role="tab" [attr.aria-selected]="tab() === 'design'" [class.on]="tab() === 'design'" (click)="tab.set('design')">
              <mat-icon>palette</mat-icon>{{ t('b.tab.design') }}
            </button>
          </div>

          <div [hidden]="tab() !== 'details'">
            <p class="intro">{{ t('b.intro') }}</p>
            <app-biodata-form [showErrors]="showErrors()" />
          </div>

          @if (tab() === 'design') {
            <div class="design">
              <div class="opt">
                <span>{{ t('b.textSize') }}</span>
                <mat-button-toggle-group
                  hideSingleSelectionIndicator
                  [value]="store.settings().fontScale"
                  (change)="store.setFontScale($event.value)"
                >
                  <mat-button-toggle [value]="scales.s">{{ t('b.textSize.s') }}</mat-button-toggle>
                  <mat-button-toggle [value]="scales.m">{{ t('b.textSize.m') }}</mat-button-toggle>
                  <mat-button-toggle [value]="scales.l">{{ t('b.textSize.l') }}</mat-button-toggle>
                </mat-button-toggle-group>
              </div>
              <div class="opt">
                <mat-slide-toggle [checked]="store.settings().fitOnePage" (change)="store.setFitOnePage($event.checked)">
                  {{ t('b.fit') }}
                </mat-slide-toggle>
                <small>{{ t('b.fitHint') }}</small>
              </div>

              <h2>{{ t('b.chooseTemplate') }}</h2>
              <div class="picker">
                @for (x of templates; track x.id) {
                  <button
                    type="button"
                    class="pick"
                    [class.on]="x.id === def().id"
                    [attr.aria-pressed]="x.id === def().id"
                    (click)="choose(x.id)"
                  >
                    <app-template-thumb [def]="x" />
                    <span class="pick-name">
                      {{ x.name }}
                      @if (x.tier === 'premium') {
                        <mat-icon>{{ entitlements.has(x.id) ? 'lock_open' : 'workspace_premium' }}</mat-icon>
                      }
                    </span>
                  </button>
                }
              </div>
            </div>
          }
        </section>

        <section class="preview-col">
          @if (locked()) {
            <div class="premium">
              <mat-icon>workspace_premium</mat-icon>
              <span>{{ t('b.premiumNote') }}</span>
              <button matButton="filled" (click)="unlock()">
                {{ t('b.unlock') }} · {{ pricing.price('PREMIUM_SINGLE') }}
              </button>
            </div>
          }
          <div class="stage" #stage>
            <app-preview-engine
              #engine
              [model]="store.renderModel()"
              [def]="def()"
              [scale]="scale()"
              [fontScale]="store.settings().fontScale"
              [fitOnePage]="store.settings().fitOnePage"
              [watermark]="locked() ? watermark : ''"
              (pageCount)="pages.set($event)"
            />
          </div>
          <div class="zoom">
            <span>{{ t('b.pages', { n: pages() }) }}</span>
            <button matIconButton [disabled]="zoomIndex() === 0" (click)="zoom(-1)" [attr.aria-label]="t('b.zoomOut')">
              <mat-icon>remove</mat-icon>
            </button>
            <button matIconButton [disabled]="zoomIndex() === zoomMax" (click)="zoom(1)" [attr.aria-label]="t('b.zoomIn')">
              <mat-icon>add</mat-icon>
            </button>
          </div>
        </section>
      </div>

      <div class="mobile-bar">
        <mat-button-toggle-group hideSingleSelectionIndicator [value]="mobile()" (change)="mobile.set($event.value)">
          <mat-button-toggle value="edit"><mat-icon>edit</mat-icon>{{ t('b.edit') }}</mat-button-toggle>
          <mat-button-toggle value="preview"><mat-icon>visibility</mat-icon>{{ t('b.preview') }}</mat-button-toggle>
        </mat-button-toggle-group>
        <button matButton="filled" [disabled]="busy()" (click)="download('high')">
          <mat-icon>download</mat-icon>PDF
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      background: var(--sp-bg);
    }
    .builder {
      min-height: calc(100vh - var(--sp-header-h));
    }
    .toolbar {
      position: sticky;
      top: var(--sp-header-h);
      z-index: 30;
      border-bottom: 1px solid var(--sp-border);
      background: rgba(255, 255, 255, 0.97);
    }
    .tb {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 60px;
      padding-top: 8px;
      padding-bottom: 8px;
    }
    .spacer {
      flex: 1;
    }
    .tpl {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      padding: 6px 10px 6px 12px;
      border: 1px solid var(--sp-border);
      border-radius: 12px;
      background: #fff;
      color: var(--sp-ink);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .tpl:hover {
      border-color: var(--sp-primary);
    }
    .dot {
      flex: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
    }
    .tpl-name {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.2;
    }
    .tpl-name small {
      color: var(--sp-muted);
      font-size: 0.7rem;
    }
    .tpl-name strong {
      overflow: hidden;
      font-size: 0.92rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .crown {
      width: 18px;
      height: 18px;
      color: #b07a00;
      font-size: 18px;
    }
    mat-button-toggle-group {
      --mat-button-toggle-height: 38px;
      --mat-button-toggle-shape: 999px;
      font-size: 0.88rem;
    }
    .saved {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--sp-success);
      font-size: 0.82rem;
    }
    .saved.warn {
      color: #8c1d18;
    }
    .saved mat-icon {
      width: 18px;
      height: 18px;
      font-size: 18px;
    }
    .dl mat-spinner {
      display: inline-block;
      margin-right: 6px;
      vertical-align: middle;
      --mat-progress-spinner-active-indicator-color: currentColor;
    }

    .cols {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
      gap: 28px;
      align-items: start;
      padding-top: 22px;
      padding-bottom: 60px;
    }
    .tabs {
      display: flex;
      gap: 6px;
      margin-bottom: 14px;
      padding: 4px;
      border: 1px solid var(--sp-border);
      border-radius: 14px;
      background: #fff;
    }
    .tabs button {
      display: inline-flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 9px 12px;
      border: 0;
      border-radius: 10px;
      background: none;
      color: var(--sp-muted);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .tabs button.on {
      background: var(--sp-primary-soft);
      color: var(--sp-primary-dark);
    }
    .intro {
      margin: 0 4px 12px;
      color: var(--sp-muted);
      font-size: 0.9rem;
    }

    .design {
      padding: 18px;
      border: 1px solid var(--sp-border);
      border-radius: 14px;
      background: #fff;
    }
    .design h2 {
      margin: 22px 0 12px;
      font-family: var(--sp-font);
      font-size: 1rem;
      font-weight: 600;
    }
    .opt {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 14px;
      padding: 8px 0;
      font-size: 0.92rem;
    }
    .opt small {
      flex-basis: 100%;
      color: var(--sp-muted);
    }
    .picker {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .pick {
      padding: 6px 6px 4px;
      border: 2px solid transparent;
      border-radius: 12px;
      background: var(--sp-bg);
      color: var(--sp-ink);
      font: inherit;
      cursor: pointer;
    }
    .pick:hover {
      border-color: #dcc9b8;
    }
    .pick.on {
      border-color: var(--sp-primary);
      background: var(--sp-primary-soft);
    }
    .pick app-template-thumb {
      overflow: hidden;
      border-radius: 6px;
      box-shadow: 0 1px 4px rgba(31, 26, 23, 0.16);
    }
    .pick-name {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 6px 0 2px;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .pick-name mat-icon {
      width: 14px;
      height: 14px;
      color: #b07a00;
      font-size: 14px;
    }

    .preview-col {
      position: sticky;
      top: calc(var(--sp-header-h) + 82px);
    }
    .premium {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      padding: 8px 8px 8px 14px;
      border: 1px solid #f0d58a;
      border-radius: 14px;
      background: #fff8e1;
      color: #6b4a00;
      font-size: 0.88rem;
    }
    .premium span {
      flex: 1;
    }
    .premium mat-icon {
      flex: none;
    }
    .stage {
      max-height: calc(100vh - var(--sp-header-h) - 170px);
      overflow: auto;
      padding: 16px;
      border: 1px solid var(--sp-border);
      border-radius: 16px;
      background: #ebe4dc;
    }
    .zoom {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 2px;
      margin-top: 6px;
      color: var(--sp-muted);
      font-size: 0.85rem;
    }
    .zoom span {
      margin-right: auto;
      padding-left: 6px;
    }

    .mobile-bar {
      display: none;
    }

    @media (max-width: 1100px) {
      .saved span {
        display: none;
      }
    }
    @media (max-width: 960px) {
      .cols {
        grid-template-columns: 1fr;
        padding-bottom: 96px;
      }
      .preview-col {
        position: static;
        display: none;
      }
      .view-preview .preview-col {
        display: block;
      }
      .view-preview .form-col {
        display: none;
      }
      .stage {
        max-height: none;
        padding: 10px;
      }
      .dl {
        display: none;
      }
      .mobile-bar {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 40;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 14px;
        border-top: 1px solid var(--sp-border);
        background: rgba(255, 255, 255, 0.97);
      }
      .mobile-bar mat-icon {
        width: 18px;
        height: 18px;
        margin-right: 6px;
        font-size: 18px;
        vertical-align: text-bottom;
      }
    }
    @media (max-width: 600px) {
      .tb {
        flex-wrap: wrap;
        gap: 8px;
      }
      .tpl {
        flex: 1;
      }
      .langs {
        order: 3;
        width: 100%;
      }
      .langs mat-button-toggle {
        flex: 1;
      }
      .spacer,
      .saved {
        display: none;
      }
      .picker {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .toolbar {
        position: static;
      }
    }
  `,
})
export class Create {
  protected readonly store = inject(BiodataStore);
  protected readonly entitlements = inject(EntitlementService);
  protected readonly pricing = inject(PricingService);
  private readonly i18n = inject(I18nService);
  private readonly pdf = inject(PdfService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly injector = inject(Injector);

  protected readonly t = this.i18n.t;
  protected readonly langs = LANGS;
  protected readonly langNames = LANG_NAMES;
  protected readonly scales = FONT_SCALES;
  protected readonly templates = TEMPLATES;
  protected readonly watermark = `${SITE_NAME} Preview`;
  protected readonly zoomMax = ZOOM_STEPS.length - 1;

  protected readonly tab = signal<Tab>('details');
  protected readonly mobile = signal<MobileView>('edit');
  protected readonly busy = signal(false);
  protected readonly showErrors = signal(false);
  protected readonly pages = signal(1);
  protected readonly zoomIndex = signal(1);
  private readonly stageWidth = signal(560);

  protected readonly def = computed(() => findTemplate(this.store.settings().templateId));
  protected readonly unlocked = computed(() => this.entitlements.has(this.def().id));
  protected readonly locked = computed(() => this.def().tier === 'premium' && !this.unlocked());
  protected readonly scale = computed(() => {
    const fit = Math.min(1, Math.max(0.2, (this.stageWidth() - 34) / PAGE_WIDTH));
    return Math.round(fit * ZOOM_STEPS[this.zoomIndex()] * 1000) / 1000;
  });

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly engine = viewChild.required<PreviewEngine>('engine');
  private readonly form = viewChild(BiodataForm);

  constructor() {
    inject(SeoService).set({
      title: 'Create Marriage Biodata Online | ShubhPatra',
      description:
        'Fill in your details, choose a design and download your marriage biodata as a PDF. Free, private and no sign-up needed.',
      path: '/create',
    });

    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.store.hydrate();
      this.pricing.load();

      const wanted = this.route.snapshot.queryParamMap.get('template');
      if (isTemplateId(wanted)) {
        this.store.setTemplate(wanted);
        void this.router.navigate([], { queryParams: { template: null }, queryParamsHandling: 'merge', replaceUrl: true });
      }

      const el = this.stage().nativeElement;
      const observer = new ResizeObserver(() => this.measureStage());
      observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
      this.measureStage();
    });
  }

  protected showDesign(): void {
    this.tab.set('design');
    this.mobile.set('edit');
  }

  protected choose(id: string): void {
    this.store.setTemplate(id);
  }

  protected zoom(step: -1 | 1): void {
    this.zoomIndex.update((i) => Math.min(this.zoomMax, Math.max(0, i + step)));
  }

  protected async unlock(): Promise<void> {
    const grant = await this.openPurchase();
    if (grant) this.snack.open(this.t('buy.success'), undefined, { duration: 5000 });
  }

  protected async download(quality: PdfQuality): Promise<void> {
    if (this.busy() || !(await this.readyToExport())) return;
    this.busy.set(true);
    try {
      await this.showPreview();
      await this.pdf.download(this.engine().pageElements(), pdfFileName(this.store.name()), quality);
      this.snack.open(this.t('b.done'), undefined, { duration: 4000 });
    } catch {
      this.snack.open(this.t('b.err.pdf'), undefined, { duration: 6000 });
    } finally {
      this.busy.set(false);
    }
  }

  protected async print(): Promise<void> {
    if (this.busy() || !(await this.readyToExport())) return;
    await this.showPreview();
    this.pdf.print(this.engine().pageElements());
  }

  protected async reset(): Promise<void> {
    const data: ConfirmDialogData = {
      title: this.t('b.resetTitle'),
      message: this.t('b.resetConfirm'),
      confirm: this.t('b.resetYes'),
      cancel: this.t('common.cancel'),
    };
    const ok = await firstValueFrom(this.dialog.open(ConfirmDialog, { data, width: '420px', maxWidth: '94vw' }).afterClosed());
    if (ok) {
      this.store.reset();
      this.showErrors.set(false);
    }
  }

  /**
   * Checks everything needed before a download or print: a name, and for premium designs
   * a grant that the server has confirmed. Opens the purchase dialog when there is none.
   */
  private async readyToExport(): Promise<boolean> {
    this.showErrors.set(true);
    if (!this.store.name()) {
      this.tab.set('details');
      this.mobile.set('edit');
      this.form()?.openSection('personal');
      this.snack.open(this.t('b.err.name'), undefined, { duration: 5000 });
      return false;
    }
    if (this.def().tier !== 'premium') return true;

    let entitled = false;
    try {
      entitled = await this.entitlements.verify(this.def().id);
    } catch {
      this.snack.open(this.t('buy.unavailable'), undefined, { duration: 6000 });
      return false;
    }
    if (entitled) return true;
    return !!(await this.openPurchase()) || this.entitlements.has(this.def().id);
  }

  private async openPurchase(): Promise<EntitlementGrant | undefined> {
    const { PurchaseDialog } = await import('../shared/purchase-dialog');
    const data: PurchaseDialogData = { templateId: this.def().id, templateName: this.def().name };
    return firstValueFrom(
      this.dialog
        .open<unknown, PurchaseDialogData, EntitlementGrant>(PurchaseDialog, { data, width: '480px', maxWidth: '96vw' })
        .afterClosed(),
    );
  }

  /**
   * Makes sure the pages about to be exported are laid out: switches the mobile view to the
   * preview and waits for the watermark-free, freshly paginated pages to render.
   */
  private async showPreview(): Promise<void> {
    this.mobile.set('preview');
    await new Promise<void>((resolve) => {
      afterNextRender(() => requestAnimationFrame(() => resolve()), { injector: this.injector });
    });
    await this.engine().settled();
  }

  private measureStage(): void {
    const width = this.stage().nativeElement.clientWidth;
    if (width > 0) this.stageWidth.set(width);
  }
}
