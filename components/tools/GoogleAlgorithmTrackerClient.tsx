'use client';

import { useMemo, useState } from 'react';

type UpdateCategory =
  | 'Content Quality'
  | 'Links'
  | 'Core Update'
  | 'Mobile'
  | 'Local'
  | 'Page Experience'
  | 'Spam';

interface AlgorithmUpdate {
  name: string;
  date: string;
  /** YYYYMM sort key so entries can be ordered without a date parser */
  sortKey: number;
  category: UpdateCategory;
  description: string;
}

// Static reference list of major, well-documented Google search algorithm
// updates. Dates are month-level accuracy. This is reference content, not
// generated per request.
const UPDATES: AlgorithmUpdate[] = [
  {
    name: 'Panda',
    date: 'Feb 2011',
    sortKey: 201102,
    category: 'Content Quality',
    description:
      'Targeted thin, duplicate, and low-quality content, boosting sites with original, high-quality content in search rankings. Panda saw many refreshes over the years before being folded into the core ranking algorithm in 2016.',
  },
  {
    name: 'Penguin',
    date: 'Apr 2012',
    sortKey: 201204,
    category: 'Links',
    description:
      'Targeted spammy and manipulative link schemes, including paid links and keyword-stuffed anchor text, penalizing sites that tried to game rankings through unnatural backlink profiles.',
  },
  {
    name: 'Hummingbird',
    date: 'Aug 2013',
    sortKey: 201308,
    category: 'Core Update',
    description:
      'A full rewrite of the core ranking algorithm focused on understanding the intent and contextual meaning behind a query rather than matching individual keywords.',
  },
  {
    name: 'Pigeon',
    date: 'Jul 2014',
    sortKey: 201407,
    category: 'Local',
    description:
      'Tied local search ranking signals more closely to Google’s core web ranking algorithm, improving the relevance and accuracy of local and map-based results.',
  },
  {
    name: 'Mobile-Friendly Update (Mobilegeddon)',
    date: 'Apr 2015',
    sortKey: 201504,
    category: 'Mobile',
    description:
      'Boosted the rankings of mobile-friendly pages in mobile search results, giving site owners a strong incentive to adopt responsive or mobile-optimized designs.',
  },
  {
    name: 'RankBrain',
    date: 'Oct 2015',
    sortKey: 201510,
    category: 'Core Update',
    description:
      'A machine-learning system that helps Google interpret ambiguous or previously unseen queries and match them to relevant results, becoming one of the core ranking signals.',
  },
  {
    name: 'Penguin 4.0',
    date: 'Sep 2016',
    sortKey: 201609,
    category: 'Links',
    description:
      'Penguin was rebuilt to run in real time as part of the core algorithm, devaluing spammy links rather than demoting an entire site for a bad backlink profile.',
  },
  {
    name: 'Fred',
    date: 'Mar 2017',
    sortKey: 201703,
    category: 'Content Quality',
    description:
      'An unofficially named update, widely reported by SEOs to have impacted sites with aggressive ad placements and low-value, affiliate-heavy content that offered little unique value.',
  },
  {
    name: 'Mobile-First Indexing',
    date: '2018 (gradual rollout)',
    sortKey: 201803,
    category: 'Mobile',
    description:
      'Google began primarily using the mobile version of a page’s content for indexing and ranking, rolled out gradually across sites starting in 2018.',
  },
  {
    name: 'Medic Update',
    date: 'Aug 2018',
    sortKey: 201808,
    category: 'Core Update',
    description:
      'A broad core update that had an outsized effect on health, medical, and other YMYL ("Your Money or Your Life") sites, widely linked to increased emphasis on E-A-T (expertise, authoritativeness, trustworthiness).',
  },
  {
    name: 'BERT',
    date: 'Oct 2019',
    sortKey: 201910,
    category: 'Core Update',
    description:
      'A natural language processing model that improved Google’s ability to understand context and nuance in conversational, longer-tail queries.',
  },
  {
    name: 'Product Reviews Update',
    date: 'Apr 2021',
    sortKey: 202104,
    category: 'Content Quality',
    description:
      'Rewarded in-depth, original product review content backed by real research or testing, and demoted thin reviews that simply rehashed manufacturer descriptions.',
  },
  {
    name: 'Page Experience Update / Core Web Vitals',
    date: 'Jun 2021',
    sortKey: 202106,
    category: 'Page Experience',
    description:
      'Introduced Core Web Vitals (loading performance, interactivity, and visual stability) alongside mobile-friendliness and safe browsing as page experience ranking signals.',
  },
  {
    name: 'Link Spam Update',
    date: 'Jul 2021',
    sortKey: 202107,
    category: 'Spam',
    description:
      'Used Google’s SpamBrain system to more effectively identify and neutralize link spam, including sites participating in link exchanges built purely to manipulate rankings.',
  },
  {
    name: 'Helpful Content Update',
    date: 'Aug 2022',
    sortKey: 202208,
    category: 'Content Quality',
    description:
      'Introduced a site-wide signal aimed at rewarding content written primarily for people, and demoting content produced mainly to attract search engine traffic.',
  },
  {
    name: 'Spam Update',
    date: 'Oct 2022',
    sortKey: 202210,
    category: 'Spam',
    description:
      'Targeted spam techniques such as cloaking, auto-generated content, and expired-domain abuse, using improvements to Google’s automated spam-detection systems.',
  },
  {
    name: 'March 2023 Core Update',
    date: 'Mar 2023',
    sortKey: 202303,
    category: 'Core Update',
    description:
      'A broad core update re-evaluating and re-weighing content and ranking signals across search, part of Google’s regular cadence of core relevance updates.',
  },
  {
    name: 'August 2023 Core Update',
    date: 'Aug 2023',
    sortKey: 202308,
    category: 'Core Update',
    description:
      'A broad core update adjusting how Google assesses and ranks content for relevance and quality, with no single signal or type of content specifically targeted.',
  },
  {
    name: 'October 2023 Core & Spam Updates',
    date: 'Oct 2023',
    sortKey: 202310,
    category: 'Core Update',
    description:
      'A broad core update rolled out alongside a companion spam update, together adjusting content relevance signals and further cracking down on spam techniques.',
  },
  {
    name: 'November 2023 Core Update & Reviews Update',
    date: 'Nov 2023',
    sortKey: 202311,
    category: 'Core Update',
    description:
      'A broad core update shipped alongside a further Reviews Update, continuing to refine how in-depth, first-hand review content is assessed and ranked.',
  },
  {
    name: 'March 2024 Core Update',
    date: 'Mar 2024',
    sortKey: 202403,
    category: 'Core Update',
    description:
      'A major, months-long combined core and spam update that introduced new spam policies targeting scaled content abuse, site reputation abuse ("parasite SEO"), and expired-domain abuse. Google stated the goal was to significantly reduce low-quality, unoriginal content in search results.',
  },
  {
    name: 'August 2024 Core Update',
    date: 'Aug 2024',
    sortKey: 202408,
    category: 'Core Update',
    description:
      'A broad core update continuing Google’s post-March 2024 effort to better surface original, helpful content and further reduce unhelpful, search-engine-first content.',
  },
  {
    name: 'December 2024 Core Update',
    date: 'Dec 2024',
    sortKey: 202412,
    category: 'Core Update',
    description:
      'A broad core update re-assessing content relevance and quality signals site-wide, part of Google’s ongoing regular core update cadence.',
  },
];

const CATEGORIES: UpdateCategory[] = [
  'Content Quality',
  'Links',
  'Core Update',
  'Mobile',
  'Local',
  'Page Experience',
  'Spam',
];

export default function GoogleAlgorithmTrackerClient() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<UpdateCategory | 'All'>('All');

  const sorted = useMemo(
    () => [...UPDATES].sort((a, b) => b.sortKey - a.sortKey),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter(u => {
      const matchesCategory = category === 'All' || u.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.description.toLowerCase().includes(q) ||
        u.category.toLowerCase().includes(q)
      );
    });
  }, [sorted, query, category]);

  const reset = () => {
    setQuery('');
    setCategory('All');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Google Algorithm Update Tracker</span>
        <button type="button" onClick={reset} className="tb-v2-btn-sm">
          Reset Filters
        </button>
      </div>

      <div className="tb-v2-tool-card" style={{ marginTop: 0 }}>
        <div style={{ padding: '20px 20px 0' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="tb-v2-input"
            placeholder="Search updates by name, description, or category..."
            aria-label="Search algorithm updates"
          />
        </div>

        <div className="flex flex-wrap gap-2" style={{ padding: '14px 20px 0' }}>
          <button
            type="button"
            onClick={() => setCategory('All')}
            className="tb-v2-btn-sm"
            style={{
              borderRadius: 999,
              background: category === 'All' ? 'var(--red)' : undefined,
              color: category === 'All' ? '#fff' : undefined,
              borderColor: category === 'All' ? 'var(--red)' : undefined,
            }}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className="tb-v2-btn-sm"
              style={{
                borderRadius: 999,
                background: category === cat ? 'var(--red)' : undefined,
                color: category === cat ? '#fff' : undefined,
                borderColor: category === cat ? 'var(--red)' : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="tb-v2-tool-output-body">
          <div className="flex justify-between items-center mb-2">
            <span className="tb-v2-tool-label">
              {filtered.length} update{filtered.length === 1 ? '' : 's'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <p style={{ color: 'var(--fg-2)', fontSize: 14 }}>
              No updates match your search or filter.
            </p>
          ) : (
            <ol className="flex flex-col gap-3" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {filtered.map(update => (
                <li
                  key={update.name}
                  style={{
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px 16px',
                    background: 'var(--surface-2)',
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--fg-0)' }}>
                      {update.name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--fg-2)',
                        border: '1px solid var(--line)',
                        borderRadius: 999,
                        padding: '2px 8px',
                      }}
                    >
                      {update.date}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#fff',
                        background: 'var(--red)',
                        borderRadius: 999,
                        padding: '2px 8px',
                      }}
                    >
                      {update.category}
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-1)', margin: 0 }}>
                    {update.description}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
