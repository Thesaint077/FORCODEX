# Verification · 9 October 2026

## Automated checks

- ESLint: passed.
- TypeScript `tsc --noEmit`: passed.
- `next build --webpack`: passed; application and protected route handlers compile.
- `npm test`: **12 passed, 0 failed**. Tests use a real isolated PostgreSQL engine via PGlite rather than mocked database screens.

Test evidence covers role permissions, cross-workspace access and private drafts, operations restrictions, accepted quote/fee freezing, repeated acceptance, signature prerequisite, concurrent/repeated funding, balanced accounting, payout delivery/compliance prerequisites, repeated payout and disabled production financial actions.

## Chromium workflow

`npm run test:browser` passed using independent brand, creator, operations and unrelated-workspace browser contexts. Verified:

1. Saved a persistent draft, denied creator access before publishing, edited and published it.
2. Submitted an itemised creator proposal and accepted it into an immutable booking.
3. Denied unrelated workspace viewing and financial action.
4. Recorded both contract acceptances and simulated funding; duplicate funding did not create a second event.
5. Uploaded a private PDF and submitted version 1; the brand could download it and an unrelated workspace could not.
6. Requested a revision, submitted version 2 and accepted it.
7. Recorded an explicitly simulated operations compliance review and payout; duplicate payout remained idempotent.
8. Allowed authorised contract download and denied unrelated access.
9. Logged out and confirmed protected-dashboard redirection to login.
10. Registered and onboarded a new fictional creator, confirmed email via development mail, recovered the account and rejected recovery-token replay.
11. Checked landing and creator discovery at 360 pixels with no horizontal overflow. Captured desktop, completed-booking, dashboard and mobile screenshots and visually inspected representative renders.
12. Reopened the persistent database in a separate process and confirmed the completed booking and exactly two financial events remained.

Screenshots and the machine-readable browser summary are included in `test-results`. Browser transport checks account for Next.js streamed not-found pages: those may return HTTP 200 after streaming begins, but protected content is replaced with the generic unavailable screen. Asset/contract API access failures return explicit denied statuses. Server authorisation tests separately verify that private data cannot be fetched by another workspace.

## Limits of these checks

External managed PostgreSQL was not available for adapter verification. Live payment, identity, storage, mail and regulatory providers are intentionally absent. Browser testing is not an independent security audit, load test or full WCAG certification. Test data, PDF fixture and verification reviews are fictional. All financial records are simulations; no real money moved.
