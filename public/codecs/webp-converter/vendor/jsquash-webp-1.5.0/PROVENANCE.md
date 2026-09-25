# @jsquash/webp 1.5.0 provenance

- Package: `@jsquash/webp`
- Version: `1.5.0`
- Source: npm package tarball `@jsquash/webp@1.5.0`
- npm package page: `https://www.npmjs.com/package/@jsquash/webp`
- Repository from package metadata: `jamsinclair/jSquash`
- Tarball URL: `https://registry.npmjs.org/@jsquash/webp/-/webp-1.5.0.tgz`
- Reproduce the download with `npm pack @jsquash/webp@1.5.0`.
- Tarball SHA256: `b543cb1fc17e99c31e992a71d70da570d1bc1871ce3a88440df067e5b2e6ee9e`

## Install contents

Only the baseline encoder files required by the WebP converter are vendored here. Paths preserve the upstream package layout.

| Vendored path | Upstream path | SHA256 |
| --- | --- | --- |
| `meta.js` | `package/meta.js` | `3d70163a00e6264fc5a8fa7c8f3b1fa21a50a00d910f4d2de3ef1bbd2fdc98ab` |
| `codec/enc/webp_enc.js` | `package/codec/enc/webp_enc.js` | `5fd62301662e37785aec38e38807926f72933d4c8b919018a43faf1b1ca760f6` |
| `codec/enc/webp_enc.wasm` | `package/codec/enc/webp_enc.wasm` | `b6085bb6702f144e9dc6016d58d230b34a84976bf0d080b7390b4b4b137d6ab7` |
| `LICENSE` | `package/LICENSE` | `8c3690b09c168f196446cf5904332023bbc15eb92b6a7cee470ac829e6a65d20` |
| `codec/LICENSE.codec.md` | `package/codec/LICENSE.codec.md` | `e293d1dddc9785200b1f58a4f5293543cf8566d9e0b8a3c02fad955035b19f42` |

## Verification

Copied files were verified byte-for-byte against the extracted npm package with `cmp -s`, and SHA256 hashes above were generated from the vendored copies.
