# Project memory

## Product intent & audience

- Product: "Fikrado Security" — security software with malware & vulnerability scanning, CLI and Desktop App editions.
- Audience focus: individual users with single licenses ($20/month). Enterprise/team tier and paid support add-on were removed and should stay removed.
- Market appears to be East/Somali region given Mobile Money USSD payment (*880*0634048063*8#).

## Brand personality & voice

- Direct, practical, product-focused; CTAs are action-oriented ("Deploy", "Dial to Pay").

## Visual design & UX direction

- Vite + React frontend; CSS kept in `styles.css`.
- License cards use inline pricing: strike-through original price next to discounted price, plus a green discount badge showing percentage and date.
- Pricing UI should avoid multi-tier/checkout-heavy layouts; keep payment simple (Mobile Money dial-to-pay band).
- Responsive and build-verified (Vite build passes after changes).

## Decisions, constraints & rationale

- Removed Enterprise ($4,000/year) and Extra Support ($90/session) cards from Softwares page.
- Removed full checkout section (credit card + mobile money modal/receipt flow); credit card marked "Coming Soon".
- Single license discount rotates daily between 10%, 20%, 30%, 40%, 50% based on day-of-year, so price changes automatically each day.
- Kept Mobile Money quick-pay dialer CTA and bottom contact section.

## Open questions & assumptions

- Assume daily discount logic should remain deterministic by date (not random per visit).
- Whether discount should also apply to annual billing or only monthly is unspecified.
- No authoritative `.bolt/prompt` exists yet; global instructions may be added later.