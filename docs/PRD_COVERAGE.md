# PRD coverage · milestone 1

Source: attached CreatorBridge Nigeria PRD, included as `CreatorBridge_PRD.pdf`. This table uses its actual IDs. “Partial” does not mean the complete acceptance criteria have passed. This delivery is sandbox-only.

| ID | Milestone implementation | Remaining PRD scope |
| --- | --- | --- |
| IAM-01 | Server-enforced workspace membership; owner/editor/approver/finance/viewer permissions; isolation tests | Invitation, member/role management UI; expanded policy review |
| ACC-01 | Registration/login/logout, email-token verification and one-use account recovery; session revocation on recovery | Live email provider, optional Google sign-in, phone workflow |
| VER-01 | Operations queue and reasoned sandbox participation decisions | Actual provider identity, CAC, bank-name verification and appeals |
| PRO-01 | Persistent bio, city, category, service, languages, availability, rates, portfolio links and public consent | Rich media portfolio uploads and audience geography |
| DIS-01 | Production/distribution, category, budget, location and language filters; no follower threshold | Format/availability filters and assisted matching |
| BRF-01 | Create/edit/publish persistent briefs; server draft save and local form backup | Complete shipping inputs, reconnect indicators and server autosave for incomplete drafts |
| BRF-02 | Channels, territory, term, paid use, exclusivity, raw-file and renewal fields frozen into contract | Legally reviewed rights model and amendments |
| PRP-01 | Itemised production/publishing/rights/expenses; gross, configurable fee and total | Separate travel field and approved charge/tax determination |
| PRP-02 | Seven-day quote expiry; accepted fee version and quote frozen; duplicate acceptance safe | Negotiated expiry/counteroffer version workflow |
| MSG-01 | Persistent timestamped booking messages; disclosed operations access | Message attachments, moderation/reporting and notifications |
| CTR-01 | Readable booking contract snapshot, hash, version, authorised dual acceptance and protected JSON export | Legally reviewed full template and electronic signature evidence review |
| CTR-02 | One visible delivery milestone, two revisions and review/cancellation text | Multiple milestone schedule, configurable approval criteria, shipping/cancellation calculations |
| CTR-03 | Contract explains licence activation conditions and preview limits | Enforced licences tied to real collections and clearance evidence |
| STA-01/02 | Transaction-checked booking journey and separate funding/delivery/compliance/payout states | Provider pending/failure/reconciliation and complete dispute/refund branches |
| PAY-03 | Integer kobo, balanced sandbox ledger, immutable event constraints and duplicate/concurrency tests | Real collection/settlement/chargeback accounting and reconciliation |
| PAY-05 | Sandbox payout requires funded, accepted delivery and recorded simulated compliance review | Actual provider settlement, bank verification and independent risk approval |
| AST-01 | Private development uploads, MIME/magic checks, 25 MB limit, authorised downloads | Resumable 500 MB media, audio/MOV, virus scanning, cloud adapter |
| REV-01/02 | Versioned submissions, text feedback, remaining included revisions and next actions | Timestamped video annotations, SLA reminders and consolidated comments |
| CMP-01 | Separate compliance state; operations reason; visibly simulated clearance | Full checklist and qualified advertising/regulatory reviewer |
| HND-01 | Every file/contract download checks authorised booking membership; private no-store response | Expiring cloud links, licence gating and publication evidence |
| DSP-01 | Reasoned exception opening pauses affected booking | Evidence/amount/milestone scope and full adjudication/refund workflow |
| UX-01/02 | Responsive public/account/creator/brand/booking journeys; dashboard next actions | Broader assistive-device and all-screen mobile review |
| UX-03 | NGN gross/brand fee/total; clear pending/funded/paid; no invented tax | Approved production tax/charge treatment |
| UX-04 | Labelled controls, keyboard focus, skip link and feedback states | Independent WCAG 2.2 AA audit; not claimed certified |
| UX-05 | Local brief backup and explicit server draft save | Server autosave, compressed previews, reconnect/upload progress |
| SEC-02 | Password/session/token hashing, origin checks, rate limits, session expiry/revocation and server authorisation | Managed secrets/encryption, MFA, infrastructure controls and independent ASVS audit |
| PRV-01 | Public-profile consent, private campaign assets, no identity-document collection | Full privacy notices, consent history, retention/legal review |

## Deferred IDs

DIS-02/03, LOG-01, PAY-01/02/04/06, AST-02, DSP-02, REF-01/02, RSK-01, MOD-01, MET-01 through MET-06, UX-06, SEC-01, PRV-02 and ADV-01/02 remain outside the completed milestone, except transparent explanatory copy where relevant. No completed verification, regulatory approval, provider integration or full international compliance is claimed.

## Recommended next milestone

Create a reviewed production-control foundation: approved payment arrangement, hosted checkout/webhook verification, reconciliation, private cloud assets/scanning, email, identity/business/bank providers, legal contract/ARCON gates, auditability, MFA, backups and monitoring. Follow with richer collaboration, audience evidence, notifications, dispute/refund handling and reporting. Keep live payments disabled until that foundation passes review.
