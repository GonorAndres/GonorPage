import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#EDE6DD',
        navy: '#1B2A4A',
        amber: '#D4A574',
        terracotta: '#C17654',
        sage: '#7A8B6F',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Sharper, more editorial corners (away from the soft "AI" look).
      // rounded-full stays 9999px so circles/icons are unaffected.
      borderRadius: {
        DEFAULT: '3px',
        sm: '2px',
        md: '4px',
        lg: '5px',
        xl: '6px',
        '2xl': '8px',
        '3xl': '10px',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgba(27, 42, 74, 0.8)',
            '--tw-prose-headings': theme('colors.navy'),
            '--tw-prose-links': theme('colors.terracotta'),
            '--tw-prose-bold': theme('colors.navy'),
            '--tw-prose-bullets': theme('colors.amber'),
            '--tw-prose-counters': theme('colors.amber'),
            '--tw-prose-hr': 'rgba(212, 165, 116, 0.3)',
            '--tw-prose-quote-borders': theme('colors.amber'),
            '--tw-prose-code': theme('colors.terracotta'),
            '--tw-prose-pre-bg': '#F7F3EE',
            '--tw-prose-th-borders': 'rgba(212, 165, 116, 0.3)',
            '--tw-prose-td-borders': 'rgba(212, 165, 116, 0.2)',
          },
        },
      }),
    },
  },
  plugins: [typography],
};
