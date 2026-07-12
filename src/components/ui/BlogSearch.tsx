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

function PostRow({ post, labels }: { post: PostData; labels: Labels }) {
  const href = post.lang === 'es' ? `/blog/${post.slug}/` : `/en/blog/${post.slug}/`;
  const catColor = CATEGORY_COLOR[post.categoryKey] ?? '#1B2A4A';

  return (
    <article className="grid grid-cols-[72px_1fr] md:grid-cols-[92px_1fr_140px] gap-x-4 md:gap-x-6 gap-y-2 py-6 border-t border-[#1B2A4A]/10 items-baseline">
      <time className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#1B2A4A]/45">
        {formatDotDate(post.date)}
      </time>

      <div>
        <h3 className="font-serif font-medium text-lg md:text-xl text-[#1B2A4A] leading-snug mb-1.5">
          <a
            href={href}
            className="group/title no-underline hover:text-[#C17654] transition-colors inline-flex items-baseline gap-2"
          >
            <span>{post.title}</span>
            <span
              aria-hidden="true"
              className="inline-flex translate-y-[2px] text-[#C17654] group-hover/title:translate-x-0.5 transition-transform"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="13" y2="17" />
              </svg>
            </span>
          </a>
        </h3>
        <p className="text-sm text-[#1B2A4A]/65 leading-relaxed max-w-[62ch] mb-3">
          {post.description}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
            {post.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-[#1B2A4A]/40"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <a
            href={href}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded border border-[#C17654] text-[#C17654] text-xs font-medium hover:bg-[#C17654] hover:text-cream transition-colors no-underline"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {labels.readMore}
          </a>
        </div>
      </div>

      <div className="col-span-2 md:col-span-1 md:text-right">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: catColor }}
        >
          {post.categoryLabel}
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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B2A4A]/30 pointer-events-none"
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1B2A4A]/10 bg-[#FFF8F0]/70 text-sm text-[#1B2A4A] placeholder:text-[#1B2A4A]/40 focus:outline-none focus:border-[#C17654]/40 focus:ring-1 focus:ring-[#C17654]/20 transition-colors"
          />
        </div>

        <div className="relative w-full sm:w-auto sm:shrink-0">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="w-full appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-[#1B2A4A]/10 bg-[#FFF8F0]/70 text-sm text-[#1B2A4A] focus:outline-none focus:border-[#C17654]/40 focus:ring-1 focus:ring-[#C17654]/20 transition-colors cursor-pointer"
          >
            <option value="recent">{labels.sortRecent}</option>
            <option value="oldest">{labels.sortOldest}</option>
            <option value="title">{labels.sortTitle}</option>
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B2A4A]/30 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1B2A4A]/45 mb-2">
        {visible.length} {visible.length === 1 ? labels.articleSingular : labels.articlePlural}
      </p>

      {visible.length > 0 ? (
        <div>
          {visible.map((post) => (
            <PostRow key={post.slug} post={post} labels={labels} />
          ))}
          <div className="border-t border-[#1B2A4A]/10"></div>
        </div>
      ) : (
        <p className="text-[#1B2A4A]/50 text-center py-12">{labels.noResults}</p>
      )}
    </div>
  );
}
