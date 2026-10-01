# Portfolio project guide

## Project layout

- The deployable Vite/TypeScript application is in `react-app/`.
- `react-app/index.html` holds the page structure and content, including the certificate cards.
- `react-app/src/main.ts` contains client-side behavior and the Hungarian/English UI strings.
- `react-app/src/style.css` contains all page styling.
- `react-app/src/` stores the original image assets; generated WebP versions used by the page live beside them.
- Do not edit `react-app/dist/`: it is generated output.

## Updating certificates

1. Copy the supplied badge PNG to `react-app/src/`.
2. Add its filename to `contentImages` in `react-app/scripts/optimize-images.mjs`.
3. Run `npm run optimize-images` from `react-app/` to create the WebP asset.
4. Add a card to the `.certs-row` in `react-app/index.html`. Use the Credly public URL, `target="_blank" rel="noopener"`, the generated `.webp` asset, and descriptive alt text.
5. Run `npm run build` from `react-app/`.

## Validation

Run `npm run build` from `react-app/` after code, content, or asset changes. The build performs TypeScript checking and creates the Vite production bundle.
