// Generates the default Open Graph image (1200x630) referenced by the site's
// <head> as https://gonor.me/og-default.png.
//
// Renders with satori (SVG) + @resvg/resvg-js (SVG -> PNG).
// Run with: npm run og
//
// Font note: satori needs TTF/OTF/WOFF font data (woff2 is not reliably
// supported). We use the DejaVu Serif/Sans TTFs shipped with the system, which
// contain full Latin diacritics (á é í ó ú ñ). If those paths are missing on
// another machine, override via env vars OG_SERIF / OG_SANS pointing at TTFs.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const SERIF_BOLD = process.env.OG_SERIF ||
  '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf';
const SANS = process.env.OG_SANS ||
  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';

for (const f of [SERIF_BOLD, SANS]) {
  if (!existsSync(f)) {
    console.error(`Missing font: ${f}. Set OG_SERIF / OG_SANS to valid TTF paths.`);
    process.exit(1);
  }
}

const serifBold = readFileSync(SERIF_BOLD);
const sans = readFileSync(SANS);

// Palette (portfolio brand colors)
const CREAM = '#EDE6DD';
const NAVY = '#1B2A4A';
const TERRACOTTA = '#C17654';
const AMBER = '#D4A574';
const SAGE = '#7A8B6F';

const WIDTH = 1200;
const HEIGHT = 630;

// A soft organic accent circle, low opacity, tucked in a corner.
const circle = (size, color, top, left, opacity) => ({
  type: 'div',
  props: {
    style: {
      position: 'absolute',
      top,
      left,
      width: size,
      height: size,
      borderRadius: '9999px',
      backgroundColor: color,
      opacity,
    },
  },
});

const tree = {
  type: 'div',
  props: {
    style: {
      width: WIDTH,
      height: HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: CREAM,
      padding: '96px',
      fontFamily: 'DejaVu Sans',
    },
    children: [
      // Soft accent circles, bottom-right corner, restrained.
      circle(320, AMBER, 400, 950, 0.16),
      circle(180, SAGE, 250, 1080, 0.14),

      // Name
      {
        type: 'div',
        props: {
          style: {
            fontFamily: 'DejaVu Serif',
            fontSize: 84,
            fontWeight: 700,
            color: NAVY,
            lineHeight: 1.05,
            letterSpacing: '-0.5px',
          },
          children: 'Andrés González Ortega',
        },
      },
      // Amber underline accent bar
      {
        type: 'div',
        props: {
          style: {
            marginTop: 28,
            width: 140,
            height: 8,
            borderRadius: '9999px',
            backgroundColor: AMBER,
          },
        },
      },
      // Subtitle
      {
        type: 'div',
        props: {
          style: {
            marginTop: 28,
            fontSize: 40,
            color: TERRACOTTA,
            letterSpacing: '0.5px',
          },
          children: 'Actuario · Ciencia de Datos',
        },
      },
      // Footer line
      {
        type: 'div',
        props: {
          style: {
            position: 'absolute',
            bottom: 56,
            left: 96,
            display: 'flex',
            alignItems: 'center',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  width: 40,
                  height: 3,
                  backgroundColor: NAVY,
                  opacity: 0.35,
                  marginRight: 18,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 26,
                  color: NAVY,
                  opacity: 0.7,
                  letterSpacing: '1px',
                },
                children: 'gonor.me',
              },
            },
          ],
        },
      },
    ],
  },
};

const svg = await satori(tree, {
  width: WIDTH,
  height: HEIGHT,
  fonts: [
    { name: 'DejaVu Serif', data: serifBold, weight: 700, style: 'normal' },
    { name: 'DejaVu Sans', data: sans, weight: 400, style: 'normal' },
  ],
});

const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
const png = resvg.render().asPng();

const outPath = resolve(root, 'public', 'og-default.png');
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);
