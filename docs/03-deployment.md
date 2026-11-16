# Deploying the backend and connecting payments

The website is static files on Cloudflare. Payments need the Java backend running online, with a
PostgreSQL database. This guide uses Neon (database) and Render (backend). Both have free tiers.

Never paste a Razorpay secret into a file that git tracks, into chat, or into a prompt. Real values
go only in `backend/.env` on your computer and in the hosting dashboards.

## 0. Before you start

- Razorpay **test keys** work with the steps below. Do everything in test mode first.
- Test payments: do not scan the UPI QR with a real app. In test mode use a test card or a test UPI
  ID from Razorpay's "test card details" documentation.

## 1. Database (Neon)

1. Sign up at neon.tech and create a project. Choose a region close to your users, such as Singapore.
2. Open the connection details. Choose the **direct** connection (turn Connection pooling off). The
   database migration works more reliably without a pooler.
3. Neon shows an address like
   `postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require`. Split it into three settings:

```
DATABASE_URL=jdbc:postgresql://HOST/DBNAME?sslmode=require
DATABASE_USERNAME=USER
DATABASE_PASSWORD=PASSWORD
```

Leave out `channel_binding=require` if the address contains it.

## 2. Backend (Render)

1. Sign up at render.com. Choose New, then Web Service, and connect the GitHub repository.
2. Settings:
   - Root directory: `backend`
   - Runtime: Docker (the Dockerfile is already there)
   - Region: the same region as the database if possible
   - Health check path: `/actuator/health`
3. Environment variables (Environment tab). Type the values in yourself:

| Name | Value |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | from step 1 |
| `DATABASE_USERNAME` | from step 1 |
| `DATABASE_PASSWORD` | from step 1 |
| `RAZORPAY_KEY_ID` | test Key ID, later the live one |
| `RAZORPAY_KEY_SECRET` | its Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | random text you choose, reused in step 4 |
| `APP_ENTITLEMENT_SECRET` | random 64 characters, see below |
| `APP_CORS_ALLOWED_ORIGINS` | `https://marriagesbiodatamaker.com,https://www.marriagesbiodatamaker.com` |

Generate a random value for the two secrets with:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Deploy. When it finishes, open `https://YOUR-SERVICE.onrender.com/api/config/pricing`. It should
   show both prices and `"demoMode":false`.

The free plan sleeps when idle. The first payment after a quiet period can take up to a minute.

## 3. Connect the website (Cloudflare)

1. Open your Worker, then Settings, then Build, then Variables and secrets (build variables).
2. Add `API_BASE_URL` with the value `https://YOUR-SERVICE.onrender.com/api`. It must be https and
   end in `/api`. It is not a secret.
3. Trigger a new build. The build script writes the address into the site.

## 4. Webhook (Razorpay)

1. Razorpay dashboard, in the same mode as your keys, then Developers, then Webhooks, then Add.
2. URL: `https://YOUR-SERVICE.onrender.com/api/payments/webhook`
3. Secret: the same text as `RAZORPAY_WEBHOOK_SECRET`.
4. Events: `payment.captured` and `order.paid`.

## 5. Test online

1. On `https://marriagesbiodatamaker.com/create` choose a premium template, click Download PDF, then
   Pay.
2. Pay with a test card. The watermark should disappear and the PDF should download.
3. In the Razorpay dashboard, the payment should appear under Transactions in test mode.

## 6. Go live

1. Wait until Razorpay has activated your account.
2. In Live mode generate live keys. In Render replace `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
   with the live values, and create a separate webhook in Live mode with a new secret.
3. Make one real payment of Rs 49 yourself, then refund it from the dashboard.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Payments are unavailable" | Backend asleep or unreachable, wrong `API_BASE_URL`, or Razorpay rejected the keys. Open `/api/config/pricing` on the backend address first. |
| Browser console shows a CORS error | `APP_CORS_ALLOWED_ORIGINS` does not list the exact address of the site, including `https://`. |
| Backend log says Authentication failed | Key ID and Key Secret are not from the same Razorpay key pair, or test and live are mixed. |
| Payment succeeded but the design is locked | Check that the webhook is delivered. The buyer can use Restore purchase with the payment ID. |
| Backend fails at startup | Read the first error in the Render log. A missing variable is named in the message. |
