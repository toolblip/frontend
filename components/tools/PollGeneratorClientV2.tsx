'use client';

import { useMemo, useState } from 'react';

type PollFormat = 'twitter' | 'instagram' | 'survey';

interface Props {
  tool?: {
    name: string;
    slug: string;
    description: string;
  };
}

const FORMAT_LABELS: Record<PollFormat, string> = {
  twitter: 'Twitter/X',
  instagram: 'Instagram story',
  survey: 'Survey',
};

function cleanTopic(input: string) {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[\s.,;:!?]+$/g, '');
}

function titleCase(text: string) {
  return text
    .split(' ')
    .map((word) => {
      if (!word) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function parsePrompt(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { question: '', options: [] as string[] };
  }

  if (trimmed.includes('|')) {
    const parts = trimmed.split('|').map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return {
        question: cleanTopic(parts[0]),
        options: parts.slice(1, 5),
      };
    }
  }

  const lines = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length >= 2) {
    return {
      question: cleanTopic(lines[0]),
      options: lines.slice(1, 5),
    };
  }

  const commaParts = trimmed.split(',').map((part) => part.trim()).filter(Boolean);
  if (commaParts.length >= 3) {
    return {
      question: cleanTopic(commaParts[0]),
      options: commaParts.slice(1, 5),
    };
  }

  return { question: cleanTopic(trimmed), options: [] as string[] };
}

function fallbackQuestion(topic: string, format: PollFormat) {
  const subject = topic ? titleCase(topic) : 'this idea';

  if (format === 'instagram') return `Would you try ${subject}?`;
  if (format === 'survey') return `How would you rate ${subject}?`;
  return `What do you think about ${subject}?`;
}

function fallbackOptions(format: PollFormat) {
  if (format === 'instagram') return ['Yes', 'No'];
  if (format === 'survey') {
    return ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];
  }

  return ['Love it', 'Like it', 'Needs work', 'Not for me'];
}

function toHashtag(text: string) {
  const parts = cleanTopic(text)
    .split(' ')
    .map((part) => part.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(Boolean)
    .slice(0, 3);

  if (parts.length === 0) return '#Poll';

  return `#${parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')}`;
}

function buildHashtags(topic: string, format: PollFormat) {
  const tags = [topic ? toHashtag(topic) : '#Poll'];

  if (format === 'twitter') {
    tags.push('#Poll');
  } else if (format === 'instagram') {
    tags.push('#StoryPoll');
  } else {
    tags.push('#Feedback');
  }

  return Array.from(new Set(tags)).slice(0, 2);
}

function buildOutput(rawInput: string, format: PollFormat) {
  const parsed = parsePrompt(rawInput);
  const topic = parsed.question || cleanTopic(rawInput);
  const question = topic ? titleCase(topic) : '';
  const questionText = parsed.question ? parsed.question : fallbackQuestion(topic, format);
  const parsedOptions = parsed.options.filter(Boolean).slice(0, format === 'survey' ? 5 : 4);
  const options = parsedOptions.length > 0 ? parsedOptions : fallbackOptions(format);
  const hashtags = buildHashtags(topic, format);

  const lines: string[] = [];
  lines.push(`${FORMAT_LABELS[format]} poll`);
  lines.push(`Question: ${questionText}`);
  lines.push('');

  if (format === 'twitter') {
    lines.push('Suggested post:');
    lines.push(question ? `Vote on ${question}.` : 'Vote below and share your take.');
    lines.push('');
    lines.push('Post-ready options:');
    options.slice(0, 4).forEach((option, index) => {
      lines.push(`${String.fromCharCode(65 + index)}. ${option}`);
    });
    lines.push('');
    lines.push(`Hashtags: ${hashtags.join(' ')}`);
    lines.push('');
    lines.push('Tip: keep the question short and the options mutually exclusive.');
  } else if (format === 'instagram') {
    lines.push('Story caption:');
    lines.push(question ? `Tap to vote on ${question}.` : 'Tap to vote and share your pick.');
    lines.push('');
    lines.push('Story poll sticker:');
    lines.push(`1. ${options[0] ?? 'Yes'}`);
    lines.push(`2. ${options[1] ?? 'No'}`);
    lines.push('');
    lines.push(`Hashtags: ${hashtags.join(' ')}`);
    lines.push('');
    lines.push('Tip: Instagram polls work best with two quick choices.');
  } else {
    const surveyOptions = options.length >= 5 ? options.slice(0, 5) : fallbackOptions('survey');
    lines.push('Survey intro:');
    lines.push(question ? `Use this to collect feedback on ${question}.` : 'Use this to collect focused feedback.');
    lines.push('');
    lines.push('Survey scale:');
    surveyOptions.forEach((option, index) => {
      lines.push(`${index + 1}. ${option}`);
    });
    lines.push('');
    lines.push('Tip: use surveys for longer feedback and more nuanced answers.');
  }

  if (parsedOptions.length > 0) {
    lines.push('');
    lines.push('Imported options from your input.');
  }

  return lines.join('\n');
}

export default function PollGeneratorClient({ tool = { name: '', slug: '', description: '' } }: Props) {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState<PollFormat>('twitter');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const helperText = useMemo(() => {
    if (format === 'twitter') return 'Use a topic or paste a question with options separated by |, commas, or new lines.';
    if (format === 'instagram') return 'Two quick choices work best for story polls.';
    return 'Survey mode expands to a 5-point scale by default.';
  }, [format]);

  const handleProcess = async () => {
    const nextOutput = buildOutput(input, format);
    setIsLoading(true);
    try {
      setOutput(nextOutput);
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore clipboard failures
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">{tool.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-medium" htmlFor="poll-format">
              Format
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">Choose where you want to post it</span>
          </div>
          <div id="poll-format" role="tablist" aria-label="Poll format" className="grid grid-cols-3 gap-2">
            {(Object.keys(FORMAT_LABELS) as PollFormat[]).map((item) => {
              const selected = format === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setFormat(item)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    selected
                      ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-950/30 dark:text-red-200'
                      : 'border-gray-200 text-gray-700 hover:border-red-200 hover:bg-red-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-800 dark:hover:bg-red-950/30'
                  }`}
                >
                  {FORMAT_LABELS[item]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="poll-input">
            Topic or poll prompt
          </label>
          <textarea
            id="poll-input"
            className="w-full h-32 rounded-xl border p-3 font-mono text-sm dark:bg-gray-800 dark:border-gray-700"
            placeholder="Enter your text..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
        </div>

        <button
          type="button"
          onClick={handleProcess}
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Process'}
        </button>

        {output && (
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-medium" htmlFor="poll-output">
                Output
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-800 dark:hover:bg-red-950/30"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              id="poll-output"
              readOnly
              value={output}
              className="min-h-56 w-full rounded-xl border p-4 font-mono text-sm whitespace-pre-wrap dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        )}
      </div>
    </div>
  );
}
