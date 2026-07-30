'use client';

import { useState } from 'react';

interface EmailFields {
  recipient: string;
  subject: string;
  goal: string;
  tone: 'formal' | 'friendly' | 'casual' | 'persuasive';
  product: string;
  cta: string;
}

export default function ColdEmailWriterClient() {
  const [fields, setFields] = useState<EmailFields>({
    recipient: '',
    subject: '',
    goal: '',
    tone: 'formal',
    product: '',
    cta: '',
  });
  const [generated, setGenerated] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setIsGenerating(true);

    const bodyTemplates: Record<string, string[]> = {
      formal: [
        `I am reaching out regarding ${fields.goal}. ${fields.product && `Our solution has helped teams like yours achieve`} significant improvements in their workflow.

${fields.product && `We offer ${fields.product}`}, which I believe could be valuable given your current objectives.

Would you be open to a brief call this week to discuss how we might support your goals?

Best regards`,
        `I hope this message finds you well. I wanted to follow up regarding ${fields.goal}.

${fields.product && `Our team has developed ${fields.product}, which addresses`} the exact challenge you may be facing.

I would welcome the opportunity to share more details at your convenience.

Kind regards`,
      ],
      friendly: [
        `I came across your profile and thought ${fields.goal} might resonate with you.

${fields.product && `We've been working on ${fields.product}, and it's been a game-changer for teams`} similar to yours.

Wanna grab a quick coffee (virtual or real) and chat about it?

Let me know what works for you!`,
        `${fields.goal} is something I think you might be interested in. ${fields.product && `We've built ${fields.product}`} specifically for people tackling challenges like yours.

Would love to get your thoughts - even a 15-min call would be great!`,
      ],
      casual: [
        `Been meaning to reach out about ${fields.goal} - ${fields.product && `we just launched ${fields.product} and`} thought you might vibe with it.

No pressure at all, but if you're ever curious, I'd love to show you what we've been building.

Worst case, we just chat about what you're working on!`,
        `${fields.goal} is something I think you'd find valuable. ${fields.product && `We're behind ${fields.product}`}, and honestly it's been super fun to work on.

Got 15 mins for a quick chat sometime? I'd love to hear what you're working on too!`,
      ],
      persuasive: [
        `What if you could ${fields.goal} without the usual headache?

${fields.product && `That's exactly what ${fields.product} does - it's designed to`} eliminate the friction you're probably dealing with.

I've shown this to other ${fields.recipient || 'professionals'} and they've seen results within weeks.

Are you available for a 20-min call this week? I'd love to show you exactly how it works.`,
      ],
    };

    const bodies = bodyTemplates[fields.tone];
    const body = bodies[Math.floor(Math.random() * bodies.length)];

    const subjectLine = fields.subject || (
      fields.tone === 'casual' ? `Quick thought on ${fields.goal.split(' ').slice(0, 3).join(' ')}` :
      fields.tone === 'friendly' ? `${fields.goal.split(' ').slice(0, 4).join(' ')} - thoughts?` :
      `Regarding ${fields.goal.split(' ').slice(0, 5).join(' ')}`
    );

    const greeting = fields.recipient ? `Hi ${fields.recipient},` : 'Hi there,';

    const email = `Subject: ${subjectLine}

${greeting}

${body}
${fields.cta ? `\n${fields.cta}` : ''}`;

    setTimeout(() => {
      setGenerated(email);
      setIsGenerating(false);
    }, 500);
  };

  const copyEmail = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadExample = () => {
    setFields({
      recipient: 'Marketing Managers',
      subject: '',
      goal: 'getting a demo call scheduled',
      product: 'an AI-powered analytics platform',
      tone: 'friendly',
      cta: 'First 3 people get a free audit',
    });
    setGenerated('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Cold Email Writer</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Recipient Name/Role</label>
          <input
            type="text"
            value={fields.recipient}
            onChange={(e) => setFields({ ...fields, recipient: e.target.value })}
            className="tb-v2-input"
            placeholder="e.g., Marketing Managers"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Subject Line (optional - auto-generates if empty)</label>
          <input
            type="text"
            value={fields.subject}
            onChange={(e) => setFields({ ...fields, subject: e.target.value })}
            className="tb-v2-input"
            placeholder="Leave empty for auto-generated subject"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Goal of the Email</label>
          <input
            type="text"
            value={fields.goal}
            onChange={(e) => setFields({ ...fields, goal: e.target.value })}
            className="tb-v2-input"
            placeholder="e.g., getting a demo call scheduled"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Product/Service (optional)</label>
          <input
            type="text"
            value={fields.product}
            onChange={(e) => setFields({ ...fields, product: e.target.value })}
            className="tb-v2-input"
            placeholder="e.g., an AI-powered analytics platform"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Tone</label>
          <div className="tb-v2-mode-tabs">
            {(['formal', 'friendly', 'casual', 'persuasive'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setFields({ ...fields, tone: t })}
                className={`tb-v2-mode-tab ${fields.tone === t ? 'on' : ''}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Call to Action / P.S. (optional)</label>
          <input
            type="text"
            value={fields.cta}
            onChange={(e) => setFields({ ...fields, cta: e.target.value })}
            className="tb-v2-input"
            placeholder="e.g., First 3 people get a free audit"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={isGenerating || !fields.goal}
        className="tb-v2-btn tb-v2-btn-primary"
        style={{ alignSelf: 'flex-start' }}
      >
        {isGenerating ? 'Generating...' : 'Generate Email'}
      </button>

      {!generated ? (
        <p className="tb-v2-empty">Fill in the goal and other details above, then generate to see your email here.</p>
      ) : (
        <div className="relative">
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Generated Email</span>
            <button
              type="button"
              onClick={copyEmail}
              className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="tb-v2-tool-output-body" style={{ whiteSpace: 'pre-wrap' }}>
            {generated}
          </pre>
        </div>
      )}
    </div>
  );
}
