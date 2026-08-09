# kingkimabdu.github.io

Personal portfolio of Abdullah Alhariri — a student and builder from Germany.
Built with Next.js and shipped as a static export to GitHub Pages.

**Live:** https://kingkimabdu.github.io

## Tech stack

- Next.js (App Router, static export)
- React
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber (the living background)

## Development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build

```bash
npm run build
```

The static site is written to `out/`. On every push to `main`, the workflow in
`.github/workflows/deploy.yml` runs this build and publishes the result to
GitHub Pages — the `out/` folder is never committed.

## License

See [LICENSE](LICENSE).
