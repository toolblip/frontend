'use client';

import { useState } from 'react';

type Tone = 'academic' | 'persuasive' | 'analytical' | 'narrative';

const TONE_LABELS: Record<Tone, string> = {
  academic: 'Academic',
  persuasive: 'Persuasive',
  analytical: 'Analytical',
  narrative: 'Narrative',
};

const TRANSITIONS: Record<Tone, string[]> = {
  academic: ['Furthermore', 'In addition', 'Moreover', 'Consequently', 'It follows that'],
  persuasive: ['More importantly', 'Even more compelling', 'Beyond this', 'Clearly then', 'For these reasons'],
  analytical: ['On closer examination', 'This suggests that', 'Building on this', 'A deeper look reveals', 'As a result'],
  narrative: ['Meanwhile', 'Soon after', 'From that point on', 'As events unfolded', 'In the end'],
};

const HOOK_TEMPLATES: Record<Tone, (topic: string) => string> = {
  academic: (topic) => `The subject of ${topic} has drawn sustained attention from scholars and practitioners alike, raising questions that merit careful examination.`,
  persuasive: (topic) => `Few subjects deserve more urgent attention right now than ${topic}, yet it is too often overlooked.`,
  analytical: (topic) => `A close look at ${topic} reveals patterns and tensions that are not obvious at first glance.`,
  narrative: (topic) => `It began, as these things often do, with a simple question about ${topic}.`,
};

interface OutlineParagraph {
  heading: string;
  topicSentence: string;
  bullets: string[];
  transition: string;
}

interface Outline {
  introHook: string;
  thesisRestated: string;
  paragraphs: OutlineParagraph[];
  conclusionSummary: string;
  conclusionThesis: string;
}

function buildOutline(topic: string, thesis: string, paragraphCount: number, tone: Tone): Outline {
  const t = topic.trim();
  const th = thesis.trim();
  const transitions = TRANSITIONS[tone];

  const paragraphs: OutlineParagraph[] = Array.from({ length: paragraphCount }, (_, i) => {
    const n = i + 1;
    return {
      heading: `Body Paragraph ${n}`,
      topicSentence: `Present the ${n === 1 ? 'first' : n === 2 ? 'second' : n === 3 ? 'third' : `${n}th`} reason or piece of evidence supporting the claim that ${th || 'the thesis'}.`,
      bullets: [
        'State the specific point this paragraph will make.',
        'Provide supporting evidence, an example, or a citation.',
        'Explain how this evidence connects back to the thesis.',
      ],
      transition: transitions[i % transitions.length],
    };
  });

  return {
    introHook: HOOK_TEMPLATES[tone](t || 'this topic'),
    thesisRestated: th || 'State your central argument here.',
    paragraphs,
    conclusionSummary: `Briefly restate the main points made across the ${paragraphCount} body paragraph${paragraphCount === 1 ? '' : 's'} above.`,
    conclusionThesis: th ? `Reaffirm that ${th}` : 'Reaffirm your thesis in different words.',
  };
}

function outlineToText(outline: Outline, topic: string): string {
  const lines: string[] = [];
  lines.push(`ESSAY OUTLINE${topic ? `: ${topic}` : ''}`);
  lines.push('');
  lines.push('I. Introduction');
  lines.push(`   Hook: ${outline.introHook}`);
  lines.push(`   Thesis: ${outline.thesisRestated}`);
  lines.push('');
  outline.paragraphs.forEach((p, i) => {
    const roman = ['II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i] || `${i + 2}`;
    lines.push(`${roman}. ${p.heading}`);
    lines.push(`   Topic sentence: ${p.topicSentence}`);
    p.bullets.forEach(b => lines.push(`   - ${b}`));
    lines.push(`   Suggested transition into next paragraph: "${p.transition}"`);
    lines.push('');
  });
  const concLabel = ['II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][outline.paragraphs.length] || `${outline.paragraphs.length + 2}`;
  lines.push(`${concLabel}. Conclusion`);
  lines.push(`   Summary: ${outline.conclusionSummary}`);
  lines.push(`   Restated thesis: ${outline.conclusionThesis}`);
  return lines.join('\n');
}

export default function EssayWriterClient() {
  const [topic, setTopic] = useState('');
  const [thesis, setThesis] = useState('');
  const [paragraphCount, setParagraphCount] = useState(3);
  const [tone, setTone] = useState<Tone>('academic');
  const [outline, setOutline] = useState<Outline | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setOutline(buildOutline(topic, thesis, paragraphCount, tone));
    setCopied(false);
  };

  const loadExample = () => {
    setTopic('the impact of remote work on team collaboration');
    setThesis('remote work strengthens collaboration when paired with deliberate communication practices, but weakens it otherwise');
    setParagraphCount(3);
    setTone('analytical');
    setOutline(null);
  };

  const copyOutline = async () => {
    if (!outline) return;
    await navigator.clipboard.writeText(outlineToText(outline, topic.trim()));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-banner" style={{ margin: 20 }}>
        This tool builds a real, structured essay outline and scaffold from your inputs. It does not use AI to
        write full paragraphs or original prose for you, since a genuine AI writing backend isn't available here.
        Use the generated structure, topic sentences, and transitions as a starting point for your own writing.
      </div>

      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label className="tb-v2-tool-label" htmlFor="essay-topic">Topic</label>
          <input
            id="essay-topic"
            type="text"
            className="tb-v2-input"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. the impact of remote work on team collaboration"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" htmlFor="essay-thesis">Thesis Statement</label>
          <textarea
            id="essay-thesis"
            className="tb-v2-tool-textarea"
            rows={2}
            value={thesis}
            onChange={e => setThesis(e.target.value)}
            placeholder="e.g. remote work strengthens collaboration when paired with deliberate communication practices"
          />
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <label className="tb-v2-tool-label" htmlFor="essay-paragraphs">Body Paragraphs</label>
            <select
              id="essay-paragraphs"
              className="tb-v2-select"
              value={paragraphCount}
              onChange={e => setParagraphCount(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="tb-v2-tool-label" htmlFor="essay-tone">Tone</label>
            <select
              id="essay-tone"
              className="tb-v2-select"
              value={tone}
              onChange={e => setTone(e.target.value as Tone)}
            >
              {(Object.keys(TONE_LABELS) as Tone[]).map(k => <option key={k} value={k}>{TONE_LABELS[k]}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={generate} className="tb-v2-btn tb-v2-btn-primary" disabled={!topic.trim()}>
            Generate Outline
          </button>
          <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
        </div>
      </div>

      {outline && (
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="tb-v2-tool-label">Outline</span>
            <button type="button" onClick={copyOutline} className="tb-v2-btn-sm">{copied ? 'Copied' : 'Copy Outline'}</button>
          </div>
          <div className="tb-v2-tool-pre">
            <div style={{ marginBottom: 12 }}>
              <strong>I. Introduction</strong>
              <div>Hook: {outline.introHook}</div>
              <div>Thesis: {outline.thesisRestated}</div>
            </div>
            {outline.paragraphs.map((p, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <strong>{['II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i] || `${i + 2}`}. {p.heading}</strong>
                <div>Topic sentence: {p.topicSentence}</div>
                <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                  {p.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
                <div>Suggested transition: &quot;{p.transition}&quot;</div>
              </div>
            ))}
            <div>
              <strong>{['II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][outline.paragraphs.length] || `${outline.paragraphs.length + 2}`}. Conclusion</strong>
              <div>Summary: {outline.conclusionSummary}</div>
              <div>Restated thesis: {outline.conclusionThesis}</div>
            </div>
          </div>
        </div>
      )}

      {!outline && <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Enter a topic and thesis, then generate a structured essay outline.</p>}
    </div>
  );
}
