'use client';

import { useState } from 'react';

interface TweetDraft {
  hook: string;
  body: string;
  cta: string;
  thread: boolean;
}

export default function AiTwitterGeneratorClient() {
  const [topic, setTopic] = useState('');
  const [hookType, setHookType] = useState<'question' | 'statement' | 'stat' | 'quote'>('statement');
  const [ctaType, setCtaType] = useState<'follow' | 'like' | 'share' | 'reply' | 'none'>('follow');
  const [tweetCount, setTweetCount] = useState(3);
  const [drafts, setDrafts] = useState<TweetDraft[]>([]);
  const [copied, setCopied] = useState(false);

  const generateHooks = (): string[] => {
    const hooks: Record<string, string[]> = {
      question: [
        `Have you ever wondered how to ${topic}?`,
        `What if I told you ${topic}?`,
        `Does ${topic} sound too good to be true?`,
        `Want to know the secret to ${topic}?`,
      ],
      statement: [
        `Here's why ${topic} will change everything.`,
        `Everything you need to know about ${topic}.`,
        `The truth about ${topic} nobody tells you.`,
        `${topic} is simpler than you think.`,
      ],
      stat: [
        `97% of people don't know this about ${topic}.`,
        `3 reasons ${topic} matters more than ever.`,
        `The average person spends 10x too much time on ${topic}.`,
        `5 surprising facts about ${topic} you didn't know.`,
      ],
      quote: [
        `"${topic} is not a destination but a journey."  -  Unknown`,
        `"Success in ${topic} comes from consistency."  -  Expert`,
        `"The best time to focus on ${topic} was 5 years ago. The second best is now."`,
        `"Master ${topic} and you'll master your craft."  -  Proverb`,
      ],
    };
    return hooks[hookType];
  };

  const ctas: Record<string, string[]> = {
    follow: ['Follow for more tips!', 'Follow for daily insights!', 'Follow for exclusive content!'],
    like: ['Like if you agree!', 'Double tap if this resonates!', '❤️ if you found this helpful!'],
    share: ['Share with someone who needs this!', 'Retweet to spread the knowledge!', 'Tag a friend who should see this!'],
    reply: ['Drop your thoughts below!', 'What do you think? Let me know!', 'Comments open  -  I would love to hear from you!'],
    none: [],
  };

  const generateLorem = (topic: string, sentences: number): string => {
    const fillers = [
      'many professionals are discovering that',
      'recent studies have shown',
      'industry experts recommend',
      'the key to success lies in',
      'here\'s what most people miss about',
      'after working with hundreds of clients on',
      'the biggest misconception around',
      'practical application of',
      'real results from implementing',
      'the fundamentals of',
    ];
    const filler = fillers[Math.floor(Math.random() * fillers.length)];
    return `(${filler} ${topic}) ${sentences} key points to consider. `.repeat(sentences).trim();
  };

  const generate = () => {
    if (!topic.trim()) return;

    const newDrafts: TweetDraft[] = [];
    const hooks = generateHooks();
    const ctaList = ctas[ctaType];

    for (let i = 0; i < tweetCount; i++) {
      const hook = hooks[Math.floor(Math.random() * hooks.length)];
      const body = generateLorem(topic, 2);
      const cta = ctaList.length > 0 ? ctaList[Math.floor(Math.random() * ctaList.length)] : '';
      const isThread = tweetCount > 1 && i < tweetCount - 1;

      newDrafts.push({ hook, body, cta, thread: isThread });
    }

    setDrafts(newDrafts);
  };

  const formatTweet = (draft: TweetDraft): string => {
    const parts = [draft.hook];
    if (draft.body) parts.push(draft.body);
    if (draft.cta) parts.push(draft.cta);
    if (draft.thread) parts.push('\n↓');
    return parts.join('\n\n');
  };

  const copyAll = () => {
    const text = drafts.map(formatTweet).join('\n\n---\n\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Topic</span>
      </div>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter your tweet topic..."
        className="tb-v2-input"
        style={{ marginBottom: 12 }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <div>
          <label className="tb-v2-tool-label" style={{ fontSize: 12, marginBottom: 4 }}>Hook Type</label>
          <select value={hookType} onChange={(e) => setHookType(e.target.value as typeof hookType)} className="tb-v2-input">
            <option value="statement">Statement</option>
            <option value="question">Question</option>
            <option value="stat">Statistic</option>
            <option value="quote">Quote</option>
          </select>
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{ fontSize: 12, marginBottom: 4 }}>CTA</label>
          <select value={ctaType} onChange={(e) => setCtaType(e.target.value as typeof ctaType)} className="tb-v2-input">
            <option value="follow">Follow</option>
            <option value="like">Like</option>
            <option value="share">Share</option>
            <option value="reply">Reply</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label className="tb-v2-tool-label" style={{ fontSize: 12, marginBottom: 4 }}>Number of Tweets</label>
        <input
          type="number"
          min={1}
          max={10}
          value={tweetCount}
          onChange={(e) => setTweetCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
          className="tb-v2-input"
        />
      </div>

      <button type="button" onClick={generate} className="tb-v2-primary-btn" style={{ width: '100%' }}>
        Generate Tweet Drafts
      </button>

      {drafts.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Tweet Drafts</span>
            <button type="button" onClick={copyAll} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy All'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {drafts.map((draft, idx) => (
                <div key={idx} style={{
                  padding: 12,
                  background: 'var(--tb-bg-primary)',
                  borderRadius: 8,
                  border: '1px solid var(--tb-bg-secondary)'
                }}>
                  <div style={{ fontSize: 11, color: 'var(--tb-text-muted)', marginBottom: 6 }}>
                    Tweet {idx + 1}{draft.thread ? ' (Thread starter)' : ''}
                  </div>
                  <pre style={{
                    fontFamily: 'inherit',
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.5
                  }}>
                    {formatTweet(draft)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
