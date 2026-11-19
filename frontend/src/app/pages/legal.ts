import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LEGAL_UPDATED, SUPPORT_EMAIL } from '../core/data/site';
import { SeoService } from '../core/services/seo.service';

export type LegalDoc = 'privacy' | 'terms' | 'refund' | 'contact';

const META: Record<LegalDoc, { title: string; description: string; path: string }> = {
  privacy: {
    title: 'Privacy Policy | ShubhPatra',
    description: 'How ShubhPatra handles your data: biodata details and photos stay in your browser and are not uploaded.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms of Use | ShubhPatra',
    description: 'The terms that apply when you use the ShubhPatra marriage biodata maker.',
    path: '/terms',
  },
  refund: {
    title: 'Refund and Cancellation Policy | ShubhPatra',
    description: 'When and how refunds are given for premium marriage biodata templates on ShubhPatra.',
    path: '/refund-policy',
  },
  contact: {
    title: 'Contact | ShubhPatra',
    description: 'Get in touch with ShubhPatra for help with your biodata, payments or feedback.',
    path: '/contact',
  },
};

/** Privacy, terms, refund and contact pages. Written in plain English. */
@Component({
  selector: 'app-legal',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="container prose page">
      @switch (doc) {
        @case ('privacy') {
          <h1>Privacy Policy</h1>
          <p class="muted">Last updated: {{ updated }}</p>
          <p>
            A marriage biodata holds personal information about you and your family. ShubhPatra is built so that this
            information stays with you.
          </p>

          <h2>Your biodata stays on your device</h2>
          <ul>
            <li>Everything you type into the builder, and the photo you upload, is processed inside your browser.</li>
            <li>It is saved in your browser's local storage so you can continue later on the same device.</li>
            <li>We do not upload, store or read your biodata details or your photo on our servers.</li>
            <li>The PDF is generated on your device and downloaded directly to it.</li>
          </ul>

          <h2>How to delete your data</h2>
          <p>
            Choose "Start over" in the builder to erase the saved biodata and photo, or clear this site's data in your
            browser settings. Because we never receive your biodata, there is nothing for us to delete on our side.
          </p>

          <h2>What we store when you pay</h2>
          <p>
            If you buy a premium design, our payment partner Razorpay collects and processes your payment details. We
            do not see or store card numbers, UPI IDs or bank details. Our server keeps a minimal record of the order:
            the Razorpay order and payment IDs, the product bought, the amount, the status and the time. We use it only
            to unlock your purchase, to restore it on another device and to keep accounts as required by law.
          </p>

          <h2>Purchase tokens</h2>
          <p>
            After a successful payment we store a signed purchase token in your browser. It contains no personal
            information. It is sent to our server only to confirm that a premium download is allowed.
          </p>

          <h2>Fonts and third parties</h2>
          <p>
            Fonts are loaded from Google Fonts, and the checkout is loaded from Razorpay when you choose to pay. These
            providers receive standard technical information such as your IP address. We also use the Google tag to
            measure whether visitors who arrive from our Google Ads go on to buy a premium design. It may set
            cookies for this purpose. We do not send your biodata details to Google, and we do not sell personal
            data.
          </p>

          <h2>Children</h2>
          <p>ShubhPatra is intended for adults. Please do not use it to create a biodata for anyone under 18.</p>

          <h2>Changes and contact</h2>
          <p>
            We will update this page if our practices change. For any privacy question, write to
            <a [href]="'mailto:' + email">{{ email }}</a
            >.
          </p>
        }
        @case ('terms') {
          <h1>Terms of Use</h1>
          <p class="muted">Last updated: {{ updated }}</p>
          <p>By using ShubhPatra you agree to these terms. Please read them along with our <a routerLink="/privacy">Privacy Policy</a>.</p>

          <h2>The service</h2>
          <p>
            ShubhPatra is an online tool for creating marriage biodata documents. It is not a matrimony or matchmaking
            service, and it does not verify, publish or share any biodata.
          </p>

          <h2>Your content</h2>
          <ul>
            <li>You are responsible for the accuracy of the details and for having the right to use the photo you add.</li>
            <li>Only create a biodata for yourself, or for a family member who has agreed to it.</li>
            <li>Do not use the service for anything unlawful, misleading or harmful to others.</li>
          </ul>

          <h2>Templates and ownership</h2>
          <p>
            The designs, artwork and software belong to ShubhPatra. You may use the biodata you create for personal,
            non-commercial purposes, including printing and sharing it with families. You may not resell or redistribute
            the templates themselves.
          </p>

          <h2>Premium purchases</h2>
          <p>
            Premium designs are unlocked by a one-time payment through Razorpay. Access lasts for the period shown at
            the time of purchase and is tied to the browser used, with the option to restore it on another device using
            your payment ID. Refunds are covered by our <a routerLink="/refund-policy">Refund Policy</a>.
          </p>

          <h2>Availability and liability</h2>
          <p>
            We work to keep the service running well, but it is provided as is, without warranties. Because your biodata
            is stored only in your browser, please keep a copy of your PDF. To the extent permitted by law, our liability
            is limited to the amount you paid us in the previous twelve months.
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of India.</p>

          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to <a [href]="'mailto:' + email">{{ email }}</a
            >.
          </p>
        }
        @case ('refund') {
          <h1>Refund and Cancellation Policy</h1>
          <p class="muted">Last updated: {{ updated }}</p>
          <p>
            You can preview every premium design with your own details before paying, so you know exactly what you are
            buying. Premium designs are digital goods delivered instantly.
          </p>

          <h2>When we refund</h2>
          <ul>
            <li>You were charged but the design was not unlocked, and restoring the purchase did not help.</li>
            <li>You were charged more than once for the same purchase.</li>
            <li>A technical fault on our side prevented you from downloading the PDF and we could not fix it.</li>
          </ul>

          <h2>When we do not refund</h2>
          <ul>
            <li>The PDF has been downloaded successfully and works as shown in the preview.</li>
            <li>A change of mind after the design has been unlocked.</li>
          </ul>

          <h2>How to ask for a refund</h2>
          <p>
            Email <a [href]="'mailto:' + email">{{ email }}</a> within 7 days of the payment with your Razorpay payment
            ID (it starts with pay_). Approved refunds are returned to the original payment method, usually within 5 to
            7 working days.
          </p>

          <h2>Cancellations</h2>
          <p>There are no subscriptions or recurring charges, so there is nothing to cancel.</p>

          <h2>Delivery</h2>
          <p>
            There is no physical delivery. Premium access is activated in your browser immediately after a successful
            payment, and the PDF is downloaded directly to your device.
          </p>
        }
        @case ('contact') {
          <h1>Contact</h1>
          <p>We are happy to help with your biodata, a payment or a suggestion for a new design.</p>

          <h2>Email</h2>
          <p>
            Write to <a [href]="'mailto:' + email">{{ email }}</a
            >. We usually reply within two working days.
          </p>

          <h2>For payment questions</h2>
          <p>
            Please include your Razorpay payment ID (it starts with pay_) so we can find your order quickly. You can
            also restore a purchase yourself from the <a routerLink="/pricing">pricing page</a>.
          </p>

          <h2>Please do not send your biodata</h2>
          <p>
            We never need your biodata or photo to help you. To protect your privacy, please do not attach them to your
            email.
          </p>
        }
      }
    </article>
  `,
  styles: `
    .page {
      padding-top: 48px;
      padding-bottom: 80px;
    }
    li {
      margin: 6px 0;
    }
  `,
})
export class Legal {
  protected readonly doc = inject(ActivatedRoute).snapshot.data['doc'] as LegalDoc;
  protected readonly email = SUPPORT_EMAIL;
  protected readonly updated = LEGAL_UPDATED;

  constructor() {
    inject(SeoService).set(META[this.doc]);
  }
}
