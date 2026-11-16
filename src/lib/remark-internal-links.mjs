// Blog markdown is compiled as a directory URL (/en/blog/slug/), so a relative
// link ./other-post resolves to /en/blog/slug/other-post and 404s. Rewrite
// sibling slugs to the language's final post URL, add the trailing slash
// Cloudflare already canonicalizes, and keep English posts on /en/blog/.

function postPrefix(lang) {
  return lang === 'en' ? '/en/blog/' : '/blog/';
}

function ensureTrailingSlash(url) {
  if (!url.startsWith('/')) return url;
  const cut = url.search(/[?#]/);
  const path = cut === -1 ? url : url.slice(0, cut);
  const tail = cut === -1 ? '' : url.slice(cut);
  if (path.endsWith('/') || /\.[a-z0-9]+$/i.test(path)) return url;
  return `${path}/${tail}`;
}

export function rewriteHref(href, lang) {
  if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return href;
  let url = href;

  if (url.startsWith('./') || url.startsWith('../')) {
    const stripped = url.replace(/^(?:\.\/|\.\.\/)+/, '');
    const hashAt = stripped.indexOf('#');
    const pathPart = hashAt === -1 ? stripped : stripped.slice(0, hashAt);
    const hash = hashAt === -1 ? '' : stripped.slice(hashAt);
    if (pathPart && !pathPart.includes('/') && !pathPart.includes('.')) {
      url = `${postPrefix(lang)}${pathPart}/${hash}`;
    }
  }

  if (lang === 'en' && (url === '/blog' || url.startsWith('/blog/'))) {
    url = `/en${url}`;
  }

  return ensureTrailingSlash(url);
}

function languageFromFile(file) {
  const filepath = file?.path || file?.history?.[0] || '';
  return /[/\\]content[/\\]blog[/\\]en[/\\]/.test(filepath) ? 'en' : 'es';
}

function visit(node, fn) {
  fn(node);
  if (!node || typeof node !== 'object' || !Array.isArray(node.children)) return;
  for (const child of node.children) visit(child, fn);
}

export function remarkInternalLinks() {
  return (tree, file) => {
    const lang = languageFromFile(file);
    visit(tree, (node) => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'link' && typeof node.url === 'string') {
        node.url = rewriteHref(node.url, lang);
      }
      if ((node.type === 'html' || node.type === 'raw') && typeof node.value === 'string') {
        node.value = node.value.replace(
          /href=(["'])([^"']+)\1/g,
          (full, quote, href) => `href=${quote}${rewriteHref(href, lang)}${quote}`,
        );
      }
    });
  };
}
