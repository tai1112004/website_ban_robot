# i18n implementation

Scope approved by the user: SPEC-i18n.md, five languages, existing routes.

Order: locale registry/context and selector → shared navigation → home/product → shopping/account → robot management → regression and visual checks.

Use explicit translation calls at presentation boundaries. Preserve identifiers, stored snapshots and user input. Keep the provider mounted above existing state providers. English server/initial render matches hydration; restore the saved locale after mount. No new runtime dependency or translation service.

Main risks: untranslated dynamic labels; translating user data accidentally; locale-dependent React keys resetting forms; longer labels overflowing mobile navigation. Verify each with targeted Playwright tests, source review and Chrome screenshots.

No commits or deployment are required for this workspace change.
