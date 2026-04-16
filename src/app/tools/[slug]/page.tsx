import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';
import Link from 'next/link';

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors">
        ← All Tools
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{tool.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
          <span className="inline-block mt-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
            {tool.category}
          </span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">{tool.description}</p>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <ToolUI slug={tool.slug} />
      </div>
    </div>
  );
}

function ToolUI({ slug }: { slug: string }) {
  switch (slug) {
    case 'word-counter':
      return <WordCounter />;
    case 'character-counter':
      return <CharacterCounter />;
    case 'case-converter':
      return <CaseConverter />;
    case 'base64':
      return <Base64Codec />;
    case 'url-encode':
      return <UrlCodec />;
    case 'json-formatter':
      return <JsonFormatter />;
    default:
      return <ComingSoon />;
  }
}

function ComingSoon() {
  return (
    <div className="p-8 text-center">
      <p className="text-3xl mb-3">🚧</p>
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Coming Soon</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm">This tool UI is still being built. Check back soon!</p>
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <textarea
          readOnly
          placeholder="Input will go here..."
          rows={4}
          className="w-full bg-transparent text-gray-700 dark:text-gray-300 text-sm resize-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
        />
        <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 text-xs text-center">
          Output will appear here
        </div>
      </div>
    </div>
  );
}

// ─── Word Counter ──────────────────────────────────────────────────────────────
function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    const paragraphs = trimmed ? text.split(/\n\n+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpace, sentences, paragraphs, readingTime };
  }, [text]);

  const StatBadge = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg min-w-[80px]">
      <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</span>
    </div>
  );

  return (
    <div className="p-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={6}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
      />
      <div className="flex flex-wrap gap-3 mt-4">
        <StatBadge label="Words" value={stats.words} />
        <StatBadge label="Characters" value={stats.chars} />
        <StatBadge label="No Spaces" value={stats.charsNoSpace} />
        <StatBadge label="Sentences" value={stats.sentences} />
        <StatBadge label="Paragraphs" value={stats.paragraphs} />
        <StatBadge label="Read Time" value={stats.readingTime} />
      </div>
    </div>
  );
}

// ─── Character Counter ─────────────────────────────────────────────────────────
function CharacterCounter() {
  const [text, setText] = useState('');
  const limits = [
    { label: 'Twitter / X', limit: 280 },
    { label: 'LinkedIn', limit: 3000 },
    { label: 'Meta Description', limit: 160 },
    { label: 'Google Title', limit: 60 },
  ];

  return (
    <div className="p-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={5}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
      />
      <div className="flex items-center justify-between mt-3">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{text.length}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">characters</span>
      </div>
      <div className="space-y-2 mt-4">
        {limits.map(({ label, limit }) => {
          const pct = Math.min(100, (text.length / limit) * 100);
          const over = text.length > limit;
          return (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-300">{label} ({limit})</span>
                <span className={over ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}>{text.length}/{limit}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-400' : 'bg-green-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Case Converter ────────────────────────────────────────────────────────────
function CaseConverter() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const convert = (style: string) => {
    const t = text.trim();
    if (!t) { setOutput(''); return; }
    let result = '';
    switch (style) {
      case 'upper': result = t.toUpperCase(); break;
      case 'lower': result = t.toLowerCase(); break;
      case 'sentence': result = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(); break;
      case 'title': result = t.replace(/\b\w/g, c => c.toUpperCase()); break;
      case 'camel': result = t.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()); break;
      case 'snake': result = t.replace(/[\s-]+/g, '_').toLowerCase(); break;
      case 'kebab': result = t.replace(/[\s_]+/g, '-').toLowerCase(); break;
      case 'constant': result = t.replace(/[\s-]+/g, '_').toUpperCase(); break;
      case 'path': result = t.replace(/[\s_]+/g, '/').toLowerCase(); break;
      default: result = t;
    }
    setOutput(result);
  };

  const copy = () => navigator.clipboard.writeText(output);

  const Button = ({ style, label }: { style: string; label: string }) => (
    <button onClick={() => convert(style)} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-700 dark:hover:text-green-300 rounded-lg text-sm transition-colors">
      {label}
    </button>
  );

  return (
    <div className="p-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={4}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
      />
      <div className="flex flex-wrap gap-2 mt-4">
        <Button style="upper" label="UPPER" />
        <Button style="lower" label="lower" />
        <Button style="sentence" label="Sentence" />
        <Button style="title" label="Title Case" />
        <Button style="camel" label="camelCase" />
        <Button style="snake" label="snake_case" />
        <Button style="kebab" label="kebab-case" />
        <Button style="constant" label="CONSTANT_CASE" />
        <Button style="path" label="path/case" />
      </div>
      {output && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">Result</span>
            <button onClick={copy} className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
              {typeof navigator !== 'undefined' && navigator.clipboard ? 'Copy' : ''}
            </button>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Base64 Encode / Decode ────────────────────────────────────────────────────
function Base64Codec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const run = () => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding') + '.');
      setOutput('');
    }
  };

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
        >
          Encode
        </button>
        <button
          onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
        >
          Decode
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 string to decode...'}
        rows={4}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
      />
      <button
        onClick={run}
        className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode → Base64' : 'Decode ← Base64'}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {output && !error && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button onClick={copy} className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Copy</button>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── URL Encode / Decode ───────────────────────────────────────────────────────
function UrlCodec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const run = () => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding') + '.');
      setOutput('');
    }
  };

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
        >
          Encode
        </button>
        <button
          onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
        >
          Decode
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'URL or text to encode...' : 'Encoded URL to decode...'}
        rows={4}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
      />
      <button
        onClick={run}
        className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode → URL Safe' : 'Decode ← URL Safe'}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {output && !error && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button onClick={copy} className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Copy</button>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── JSON Formatter ───────────────────────────────────────────────────────────
function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError('Invalid JSON: ' + (e instanceof Error ? e.message : 'Parse error'));
      setOutput('');
    }
  };

  const minify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError('Invalid JSON: ' + (e instanceof Error ? e.message : 'Parse error'));
      setOutput('');
    }
  };

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="p-6">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        rows={6}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="flex gap-2 mt-3">
        <button onClick={format} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
          Format
        </button>
        <button onClick={minify} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg text-sm font-medium transition-colors">
          Minify
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {output && !error && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button onClick={copy} className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Copy</button>
          </div>
          <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs overflow-auto max-h-64">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
