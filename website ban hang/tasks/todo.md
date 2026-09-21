# i18n tasks

- [x] Foundation and navigation: locale switching, persistence, invalid/blocked storage fallback; focused i18n test and typecheck.
- [x] Home and product content: all five dictionaries, media labels and responsive layout; product/home tests.
- [x] Shopping/account: translated validation, dates and prices; preserve input and snapshots; cart/checkout/account/order tests.
- [x] Robot management: translate catalogs and feedback at display boundaries, retain device settings; robot tests.
- [x] Completeness, full regression, build and browser screenshots; document verification and limitations.

## Verification — 2026-09-21

- `npm run typecheck`: passed.
- `npm run build`: passed, all 12 static pages generated and dynamic routes compiled.
- Full Playwright regression: 71 passed; the new dictionary assertion incorrectly required identical line-break counts across languages. Updated it to validate balanced emphasis and allowed markup while permitting locale-specific line breaks. Reran that test: 1 passed. No outstanding failing test; existing tests were not weakened or skipped.
- Catalog: 905 messages, four translations per English key; literal translation calls, heading messages, interpolation variables and markup checked.
- Browser checks: all eight principal routes in all four translated locales at 390px, plus existing desktop/tablet/mobile regression coverage. Reviewed mobile screenshots for font rendering and navigation. Fixed the mobile product link and disambiguated website language from robot voice language.
- Source review: user data and stored IDs remain untranslated; no HTML injection or translation API; locale changes preserve form drafts; storage failure retains in-memory selection. `git diff --check` passed.
- Scope limits: shared URLs/server metadata, original text/audio embedded in media, and unknown future API copy remain unchanged, as documented in README. Real iOS/Safari devices were not tested.
