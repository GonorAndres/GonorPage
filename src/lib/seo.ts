// Document titles and meta descriptions derived from page copy.
// Visible headings and ledes stay on the full source string; only the
// <title> and <meta name="description"> use these.

const SUFFIXES = [
  ' | Andrés González Ortega, UNAM',
  ' | Andrés González Ortega',
  ' | Andrés González',
  ' | González',
];

const TRAILING_WORDS = new Set(
  'a al an and con de del el en for in la of on or por su the to un una vs y'.split(' '),
);

function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function withSuffix(title: string): string {
  if (title.length >= 50 || title.includes('González')) return title;
  for (const suffix of SUFFIXES) {
    if (title.length + suffix.length <= 60) return title + suffix;
  }
  return title;
}

function trimDanglingWord(title: string): string {
  let current = title;
  for (let i = 0; i < 3; i++) {
    const words = current.split(' ');
    const last = words[words.length - 1]?.toLowerCase().replace(/[.,:;]+$/u, '');
    if (words.length < 4 || !last || !TRAILING_WORDS.has(last)) break;
    current = words.slice(0, -1).join(' ').replace(/[\s,:;|—–-]+$/u, '');
  }
  return current;
}

/** ~50–60 characters. Long titles break on a clause; short ones gain a name suffix that still fits. */
export function metaTitle(raw: string): string {
  let title = normalize(raw);
  if (title.length > 60) {
    for (const sep of [' | ', ' — ', ' – ', ': ', ' (']) {
      const at = title.indexOf(sep);
      if (at >= 40 && at <= 60) {
        title = title.slice(0, at).trim();
        break;
      }
    }
    if (title.length > 60) {
      const slice = title.slice(0, 61);
      const space = slice.lastIndexOf(' ');
      const cut = space >= 48 ? space : 60;
      title = title.slice(0, cut).replace(/[\s,:;|—–-]+$/u, '');
    }
  }
  title = trimDanglingWord(title);
  return withSuffix(title);
}

/** ~140–160 characters, ending on a sentence inside that window when the source has one. */
export function metaDescription(raw: string): string {
  const clean = normalize(raw);
  if (clean.length <= 160) return clean;

  const ends: number[] = [];
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if ((ch === '.' || ch === '!' || ch === '?') && (i === clean.length - 1 || clean[i + 1] === ' ')) {
      ends.push(i + 1);
    }
  }
  const inRange = ends.filter((n) => n >= 140 && n <= 160);
  if (inRange.length) return clean.slice(0, inRange[inRange.length - 1]);

  const slice = clean.slice(0, 161);
  let space = slice.lastIndexOf(' ');
  if (space < 140) space = 160;
  return clean.slice(0, space).replace(/[\s,;:]+$/u, '');
}
