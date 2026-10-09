# Production email setup

CreatorBridge supports Resend for account verification and password recovery. The local spool remains development-only. No secrets or sample live credentials are committed.

1. Add a domain you own in Resend and install the exact DNS records it supplies. Wait for its verified status. A `vercel.app` address is not your sending domain.
2. Create a Sending Access API key restricted to that domain.
3. In Vercel → creatorbridge → Settings → Environment Variables, add `RESEND_API_KEY` as Sensitive, `EMAIL_PROVIDER=resend` and `EMAIL_FROM=CreatorBridge <no-reply@YOUR-VERIFIED-DOMAIN>` for Production. Configure Preview only if it should send real authentication emails; use separate credentials where possible.
4. Keep `APP_URL=https://creatorbridge-rho.vercel.app` and `ENABLE_DEV_MAIL=false` for this deployment. Redeploy after adding settings.
5. Register your own test account from the application, receive the verification email, click its link and check the dashboard. Then request a password reset for that account, reset the password and confirm that the old link cannot be reused. Check delivery/bounce status in Resend; API acceptance alone does not prove inbox delivery.

Authentication messages have both branded HTML and plain text, one-hour single-use links, bounded provider requests and an idempotency key. Raw provider failures, keys and links are not printed to logs. Failed provider requests remove the new auth token; registration's database transaction rolls back. Provider acceptance and a subsequent database commit are not a distributed transaction: an outbox with delivery webhooks remains recommended for resilient production delivery.

This integration does not yet send campaign updates, marketing messages, support mail or in-app notifications. A separate business mailbox is needed for staff inboxes. Until credentials and a verified sender are supplied, live email remains disabled.
