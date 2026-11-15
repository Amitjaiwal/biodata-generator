import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { I18nService } from '../core/i18n/i18n.service';
import { EntitlementService } from '../core/services/entitlement.service';

const PAYMENT_ID = /^pay_[A-Za-z0-9]{6,40}$/;

/** Re-issues a purchase on a new device from the Razorpay payment id. */
@Component({
  selector: 'app-restore-dialog',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ t('restore.title') }}</h2>
    <mat-dialog-content>
      <p class="hint">{{ t('restore.hint') }}</p>
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>{{ t('restore.label') }}</mat-label>
        <input
          matInput
          autocomplete="off"
          spellcheck="false"
          placeholder="pay_XXXXXXXXXXXXXX"
          maxlength="44"
          [value]="paymentId()"
          (input)="paymentId.set($any($event.target).value.trim()); failed.set(false)"
          (keydown.enter)="submit()"
        />
      </mat-form-field>
      @if (failed()) {
        <p class="error" role="alert">{{ t('restore.fail') }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>{{ t('common.cancel') }}</button>
      <button matButton="filled" [disabled]="busy() || !valid()" (click)="submit()">{{ t('restore.cta') }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .hint {
      margin-bottom: 14px;
      color: var(--sp-muted);
    }
    mat-form-field {
      width: 100%;
    }
    .error {
      margin-top: 10px;
      color: #8c1d18;
      font-size: 0.9rem;
    }
  `,
})
export class RestoreDialog {
  protected readonly t = inject(I18nService).t;
  private readonly entitlements = inject(EntitlementService);
  private readonly ref = inject(MatDialogRef<RestoreDialog>);
  private readonly snack = inject(MatSnackBar);

  protected readonly paymentId = signal('');
  protected readonly busy = signal(false);
  protected readonly failed = signal(false);

  protected valid(): boolean {
    return PAYMENT_ID.test(this.paymentId());
  }

  protected async submit(): Promise<void> {
    if (this.busy() || !this.valid()) return;
    this.busy.set(true);
    this.failed.set(false);
    try {
      await this.entitlements.restoreByPaymentId(this.paymentId());
      this.snack.open(this.t('restore.ok'), undefined, { duration: 4000 });
      this.ref.close(true);
    } catch {
      this.failed.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
