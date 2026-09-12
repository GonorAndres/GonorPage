import { useState, useMemo } from 'react';

export type BlogCategoryKey =
  | 'actuaria-para-todos'
  | 'fundamentos-actuariales'
  | 'proyectos-y-analisis'
  | 'herramientas'
  | 'mercado-mexicano';

interface PostData {
  title: string;
  description: string;
  slug: string;
  date: string;
  lastModified?: string;
  heroImage?: string;
  heroAlt?: string;
  categoryKey: BlogCategoryKey;
  categoryLabel: string;
  tags?: string[];
  lang: 'es' | 'en';
}

interface Labels {
  searchPlaceholder: string;
  noResults: string;
  articleSingular: string;
  articlePlural: string;
  readMore: string;
  sortRecent: string;
  sortOldest: string;
  sortTitle: string;
  sortLabel: string;
}

interface Props {
  posts: PostData[];
  labels: Labels;
}

type Sort = 'recent' | 'oldest' | 'title';

const CATEGORY_COLOR: Record<BlogCategoryKey, string> = {
  'actuaria-para-todos': '#7A8B6F',
  'fundamentos-actuariales': '#C17654',
  'proyectos-y-analisis': '#5B7B9A',
  'herramientas': '#D4A574',
  'mercado-mexicano': '#1B2A4A',
};

function formatDotDate(iso: string): string {
  return iso.replaceAll('-', '.');
}

function PostRow({ post, labels, priority }: { post: PostData; labels: Labels; priority: boolean }) {
  const href = post.lang === 'es' ? `/blog/${post.slug}/` : `/en/blog/${post.slug}/`;
  const catColor = CATEGORY_COLOR[post.categoryKey] ?? '#1B2A4A';
  const thumbnail = post.heroImage?.startsWith('/blog-illustrations/')
    ? post.heroImage.replace('/blog-illustrations/', '/blog-illustrations/thumbs/')
    : undefined;

  return (
    <article className="group relative grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5 md:gap-8 py-7 md:py-9 border-t border-[#1B2A4A]/20 items-center">
      {post.heroImage && (
        <picture className="block overflow-hidden rounded-lg border border-[#1B2A4A]/10 bg-[#E8E0D7]">
          {thumbnail && (
            <source
              type="image/webp"
              srcSet={`${thumbnail} 640w, ${post.heroImage} 1536w`}
              sizes="(min-width: 1068px) 443px, (min-width: 768px) calc(45vw - 38px), (min-width: 640px) calc(100vw - 50px), calc(100vw - 34px)"
            />
          )}
          <img
            src={thumbnail ?? post.heroImage}
            alt={post.heroAlt ?? ''}
            width="640"
            height="360"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className="block w-full aspect-[16/9] object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.02]"
          />
        </picture>
      )}

      <div className={`min-w-0 ${post.heroImage ? '' : 'md:col-span-2'}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#1B2A4A]/75">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: catColor }} aria-hidden="true" />
            {post.categoryLabel}
          </span>
          <time dateTime={post.date}>{formatDotDate(post.date)}</time>
        </div>
        <h2 className="font-serif font-medium text-[22px] md:text-[25px] text-[#1B2A4A] leading-[1.2] tracking-tight mb-3">
          {/* The title stretches across the row; keep other row content non-interactive. */}
          <a
            href={href}
            className="inline-flex min-h-[44px] items-center no-underline hover:text-[#A35E3E] focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-[#1B2A4A] transition-colors after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </a>
        </h2>
        <p className="text-sm text-left text-[#1B2A4A]/75 leading-relaxed max-w-[62ch] line-clamp-3 mb-3">
          {post.description}
        </p>
        <span className="inline-flex min-h-[44px] items-center gap-2 text-xs font-medium text-[#1B2A4A] group-hover:text-[#A35E3E] transition-colors" aria-hidden="true">
          {labels.readMore}
          <span className="motion-safe:group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </div>
    </article>
  );
}

export default function BlogSearch({ posts, labels }: Props) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('recent');

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    const filtered = !q
      ? posts
      : posts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
        );
    const sorted = [...filtered];
    if (sort === 'recent') sorted.sort((a, b) => b.date.localeCompare(a.date));
    else if (sort === 'oldest') sorted.sort((a, b) => a.date.localeCompare(b.date));
    else sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [posts, query, sort]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B2A4A]/70 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            aria-label={labels.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl min-h-[44px] border border-[#1B2A4A]/50 bg-[#FFF8F0]/70 text-sm text-[#1B2A4A] placeholder:text-[#1B2A4A]/70 focus:outline-none focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A] transition-colors"
          />
        </div>

        <div className="relative w-full sm:w-auto sm:shrink-0">
          <select
            aria-label={labels.sortLabel}
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="w-full appearance-none pl-4 pr-9 py-2.5 rounded-xl min-h-[44px] border border-[#1B2A4A]/50 bg-[#FFF8F0]/70 text-sm text-[#1B2A4A] focus:outline-none focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A] transition-colors cursor-pointer"
          >
            <option value="recent">{labels.sortRecent}</option>
            <option value="oldest">{labels.sortOldest}</option>
            <option value="title">{labels.sortTitle}</option>
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B2A4A]/70 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <p role="status" aria-live="polite" aria-atomic="true" className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1B2A4A]/70 mb-2">
        {visible.length} {visible.length === 1 ? labels.articleSingular : labels.articlePlural}
      </p>

      {visible.length > 0 ? (
        <div>
          {visible.map((post, index) => (
            <PostRow key={post.slug} post={post} labels={labels} priority={index === 0} />
          ))}
          <div className="border-t border-[#1B2A4A]/10"></div>
        </div>
      ) : (
        <p className="text-[#1B2A4A]/75 text-center py-12">{labels.noResults}</p>
      )}
    </div>
  );
}
