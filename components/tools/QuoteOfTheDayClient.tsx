'use client';

import { useState, useMemo, useCallback } from 'react';

interface Quote {
  text: string;
  author: string;
}

// Public-domain quotes only — every author below died more than 70 years ago.
const QUOTES: Quote[] = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Kindness is the language which the deaf can hear and the blind can see.', author: 'Mark Twain' },
  { text: 'It is better to keep your mouth closed and let people think you are a fool than to open it and remove all doubt.', author: 'Mark Twain' },
  { text: 'The two most important days in your life are the day you are born and the day you find out why.', author: 'Mark Twain' },
  { text: 'Courage is resistance to fear, mastery of fear, not absence of fear.', author: 'Mark Twain' },
  { text: 'Whatever you are, be a good one.', author: 'Abraham Lincoln' },
  { text: 'I am a slow walker, but I never walk back.', author: 'Abraham Lincoln' },
  { text: 'Character is like a tree and reputation like its shadow. The shadow is what we think of it; the tree is the real thing.', author: 'Abraham Lincoln' },
  { text: "Nearly all men can stand adversity, but if you want to test a man's character, give him power.", author: 'Abraham Lincoln' },
  { text: 'You have power over your mind, not outside events. Realize this, and you will find strength.', author: 'Marcus Aurelius' },
  { text: 'Waste no more time arguing about what a good man should be. Be one.', author: 'Marcus Aurelius' },
  { text: 'The happiness of your life depends upon the quality of your thoughts.', author: 'Marcus Aurelius' },
  { text: 'If it is not right, do not do it; if it is not true, do not say it.', author: 'Marcus Aurelius' },
  { text: 'The best revenge is to be unlike him who performed the injury.', author: 'Marcus Aurelius' },
  { text: 'Our greatest glory is not in never falling, but in rising every time we fall.', author: 'Confucius' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'The man who moves a mountain begins by carrying away small stones.', author: 'Confucius' },
  { text: "Real knowledge is to know the extent of one's ignorance.", author: 'Confucius' },
  { text: 'Everything has beauty, but not everyone sees it.', author: 'Confucius' },
  { text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.', author: 'Ralph Waldo Emerson' },
  { text: 'The only person you are destined to become is the person you decide to be.', author: 'Ralph Waldo Emerson' },
  { text: 'For every minute you remain angry, you give up sixty seconds of peace of mind.', author: 'Ralph Waldo Emerson' },
  { text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson' },
  { text: 'Well done is better than well said.', author: 'Benjamin Franklin' },
  { text: 'By failing to prepare, you are preparing to fail.', author: 'Benjamin Franklin' },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'Tell me and I forget, teach me and I may remember, involve me and I learn.', author: 'Benjamin Franklin' },
  { text: 'Energy and persistence conquer all things.', author: 'Benjamin Franklin' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
  { text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle' },
  { text: 'It is the mark of an educated mind to be able to entertain a thought without accepting it.', author: 'Aristotle' },
  { text: 'Patience is bitter, but its fruit is sweet.', author: 'Aristotle' },
  { text: 'The whole is greater than the sum of its parts.', author: 'Aristotle' },
  { text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates' },
  { text: 'An unexamined life is not worth living.', author: 'Socrates' },
  { text: 'Be as you wish to seem.', author: 'Socrates' },
  { text: 'Luck is what happens when preparation meets opportunity.', author: 'Seneca' },
  { text: 'It is not that we have a short time to live, but that we waste a lot of it.', author: 'Seneca' },
  { text: 'Difficulties strengthen the mind, as labor does the body.', author: 'Seneca' },
  { text: 'I find that the harder I work, the more luck I seem to have.', author: 'Thomas Jefferson' },
  { text: "Do you want to know who you are? Don't ask. Act! Action will delineate and define you.", author: 'Thomas Jefferson' },
  { text: 'Go confidently in the direction of your dreams. Live the life you have imagined.', author: 'Henry David Thoreau' },
  { text: "It's not what you look at that matters, it's what you see.", author: 'Henry David Thoreau' },
  { text: 'Things do not change; we change.', author: 'Henry David Thoreau' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci' },
  { text: 'This above all: to thine own self be true.', author: 'William Shakespeare' },
  { text: 'We know what we are, but know not what we may be.', author: 'William Shakespeare' },
  { text: 'Common sense is not so common.', author: 'Voltaire' },
  { text: 'Doubt is not a pleasant condition, but certainty is absurd.', author: 'Voltaire' },
  { text: 'Even the darkest night will end and the sun will rise.', author: 'Victor Hugo' },
  { text: 'Everyone thinks of changing the world, but no one thinks of changing himself.', author: 'Leo Tolstoy' },
  { text: 'Victory belongs to the most persevering.', author: 'Napoleon Bonaparte' },
  { text: 'In the midst of chaos, there is also opportunity.', author: 'Sun Tzu' },
  { text: 'The supreme art of war is to subdue the enemy without fighting.', author: 'Sun Tzu' },
  { text: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
  { text: 'When I let go of what I am, I become what I might be.', author: 'Lao Tzu' },
  { text: 'A room without books is like a body without a soul.', author: 'Cicero' },
  { text: "It's not what happens to you, but how you react to it that matters.", author: 'Epictetus' },
  { text: 'No man is free who is not master of himself.', author: 'Epictetus' },
  { text: 'Believe you can and you are halfway there.', author: 'Theodore Roosevelt' },
  { text: 'It is hard to fail, but it is worse never to have tried to succeed.', author: 'Theodore Roosevelt' },
  { text: 'Success is to be measured not so much by the position that one has reached in life as by the obstacles which he has overcome.', author: 'Booker T. Washington' },
  { text: 'Once you learn to read, you will be forever free.', author: 'Frederick Douglass' },
  { text: "Whether you think you can, or you think you can't, you're right.", author: 'Henry Ford' },
  { text: 'Failure is simply the opportunity to begin again, this time more intelligently.', author: 'Henry Ford' },
  { text: 'Concentrate your energies, your thoughts, and your capital.', author: 'Andrew Carnegie' },
  { text: 'No one is useless in this world who lightens the burdens of another.', author: 'Charles Dickens' },
  { text: 'I am not afraid of storms, for I am learning how to sail my ship.', author: 'Louisa May Alcott' },
];

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function randomIndex(exclude?: number): number {
  if (QUOTES.length <= 1) return 0;
  let idx = Math.floor(Math.random() * QUOTES.length);
  while (idx === exclude) idx = Math.floor(Math.random() * QUOTES.length);
  return idx;
}

export default function QuoteOfTheDayClient() {
  const dailyIndex = useMemo(() => dayOfYear(new Date()) % QUOTES.length, []);
  const [activeIndex, setActiveIndex] = useState(dailyIndex);
  const [isDaily, setIsDaily] = useState(true);
  const [copied, setCopied] = useState(false);

  const quote = QUOTES[activeIndex];

  const shuffle = useCallback(() => {
    setActiveIndex(prev => randomIndex(prev));
    setIsDaily(false);
  }, []);

  const backToToday = () => {
    setActiveIndex(dailyIndex);
    setIsDaily(true);
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{isDaily ? "Today's Quote" : 'Random Quote'}</span>
        <span className={`tb-v2-status ${isDaily ? 'tb-v2-status-info' : 'tb-v2-status-ok'}`}>
          {isDaily ? 'Stable for the day' : 'Shuffled'}
        </span>
      </div>

      <div style={{ padding: '32px 28px', textAlign: 'center' }}>
        <p style={{ fontSize: 22, lineHeight: 1.5, fontFamily: 'var(--f-display)', fontWeight: 600, color: 'var(--fg-0)' }}>
          &ldquo;{quote.text}&rdquo;
        </p>
        <p style={{ marginTop: 14, fontSize: 14, color: 'var(--fg-2)', fontWeight: 500 }}>— {quote.author}</p>
      </div>

      <div className="tb-v2-toolbar">
        <button type="button" onClick={shuffle} className="tb-v2-btn tb-v2-btn-primary">
          Shuffle / Random Quote
        </button>
        {!isDaily && (
          <button type="button" onClick={backToToday} className="tb-v2-btn">
            Back to Today&apos;s Quote
          </button>
        )}
        <button type="button" onClick={copyQuote} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy Quote'}
        </button>
      </div>

      <div className="tb-v2-section" style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>
        Quote of the Day is picked deterministically from the date, so it stays the same all day and
        changes tomorrow. All quotes are from public-domain authors. {QUOTES.length} quotes in the collection.
      </div>
    </div>
  );
}
