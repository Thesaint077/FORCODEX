# CreatorBridge · first booking milestone

A runnable, persistent Nigerian creator–brand marketplace. This is a **sandbox development application**, not a live financial service. The attached PRD was read before implementation; its original PDF is included in `docs/CreatorBridge_PRD.pdf`. The approved logo is used unaltered at `public/creatorbridge-logo.png`.

## Run locally

Use Node.js 24 LTS and npm. From this directory:

```sh
npm ci
cp .env.example .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://localhost:3000. Keep `APP_URL` equal to the origin you actually use. By default the application uses persistent PostgreSQL via PGlite in `.data/postgres`; do not run multiple application processes against this local directory. Stop the dev server before database scripts or tests that use the same directory. The test suites use their own databases.

For an external PostgreSQL instance, set `DATABASE_URL` in `.env.local`, then run migrations and seeds. This uses `pg` and the same SQL schema. Configure TLS and certificate validation appropriate to your managed PostgreSQL provider. The external PostgreSQL adapter was implemented but was not exercised against a remote database in this environment.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

The production build compiles successfully. `npm start` is a build preview, not a production launch: local file uploads and development mail deliberately remain disabled when `NODE_ENV=production`. A real deployment must provide approved storage/mail integrations, managed PostgreSQL and launch controls. Do not treat `ALLOW_LOCAL_ADAPTERS=true` as launch approval.

## Environment

See `.env.example`; no secrets are included.

| Variable | Purpose |
| --- | --- |
| APP_URL | Exact trusted application origin used for mutation checks and email links |
| APP_MODE | `sandbox` enables explicitly simulated money; all other values disable collections/payouts |
| DATABASE_URL | External PostgreSQL connection string; leave blank for local PGlite |
| LOCAL_DATABASE_PATH | Persistent local development PostgreSQL directory |
| STORAGE_PATH | Private development assets directory, outside `public` |
| ALLOW_LOCAL_ADAPTERS | Explicit local database build-preview opt-in; never enables production uploads |
| ENABLE_DEV_MAIL | Writes development-only verification/reset messages to `.data/mail` |
| BOOKING_FEE_BPS | Brand fee in basis points; proposed 1500 = 15% |
| FEE_VERSION | Version frozen into the accepted quote/contract |

## Fictional development accounts

All seed accounts use password **CreatorBridge!2026**. Never run the demo seed on a production database.

| Email | Role |
| --- | --- |
| brand@demo.creatorbridge.test | Studio Kora brand owner |
| creator@demo.creatorbridge.test | Ada, content production creator |
| tunde@demo.creatorbridge.test | Tunde, sponsored content creator |
| zainab@demo.creatorbridge.test | Zainab, fashion creator |
| ops@demo.creatorbridge.test | Operations reviewer |
| other@demo.creatorbridge.test | Owner of a separate isolated workspace |

These are visibly fictional records, with sandbox participation review rather than identity-verification claims. New registrations require onboarding and email confirmation. Find verification/recovery links in `.data/mail` during development; no real email is sent. An operations user can review creator and brand participation, with a recorded reason, to enable sandbox bookings.

## Complete the first booking

1. Sign in as the brand. Create and save a brief, then publish it.
2. In a separate browser session, sign in as the creator. Open the published brief and submit an itemised proposal with rights terms.
3. Brand accepts the proposal. The booking freezes the brief, quote, fee version, rights, one delivery milestone and two included revision rounds.
4. Both parties explicitly accept the same contract snapshot. Download its JSON record and SHA-256 hash from the booking.
5. Brand confirms **simulated** funding. Work can now be submitted.
6. Creator submits notes and optionally a private PDF, MP4, JPEG or PNG, up to 25 MB.
7. Brand requests an included revision or accepts the latest submitted version.
8. Operations records a **simulated** compliance review. It is not ARCON or legal clearance.
9. Brand simulates payout. The creator receives no real money. The booking displays funding, delivery, compliance and payout separately.

For a ₦150,000 creator quote, the proposed brand fee is ₦22,500 and the brand total is ₦172,500. No tax deductions are invented. Monetary records use integer kobo. Transactional row locks, unique event constraints and idempotency keys prevent repeated funding/payout; a balanced sandbox ledger records each event once.

## Architecture and decisions

- Next.js App Router, TypeScript, React and Tailwind/PostCSS, with a restrained green/ivory/gold editorial interface. Server-rendered dynamic pages fetch persistent data; client forms call validated server endpoints.
- PostgreSQL schema in `migrations/001_initial.sql`. PGlite makes development runnable without credentials; `pg` supplies external PostgreSQL. Migration history makes repeat migration safe.
- Authentication uses salted scrypt passwords, hashed opaque sessions, expiry, HttpOnly cookies, origin checks and persisted rate limits. Recovery tokens are hashed, expire after an hour and can be used once. Password recovery revokes existing sessions. There is no Google sign-in or MFA in this milestone.
- Workspace membership authorisation runs on the server for every protected operation, including guessed booking/asset IDs. Roles are owner, editor, approver, finance and viewer. The UI currently provides owner onboarding; membership invitations and role-management screens are next work.
- An accepted contract is an immutable snapshot. Funding, delivery, compliance and payout have independent database fields. Submission/revision actions validate transitions transactionally.
- Files live outside public assets. Downloads re-check booking authorisation on each request and send private/no-store headers. Local storage is development-only; no cloud credentials are assumed. MIME/magic validation is not a substitute for malware scanning.
- All financial events are sandbox ledger simulations. No provider checkout, escrow, real collections, real payouts or tax treatment is implemented. Production financial actions fail closed.
- Operations access to engagement records is disclosed in the interface. Identity documents and bank details are not collected in this milestone.

## Verification

`npm test` covers workspace isolation, operations restrictions, frozen fees, state transitions, balanced integer-money records, duplicate/concurrent financial requests and production money blocking. `node scripts/browser-check.mjs` runs a separate seeded database and Chromium verification, saving screenshots and a summary to `test-results`. Stop other dev servers before running it. It can use bundled Chromium on compatible Linux, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a compatible browser binary. It deletes only `.data/browser-db` on each run.

See `docs/VERIFICATION.md` for recorded results and `docs/PRD_COVERAGE.md` for requirement-level coverage. Browser test recordings are not invented customer performance evidence.

## Next milestone and launch limits

Prioritise production readiness before live campaigns: approved payment-partner/legal model; verified hosted checkout and webhook reconciliation; production private storage with scanning, resumable uploads and signed downloads; transactional mail; provider-backed identity/business/bank checks; legal contract/disclosure/ARCON review; MFA and risk controls; monitoring, backups and independent security/accessibility review.

Also pending: role-management/invitations, full audience evidence, shortlists, shipping tracking, granular multi-milestone payments, counteroffer versions, timestamped video feedback, dispute resolution/refunds, notification centre, reporting/UTMs, publication proof and privacy export/deletion. The current exception action pauses a booking for operations; it does not resolve or refund it. The coverage table distinguishes partial implementations from the full PRD.

## Production authentication email

The Resend adapter for verification and password recovery is implemented. Follow `docs/EMAIL_SETUP.md` to configure a verified sending domain, `EMAIL_PROVIDER`, `EMAIL_FROM` and a Sensitive `RESEND_API_KEY` in Vercel. Until those settings are supplied, live email remains disabled. Integration tests exercise provider success/failure and configuration safety without sending real email.

## Profile identity, search and appearance

Creator profile editing now saves the display name and optional unique username in the same transaction as profile details. Account settings at `/settings` let brands and creators update these details. Handles use 3–30 letters, numbers or underscores and are case-insensitive. Existing accounts can add a username; emails remain private.

`/discover` searches public creators and opt-in brands by name or username, with account-type filters. Creator discovery also has a name/username search. Brands must enable directory visibility and add a username in Account settings before appearing; brand pages show published brief summaries only. Private profiles, internal operations accounts and private workspace records are excluded.

Migrations now run in filename order and skip versions recorded in migration history. Apply `npm run db:migrate` before deploying this update; `002_usernames.sql` adds nullable usernames, a unique index and a default-private brand directory flag without replacing existing data.

The interface follows `prefers-color-scheme` automatically. Dashboard booking KPIs use larger, high-contrast cards. Entrance and hover motion honours `prefers-reduced-motion`. `tests/identity.test.ts` verifies username uniqueness, own-account updates and public-directory privacy; `node scripts/upgrade-browser-check.mjs` covers the booking workflow, profile edits, directory consent, light/dark modes and layouts at 360, 390, 768, 1024 and 1440 pixels. Browser checks use fictional isolated data.
