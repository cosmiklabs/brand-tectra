# Changes

The Tectra family's version is `version` in `tokens/family.json`; this repository's
`package.json` and `asset-manifest.json` carry the same version. Newest first.

## 0.4.0 · 25 October 2026

- **Foundation `cosmiklabs/brand` v0.14.0** (commit
  `e5259977583505abb4f593012571a71eaa39ef0a`). Glass is clearer (60 % tint,
  24px blur, 1.4 saturation) and comes in two tones: `data-glass-tone="dark"`
  or `"light"` gives a surface that mode's roles, and each tone is checked over
  the content its tone is for, either side of a published threshold. The
  baseline token version is now 0.9.0, so `extends` is
  `"Cosmik baseline 0.9.0"`. See the foundation's changelog.
- **Tectra glass tones.** Dark: the Tectra dark surface `#172125` at 60 %, a
  `#F2F6F5` hairline and `#C9D7D3` muted text. Light: the baseline white tint, a
  `#0F1719` hairline and `#2E423E` muted text (Tectra's light text `#142925` is
  lighter than the baseline's black, so its muted text must be darker). Over each
  tone's band: dark text 7.46:1, muted 5.60:1, focus 4.79:1, boundary 3.20:1;
  light text 7.48:1, muted 5.23:1, focus 3.12:1, boundary 3.46:1.

## 0.3.0 · 25 October 2026

- **Foundation `cosmiklabs/brand` v0.13.0** (commit
  `9985a274113c74bdf8b80d5011f9045634cfd31e`), synced with its `vendor.mjs`. It
  adds glass roles (`glass`, `glass-border`, `glass-muted`), baseline-only glass
  blur and saturation tokens, glass contrast checks over any backdrop and opt-in
  glass controls (`c-glass`, `c-toolbar--glass`, `c-button--glass`,
  `c-segmented--glass`, `c-select--glass`). The baseline token version is now
  0.8.0, so `extends` is `"Cosmik baseline 0.8.0"`. See the foundation's changelog.
- **Tectra glass roles.** The baseline's neutral glass would sit grey among
  Tectra's mineral surfaces, so the family sets its own: dark glass is the Tectra
  dark surface `#172125` at 84 % with a `#CDDAD6` hairline and the Tectra dark
  muted text; light glass keeps the baseline's white tint with a `#22342F`
  hairline and a `#455D57` muted text (the Tectra light muted `#4D6761` is too
  light over glass on black, 4.21:1). Over any backdrop: dark text 8.81:1, muted
  5.22:1, boundary 3.08:1; light text 10.52:1, muted 4.89:1, boundary 3.18:1.
- No other token value or mark changes.

## 0.2.6 · 25 October 2026

- **Foundation `cosmiklabs/brand` v0.12.2** (commit
  `91ecddeab47f9380a6e6727b3c0611a3073ad520`), synced with its `vendor.mjs`. Its
  controls apply hover treatments only under `(hover: hover)`, so a tap on a touch
  screen no longer leaves a control looking hovered. See the foundation's changelog.
- No Tectra token value or mark changes. Generated tokens differ only in the
  version and the provenance header.

## 0.2.5 · 25 October 2026

- **Foundation `cosmiklabs/brand` v0.12.1** (commit
  `71fcd97f6342090f7b189e333a04a94af0d32d02`), synced with its `vendor.mjs`. It fixes 0.12.0's `c-segmented`, whose
  options collapsed below their labels in a shrink-to-fit container, and lets
  `c-toolbar` wrap rather than overflow. See the foundation's changelog.
- No Tectra token value or mark changes. Generated tokens differ only in the
  version and the provenance header.

## 0.2.4 · 25 October 2026

- **Foundation `cosmiklabs/brand` v0.12.0** (commit
  `5c62fc7e1bd012a89061142d87ad64947ae6edd9`), synced with its `vendor.mjs`. Its
  shared controls add `c-toolbar`, `c-button--quiet`, `c-button--icon`, pressed
  toggles (`c-button[aria-pressed]`) and `c-segmented`: a bordered toolbar surface,
  square icon-only buttons at the dense or touch target, and one-of-a-few choices
  whose options share one width. Selection uses the selected roles plus a drawn
  bar. See the foundation's changelog.
- No Tectra token value or mark changes. Generated tokens differ only in the
  version and the provenance header; the baseline token version is still 0.7.0, so
  `extends` is unchanged.

## 0.2.3 · 24 October 2026

- **Foundation `cosmiklabs/brand` v0.11.0** (commit
  `1a7d5c392dd6926eaa8625c496a707de1a4b4d1b`), synced with its `vendor.mjs`. Its
  shared controls add `c-status--dense`: the status pill, roles and `label` family,
  tracking and case at the `ui-small` size with tighter padding, for dense rows,
  headers and cards. `c-status` is unchanged. See the foundation's changelog.
- No Tectra token value or mark changes. Generated tokens differ only in the
  version and the provenance header; the baseline token version is still 0.7.0, so
  `extends` is unchanged.

## 0.2.2 · 24 October 2026

- **Foundation `cosmiklabs/brand` v0.10.0** (commit
  `c3bf1a7b2e34ff764a069e96c5c86ff29316f7b4`), synced with its `vendor.mjs`. Its
  shared controls change: `c-status` now reads as a label (the `label` type role, a
  pill shape, no interaction affordance); `c-select--dense` and `c-input--dense`
  add dense fields that return to the standard target and body size on touch; and
  `c-button--large` adds a taller call-to-action button. See the foundation's
  changelog at `vendor/brand/CHANGELOG.md`.
- No Tectra token value or mark changes. Generated tokens differ only in the
  version and the provenance header; the baseline token version is still 0.7.0, so
  `extends` is unchanged.

## 0.2.1 · 24 October 2026

- **Consumers sync this repository with one tool.** Products run
  `node <brand-tectra>/vendor/brand/scripts/vendor.mjs sync --from <brand-tectra> --into vendor/brand-tectra`
  from a release tag, then `verify vendor/brand-tectra`, which checks this release
  and the vendored foundation inside it. This replaces copying files and checking
  hashes by hand. See the README's "Consume this kit".
- **Manifest shape shared with `brand-hplx`.** `brand` names the foundation
  (`repository`, `tag`, `commit`, `directory`, `lock`). The former `vendor`
  section is replaced by `distribution`: `{ path, sha256 }` for every file a
  consumer syncs, namely this family's tokens, marks, guide, review board,
  validation record, changelog and `LICENSE.md`, and every file under
  `vendor/brand/` including `brand.lock.json`. The build derives both sections;
  the check fails when the manifest, the lock and the files disagree. Vendored
  files no longer carry per-file roles in this manifest; their roles are in the
  foundation's own release.
- **Foundation `cosmiklabs/brand` v0.9.1**, vendored with its new `vendor.mjs`
  (lock `lockfileVersion` 2, commit `48afb82b1edd5f9a7ce01eedbd52b5e3484c3c69`). The
  baseline token version is still 0.7.0, so `extends` is unchanged.
- **Corrected family description.** `tokens/family.json` said the marks were in
  `kits/tectra/assets/`; they are in `assets/`. This changes the `proposals` text
  in `tectra.json` and `tectra.tokens.json`, so the family version moves to 0.2.1.
  No token value changes; the other generated changes are the version and the
  provenance header, which now names `@cosmiklabs/brand 0.9.1`. The marks are
  byte-identical. The `family-proposals-path` known gap is closed.
- `package.json` gains `repository`. CI reads the foundation's repository and tag
  from the lock.

## 0.2.0 · 24 October 2026 (split; not tagged)

- **Split from `cosmiklabs/brand`.** The Tectra kit moves out of `cosmiklabs/brand`,
  which removed `kits/tectra/` at v0.8.0, into this repository, with its history
  (`git subtree split` of `kits/tectra/`). Files that were under `kits/tectra/` are
  now at the repository root: `README.md`, `assets/`, `tokens/`, `specimen.html`,
  `specimen.css` and `validation.md`.
- **Builds on `cosmiklabs/brand` v0.8.0.** The foundation is vendored unchanged at
  `vendor/brand/` and pinned by `brand.lock.json` (commit
  `e416514a291fb71844280f7cf1e2759d195b7a4d`). Tokens are generated and checked by the
  vendored `family.mjs`; CI also proves the lock against the tag.
- **Tokens.** Regenerated outputs change only their provenance header, which now names
  `@cosmiklabs/brand 0.8.0 scripts/family.mjs` and `tokens/family.json`. `tectra.json`
  and every token value are byte-identical to Tectra 0.2.0 in brand v0.7.0.
- **Marks.** `scripts/build-assets.mjs` (formerly brand's `build-tectra-assets.mjs`)
  uses the vendored outline tools and Inter SemiBold; the ten SVGs are byte-identical.
- **Consumers.** `asset-manifest.json` lists every deliverable with its SHA-256, role
  and status, including the vendored foundation, and carries the former
  `tectra_identity` and family identity records. Paths change from
  `kits/tectra/...` to the repository root, and `kits/cosmik/...` and `fonts/...` to
  `vendor/brand/...`. The specimen loads the baseline CSS and fonts from `vendor/brand/`.
- Add `LICENSE.md` (the brand terms applied to this repository), `AGENTS.md`, the
  Tectra tests, and CI.

No mark, palette, token value or approved guidance changes. Tectra remains family
0.2.0 and extends Cosmik baseline 0.7.0. This state was not tagged; 0.2.1 is the
first release of this repository.
