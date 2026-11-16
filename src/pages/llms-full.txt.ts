import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getProjects } from '../data/projects';

const SITE = 'https://gonor.me';

export const GET: APIRoute = async () => {
  const projects = getProjects('en');
  const posts = await getCollection('blog', ({ data }) => data.lang === 'en');
  posts.sort((a, b) => b.data.date.localeCompare(a.data.date));

  const lines: string[] = [
    '# Andrés González Ortega — Full Portfolio Index (llms-full.txt)',
    '',
    '> UNAM-trained actuary, data scientist, and AI engineer based in Mexico City. Builds production actuarial engines (SIMA, GMM Explorer), regulatory Graph-RAG agents (LISF/CUSF), real-time voice agents (OpenAI Realtime + Twilio), and GCP/Cloudflare data platforms.',
    '',
    `- Site: ${SITE}`,
    `- Summary: ${SITE}/llms.txt`,
    `- Email: gonorandres@ciencias.unam.mx`,
    '- GitHub: https://github.com/GonorAndres',
    '- LinkedIn: https://www.linkedin.com/in/andr%C3%A9s-g%C3%B3nzalez-ortega-190b49371/',
    '',
    '## Projects',
    '',
  ];

  for (const p of projects) {
    lines.push(`### ${p.title} (${p.category})`);
    lines.push(p.description);
    lines.push(`- Primary URL: ${p.url}`);
    if (p.repo) lines.push(`- Repository: ${p.repo}`);
    if (p.blogSlug) lines.push(`- Case Study (EN): ${SITE}/en/blog/${p.blogSlug}/`);
    if (p.tags.length) lines.push(`- Stack/Tags: ${p.tags.join(', ')}`);
    lines.push('');
  }

  lines.push('## Blog Posts (English)', '');
  for (const post of posts) {
    const slug = post.id.replace(/^en\//, '').replace(/\.md$/, '');
    lines.push(`- [${post.data.title}](${SITE}/en/blog/${slug}/) (${post.data.date}) — ${post.data.description}`);
  }

  return new Response(lines.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
