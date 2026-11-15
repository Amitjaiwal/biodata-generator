import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * Crops the chosen image to a 4:5 portrait in the browser and returns a JPEG data URL.
 * The original file never leaves the device.
 */
@Component({
  selector: 'app-photo-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, ImageCropperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ t('b.photo.crop') }}</h2>
    <mat-dialog-content>
      <div class="stage">
        @if (!ready() && !failed()) {
          <mat-spinner diameter="36" />
        }
        @if (failed()) {
          <p class="error" role="alert">{{ t('b.photo.failed') }}</p>
        } @else {
          <image-cropper
            [imageFile]="file"
            [maintainAspectRatio]="true"
            [aspectRatio]="4 / 5"
            [resizeToWidth]="720"
            [onlyScaleDown]="true"
            [imageQuality]="88"
            [canvasRotation]="rotation()"
            [transform]="transform()"
            [allowMoveImage]="true"
            format="jpeg"
            output="base64"
            backgroundColor="#ffffff"
            (imageCropped)="onCropped($event)"
            (cropperReady)="ready.set(true)"
            (loadImageFailed)="failed.set(true)"
          />
        }
      </div>
      @if (!failed()) {
        <div class="controls">
          <label>
            <span>{{ t('b.photo.zoom') }}</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              [value]="zoom()"
              (input)="zoom.set(+$any($event.target).value)"
              [attr.aria-label]="t('b.photo.zoom')"
            />
          </label>
          <button matButton="outlined" type="button" (click)="rotate()">
            <mat-icon>rotate_right</mat-icon>{{ t('b.photo.rotate') }}
          </button>
        </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>{{ t('common.cancel') }}</button>
      <button matButton="filled" [disabled]="!cropped()" (click)="apply()">{{ t('b.photo.apply') }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .stage {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 240px;
      border-radius: 12px;
      background: #f3efe9;
    }
    image-cropper {
      max-height: 52vh;
      padding: 0;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 14px;
    }
    label {
      display: flex;
      flex: 1;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
    }
    input[type='range'] {
      flex: 1;
      accent-color: var(--sp-primary);
    }
    .error {
      padding: 20px;
      color: #8c1d18;
      text-align: center;
    }
  `,
})
export class PhotoDialog {
  protected readonly file = inject<File>(MAT_DIALOG_DATA);
  protected readonly t = inject(I18nService).t;
  private readonly ref = inject(MatDialogRef<PhotoDialog, string>);

  protected readonly zoom = signal(1);
  protected readonly rotation = signal(0);
  protected readonly ready = signal(false);
  protected readonly failed = signal(false);
  protected readonly cropped = signal<string | null>(null);
  protected readonly transform = computed<ImageTransform>(() => ({ scale: this.zoom() }));

  protected onCropped(event: ImageCroppedEvent): void {
    this.cropped.set(event.base64 ?? null);
  }

  protected rotate(): void {
    this.rotation.update((r) => (r + 1) % 4);
  }

  protected apply(): void {
    const data = this.cropped();
    if (data) this.ref.close(data);
  }
}
