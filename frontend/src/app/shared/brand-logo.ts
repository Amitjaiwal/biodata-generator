import { ChangeDetectionStrategy, Component } from '@angular/core';

/** ShubhPatra mark and wordmark. */
@Component({
  selector: 'app-brand-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="mark" viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#B3261E" />
      <g fill="#fff">
        <path d="M20 30C14.5 24 15 15 20 8C25 15 25.5 24 20 30Z" />
        <path d="M20 30C14.5 24 15 15 20 8C25 15 25.5 24 20 30Z" transform="rotate(-34 20 30)" opacity=".8" />
        <path d="M20 30C14.5 24 15 15 20 8C25 15 25.5 24 20 30Z" transform="rotate(34 20 30)" opacity=".8" />
        <path d="M20 30C14.5 24 15 15 20 8C25 15 25.5 24 20 30Z" transform="rotate(-66 20 30)" opacity=".55" />
        <path d="M20 30C14.5 24 15 15 20 8C25 15 25.5 24 20 30Z" transform="rotate(66 20 30)" opacity=".55" />
      </g>
      <circle cx="20" cy="31.5" r="2" fill="#F2CF63" />
    </svg>
    <span class="word">Shubh<b>Patra</b></span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .mark {
      width: 34px;
      height: 34px;
      flex: none;
    }
    .word {
      color: var(--sp-ink);
      font-family: var(--sp-display);
      font-size: 1.35rem;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    b {
      color: var(--sp-primary);
      font-weight: 600;
    }
  `,
})
export class BrandLogo {}
