# Working on the Tectra kit

- Read the README, `vendor/brand/guide/families.md` and `vendor/brand/guide/governance.md`.
  Inspect the working tree and preserve unrelated work. Keep the requested scope clear.
- Preserve the approved Latch geometry, lockups, palette and guidance unless the owner
  explicitly approves changing them. Do not turn an interface improvement into a new
  identity or a product, pricing or availability promise.
- This repository is the Tectra family only. It builds on the Cosmik foundation vendored
  at `vendor/brand/`; shared rules, baseline tokens, controls and fonts belong in
  `cosmiklabs/brand`, not here. Bring shared changes back there with evidence.
- Edit authoritative sources: `tokens/family.json` for token values and
  `assets/latch.source.json` for the marks. Never hand-edit `tokens/tectra.*`,
  `tokens/tectra_tokens.rs` or the SVGs in `assets/`; regenerate them.
- Never edit anything in `vendor/brand/`, including `brand.lock.json`. Update it only with
  `node <brand checkout>/scripts/vendor.mjs sync --from <brand checkout> --into vendor/brand`
  from a clean checkout at a `vX.Y.Z` tag, then rebuild and review the diff.
  Never copy the family contract, generator or contrast pairs into `scripts/`.
- Avoid dependencies. Scripts use Node.js built-ins only. Keep builds deterministic,
  portable and usable offline.
- Run `npm run build` and `npm run check` after source changes; CI also runs
  `node scripts/build.mjs --check` from a clean commit. For visual changes, render
  `specimen.html` in both themes at narrow and wide widths, inspect it and record what
  ran in `validation.md`.
- Keep values in `tokens/family.json`, canonical paths, roles, status and hashes in
  `asset-manifest.json`, and rules in the README. Keep the manifest complete: consumers
  sync from it.
- Record verification honestly: distinguish written tests, executed checks and visual
  inspection. Do not claim accessibility certification.
- Review the final diff and generated changes. Do not add credentials, private
  screenshots, personal paths or test artifacts to tracked files.
- Commit, tag, publish or push only when authorized. Do not bump the family version or
  describe unreleased work as a release without an actual release.
