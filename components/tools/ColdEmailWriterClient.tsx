'use client';

import React, { useState } from 'react';

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

  const generate = () => {
    setIsGenerating(true);
    const hooks: Record<string, string[]> = {
      formal: ['I hope this message finds you well.', 'I am reaching out regarding', 'I wanted to introduce you to'],
      friendly: ['I came across your work and', 'I think you might find this interesting because', 'Quick question for you  - '],
      casual: ['Hope you don\'t mind me reaching out! I', 'Been following your work and', 'Wanted to throw an idea your way  - '],
      persuasive: ['I know you\'re busy, but', 'What if I told you', 'Imagine if'],
    };

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

Would love to get your thoughts  -  even a 15-min call would be great!`,
      ],
      casual: [
        `Been meaning to reach out about ${fields.goal}  -  ${fields.product && `we just launched ${fields.product} and`} thought you might vibe with it.

No pressure at all, but if you're ever curious, I'd love to show you what we've been building.

Worst case, we just chat about what you're working on!`,
        `${fields.goal} is something I think you'd find valuable. ${fields.product && `We're behind ${fields.product}`}, and honestly it's been super fun to work on.

Got 15 mins for a quick chat sometime? I'd love to hear what you're working on too!`,
      ],
      persuasive: [
        `What if you could ${fields.goal} without the usual headache?

${fields.product && `That's exactly what ${fields.product} does  -  it's designed to`} eliminate the friction you're probably dealing with.

I've shown this to other ${fields.recipient || 'professionals'} and they've seen results within weeks.

Are you available for a 20-min call this week? I'd love to show you exactly how it works.

${fields.cta ? `P.S. ${fields.cta}` : ''}`,
      ],
    };

    const hook = hooks[fields.tone][Math.floor(Math.random() * hooks[fields.tone].length)];
    const bodies = bodyTemplates[fields.tone];
    const body = bodies[Math.floor(Math.random() * bodies.length)];

    const subjectLine = fields.subject || (
      fields.tone === 'casual' ? `Quick thought on ${fields.goal.split(' ').slice(0, 3).join(' ')}` :
      fields.tone === 'friendly' ? `${fields.goal.split(' ').slice(0, 4).join(' ')}  -  thoughts?` :
      `Regarding ${fields.goal.split(' ').slice(0, 5).join(' ')}`
    );

    const email = `Subject: ${subjectLine}

${hook},

${body}

${fields.cta ? `\n${fields.cta}` : ''}`;

    setTimeout(() => {
      setGenerated(email);
      setIsGenerating(false);
    }, 500);
  };

  const copyEmail = () => navigator.clipboard.writeText(generated);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cold Email Writer</h1>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Recipient Name/Role</label>
          <input
            type="text"
            value={fields.recipient}
            onChange={(e) => setFields({ ...fields, recipient: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="e.g., Marketing Managers"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject Line (optional  -  auto-generates if empty)</label>
          <input
            type="text"
            value={fields.subject}
            onChange={(e) => setFields({ ...fields, subject: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Leave empty for auto-generated subject"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Goal of the Email</label>
          <input
            type="text"
            value={fields.goal}
            onChange={(e) => setFields({ ...fields, goal: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="e.g., getting a demo call scheduled"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product/Service (optional)</label>
          <input
            type="text"
            value={fields.product}
            onChange={(e) => setFields({ ...fields, product: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="e.g., an AI-powered analytics platform"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tone</label>
          <div className="flex gap-4">
            {(['formal', 'friendly', 'casual', 'persuasive'] as const).map(t => (
              <label key={t} className="flex items-center gap-2">
                <input type="radio" checked={fields.tone === t} onChange={() => setFields({ ...fields, tone: t })} />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Call to Action / P.S. (optional)</label>
          <input
            type="text"
            value={fields.cta}
            onChange={(e) => setFields({ ...fields, cta: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="e.g., First 3 people get a free audit"
          />
        </div>
      </div>

      <button
        onClick={generate}
        disabled={isGenerating || !fields.goal}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Generate Email'}
      </button>

      {generated && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Generated Email</span>
            <button onClick={copyEmail} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              Copy
            </button>
          </div>
          <pre className="bg-gray-50 border p-4 rounded whitespace-pre-wrap text-sm">
            {generated}
          </pre>
        </div>
      )}
    </div>
  );
}
