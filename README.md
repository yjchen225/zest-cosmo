# Zest Cosmo Static Site

A static, responsive React implementation of the 12 canonical Zest Cosmo pages.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The generated static files are written to `dist/`.

## GitHub Pages deployment

This repository is configured for the project site:

<https://yjchen225.github.io/zest-cosmo/>

The Vite base path is `/zest-cosmo/`. Pushing to the `main` branch triggers
`.github/workflows/deploy.yml`, which builds the app and deploys `dist/` through
GitHub Pages Actions.

In the GitHub repository, open **Settings → Pages** and set **Source** to
**GitHub Actions** once. Direct visits and browser refreshes on page routes are
handled by the included `public/404.html` SPA fallback.

## Routes

- `/zest-cosmo/page-home`
- `/zest-cosmo/page-collection`
- `/zest-cosmo/page-product`
- `/zest-cosmo/page-search`
- `/zest-cosmo/page-cart`
- `/zest-cosmo/page-not-found`
- `/zest-cosmo/page-collection-list`
- `/zest-cosmo/page-content`
- `/zest-cosmo/page-faq`
- `/zest-cosmo/page-contact`
- `/zest-cosmo/page-account`
- `/zest-cosmo/page-lookbook`

The site uses local generated image assets and fixture commerce data. Interactions are simulated entirely in the browser.
