# Quotation delivery setup

The form and `/api/quote` endpoint validate input locally. Online submission remains disabled in the UI until every server-only setting is present and `QUOTE_FORM_ENABLED=true`:

1. Founder approves the destination mailbox, currently proposed as `sales@africhem-globalz.com`.
2. Verify a sending domain with Resend and set `ENQUIRY_FROM_EMAIL` to an address on that domain.
3. Set `RESEND_API_KEY` and `ENQUIRY_TO_EMAIL` in a private environment file or deployment secret store. Never use `NEXT_PUBLIC_` for these values.
4. Set `QUOTE_FORM_ENABLED=true`, then test invalid input, rate limiting, provider failure and one real email receipt before claiming completion.

The endpoint returns success only when Resend accepts a message and returns an ID. That is provider acceptance, not proof of inbox delivery; actual receipt still needs confirmation. No buyer auto-reply or persistent enquiry database is enabled. The server has a honeypot, same-origin check, 12 KB request cap, field validation and a best-effort in-memory per-IP cooldown. At scale, replace the cooldown with a shared abuse-control store.

Transport uses the documented Resend REST `POST https://api.resend.com/emails` API with a bearer key and server-only `fetch`; no new production dependency was added. See [Resend's official API example](https://resend.com/aws-lambda).
