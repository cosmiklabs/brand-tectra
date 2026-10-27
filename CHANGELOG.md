# Changes

## Unreleased

- Adopted shared narrow metadata/table fixes and a compact title-first source explanation.

- Clarified the product’s conversation, revision and review story; scoped rule-checking and export claims; and made Cosmik a secondary endorsement. Voice & imagery now combines current product guidance with pinned general writing rules.

The Tectra family's version is `version` in `tokens/family.json`; this repository's
`package.json` and `asset-manifest.json` carry the same version. Newest first.

## 0.6.1 · 26 October 2026

- **Licence.** `LICENSE.md` names COSMIK LABS, LLC as the holder of the copyright
  in this repository's own material and of the Cosmik marks, including the Tectra
  marks, in place of "not a company or other legal entity", the contributors and
  the organisation's owner. The MIT notice reads "Copyright (c) 2026 COSMIK LABS,
  LLC". Sections, grants and permissions are otherwise unchanged. The change
  applies from this release.
- **Foundation `cosmiklabs/brand` v0.16.1** (commit
  `4da5ba28b1c32cf6b717ca1cb579b6c6d237ec3d`): the same licence change for the
  foundation, and its identity and voice guides name the legal entity. No token,
  mark or control changes; `extends` stays `"Cosmik baseline 0.11.0"`. Generated
  tokens differ only in the version and the provenance header.

## 0.6.0 · 26 October 2026

- **Foundation `cosmiklabs/brand` v0.16.0** (commit
  `160f73268fb2307156e580d6fa30c99ef93a2e39`): glass keeps the theme's tone and is
  legible over any backdrop through a per-tone backdrop filter (dark
  `contrast(0.75) brightness(0.5)`, light `contrast(0.5) brightness(1.35)`). The
  tone threshold and hysteresis are gone. The baseline token version is now
  0.11.0, so `extends` is `"Cosmik baseline 0.11.0"`.
- **Tectra glass tint.** The dark tone's `tectra-dark-glass` drops from 60 % to
  38 % (`#17212560`), the most translucent value that passes the new any-backdrop
  contract with a small margin (at 36 % quiet text on the pressed tint is
  4.54:1). The light tone keeps the baseline's tint, now 56 %. Over any backdrop:
  dark text 7.09:1, muted 5.33:1, pressed text 4.63:1, focus and selection
  4.56:1; light text 7.46:1, muted 5.21:1, pressed text 5.78:1, focus and
  selection 3.11:1. Scene kept behind the glass (composite luminance, brightest /
  darkest content): dark 0.083 / 0.008 (2.30:1), light 1.0 / 0.462 (2.05:1).
- **Guide.** Glass follows the theme; do not switch tones with the work.

## 0.5.2 · 25 October 2026

- **Selection is teal again.** Since the shared controls took over Tectra's
  selected controls, they used Tectra's `selected` role, which was its ink
  (`#142925` light, `#EDF4F3` dark), so selected toolbar tools and segment options
  turned into near-black or pale pills and lost the teal the guide gives selected
  emphasis. `selected` is now Tectra's accent in both modes (`#126B5E` light,
  `#71D6C3` dark), with `on-selected` Tectra's near-white `#F2F6F5` (light) and
  dark ink `#0F1719` (dark). On-selected on selected: 5.86:1 light, 10.47:1 dark;
  selected against the bg, surface and raised roles 5.20–6.38:1 light and
  7.84–10.47:1 dark, and against each glass tone over its band 3.12:1 light and
  4.79:1 dark. The selection bar is drawn in the on-selected colour, so it holds
  the same contrast. Focus is the same teal; its ring stays offset from the
  control, so a focused selection still shows a gap between fill and ring.
  The unused `tectra-*-selected` primitives are removed.

## 0.5.1 · 25 October 2026

- **Foundation `cosmiklabs/brand` v0.15.1** (commit
  `31cd0202eb0691c32e0c08b81a94c209c9a1c2b4`): pressed is a deeper step of
  hover, glass hover and pressed tint the glass, and the check enforces both. The
  baseline token version is now 0.10.1, so `extends` is
  `"Cosmik baseline 0.10.1"`.
- **Tectra pressed roles.** Three of Tectra's pressed roles ran back towards rest
  and fail the new check; they now continue past hover. Dark secondary:
  `#172125` → `#233034` → `#2F3E42` (was `#0F1719`, darker than rest). Dark
  primary: `#71D6C3` → `#92E5D4` → `#B3EFE3` (was `#50B5A3`). Light secondary:
  white → `#E0EAE7` → `#CCDAD5` (was `#F2F6F5`, almost rest). The light primary
  was already a one-way ramp. Pressed against rest / hover: 1.47 / 1.22, 1.35 /
  1.14, 1.44 / 1.17 and 1.57 / 1.26.

## 0.5.0 · 25 October 2026

- **Foundation `cosmiklabs/brand` v0.15.0** (commit
  `240edbe4bf69f1af36be30c60dc80aa35f29b56d`). Glass has no solid border: its
  edge is a 1px sheen of light caught by the rim (`glass-sheen` at the top left
  fading to `glass-sheen-low` at the bottom right), and the panel edge is
  decorative. `glass-border` is now the plain border of the solid fallbacks. The
  baseline token version is now 0.10.0, so `extends` is
  `"Cosmik baseline 0.10.0"`. See the foundation's changelog.
- **Tectra sheen.** Dark tone: Tectra's mineral white `#EDF4F3` at 65 % fading to
  20 %. Light tone: the baseline white highlight with a lower edge in Tectra's
  dark `#0F1719` at 25 %. Solid fallbacks use Tectra's dividers (`#344744` dark,
  `#C2D1CC` light) as the plain border. Text, muted text, focus and selection over
  each tone's band are unchanged from 0.4.0.

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
