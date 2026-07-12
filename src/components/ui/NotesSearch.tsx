import { useState, useMemo } from 'react';

interface NoteUrl {
  label: string;
  url: string;
}

export type NoteCategoryKey = 'actuarial' | 'quant' | 'stats';

interface NoteData {
  slug: string;
  categoryKey: NoteCategoryKey;
  category: string;
  type: 'note' | 'artifact';
  title: string;
  description: string;
  urls: NoteUrl[];
  tags: string[];
  createdDate: string;
  lang: 'es' | 'en';
}

interface Labels {
  searchPlaceholder: string;
  noResults: string;
  noteSingular: string;
  notePlural: string;
  interactive: string;
  sortRecent: string;
  sortOldest: string;
  sortTitle: string;
}

interface Props {
  notes: NoteData[];
  labels: Labels;
}

type Sort = 'recent' | 'oldest' | 'title';

const CATEGORY_COLOR: Record<NoteCategoryKey, string> = {
  actuarial: '#C17654',
  quant: '#D4A574',
  stats: '#5B7B9A',
};

function formatDate(iso: string): string {
  return iso.replaceAll('-', '.');
}

function DownloadIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function LaunchIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function NoteRow({ note, labels }: { note: NoteData; labels: Labels }) {
  const detailHref = note.lang === 'es' ? `/artifacts/${note.slug}/` : `/en/artifacts/${note.slug}/`;
  const catColor = CATEGORY_COLOR[note.categoryKey];
  const isArtifact = note.type === 'artifact';

  return (
    <article className="grid grid-cols-[64px_1fr] md:grid-cols-[92px_1fr_140px] gap-x-4 md:gap-x-6 gap-y-2 py-6 border-t border-[#1B2A4A]/10 items-baseline">
      <time className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#1B2A4A]/45">
        {formatDate(note.createdDate)}
      </time>

      <div>
        <h3 className="font-serif font-medium text-lg md:text-xl text-[#1B2A4A] leading-snug mb-1.5">
          <a
            href={detailHref}
            className="group/title no-underline hover:text-[#C17654] transition-colors inline-flex items-baseline gap-2"
          >
            <span>{note.title}</span>
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
          {note.description}
        </p>
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
            {note.tags.slice(0, 5).map((tag) => (
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
          {note.urls.map((link) => {
            const isInternal = link.url.startsWith('/');
            const linkHref = isInternal
              ? `${link.url}${link.url.includes('?') ? '&' : '?'}lang=${note.lang}`
              : link.url;
            return (
              <a
                key={link.url}
                href={linkHref}
                {...(!isInternal && { target: '_blank', rel: 'noopener noreferrer' })}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded border border-[#C17654] text-[#C17654] text-xs font-medium hover:bg-[#C17654] hover:text-cream transition-colors no-underline"
              >
                {isInternal ? <LaunchIcon /> : <DownloadIcon />}
                {link.label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="col-span-2 md:col-span-1 md:text-right">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: catColor }}
        >
          {note.category}
        </span>
        {isArtifact && (
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#C17654]/80 mt-1.5">
            {labels.interactive}
          </div>
        )}
      </div>
    </article>
  );
}

export default function NotesSearch({ notes, labels }: Props) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('recent');

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    const filtered = !q
      ? notes
      : notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.description.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q))
        );
    const sorted = [...filtered];
    if (sort === 'recent') sorted.sort((a, b) => b.createdDate.localeCompare(a.createdDate));
    else if (sort === 'oldest') sorted.sort((a, b) => a.createdDate.localeCompare(b.createdDate));
    else sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [notes, query, sort]);

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
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1B2A4A]/10 bg-white/70 text-sm text-[#1B2A4A] placeholder:text-[#1B2A4A]/40 focus:outline-none focus:border-[#C17654]/40 focus:ring-1 focus:ring-[#C17654]/20 transition-colors"
          />
        </div>

        <div className="relative w-full sm:w-auto sm:shrink-0">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="w-full appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-[#1B2A4A]/10 bg-white/70 text-sm text-[#1B2A4A] focus:outline-none focus:border-[#C17654]/40 focus:ring-1 focus:ring-[#C17654]/20 transition-colors cursor-pointer"
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
        {visible.length} {visible.length === 1 ? labels.noteSingular : labels.notePlural}
      </p>

      {visible.length > 0 ? (
        <div>
          {visible.map((note) => (
            <NoteRow key={note.slug} note={note} labels={labels} />
          ))}
          <div className="border-t border-[#1B2A4A]/10"></div>
        </div>
      ) : (
        <p className="text-[#1B2A4A]/50 text-center py-12">{labels.noResults}</p>
      )}
    </div>
  );
}
