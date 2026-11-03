# Third-party notices

This repository does not declare a blanket open-source license for original Atlas code. Third-party components retain their own licenses.

- God's Eye View: © 2026 Bilawal Sidhu, MIT. See `apps/gods-eye/LICENSE`, `DATA_SOURCES.md` and `THIRD_PARTY_NOTICES.md`. Prebuilt distributions preserve those notices. Some upstream datasets/assets have separate noncommercial or attribution conditions; the MIT application license does not replace them.
- exifr 7.1.3, pdf-lib 1.17.1, fflate 0.8.2: MIT, notices in `web/vendor`.
- jsQR 1.4.0: Apache-2.0, notice in `web/vendor`.
- SunCalc 2.1.1: BSD-2-Clause, notice in `web/vendor`.
- The Windows executable embeds the Node.js runtime. Its license and bundled dependency notices are in `NODE-LICENSE.txt`, included with the download and in the executable's assets.
- esbuild and postject are build-time dependencies with their own upstream licenses and pinned versions in the lockfile.
- Fonts: Google Fonts is requested by the UI when online, with local system fallbacks. No proprietary reference-site images, fonts or logos were copied.

Public map tiles, live feeds, external tools and search providers have their own service/data terms and attribution requirements. Atlas does not grant rights in those external datasets.
