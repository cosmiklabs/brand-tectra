# Changes

The Tectra family's version is `version` in `tokens/family.json`; this repository's
`package.json` and `asset-manifest.json` carry the same version. Newest first.

## Unreleased · 24 October 2026

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
0.2.0 and extends Cosmik baseline 0.7.0.
