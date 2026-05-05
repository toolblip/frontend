const fs = require('fs');
const path = require('path');

const missing = ['JwtTool','KeywordDifficultyTool','MakeBackgroundTransparent','MetaTagsTool','MetaTool','MockPortCheck','NDAGenerator','PodcastWriter','PortTool','PressureConverter','RegexExplainer','RegexTool','RemoveTextPhoto','RemoveWatermarkPhoto','RepairDefects','SEOMetaBuilder','SERPQuick','SearchConsoleInsights','SerpTool','ShortenContent','SitemapHTMLNew','SitemapURLsExtractor','TextSortTool','TriviaGenerator','UAParserExpress','UnitConversionTool','WordFreqExpress'];

missing.forEach(name => {
  const fpath = path.join('components/tools', name + 'Client.tsx');
  if (fs.existsSync(fpath)) {
    console.log('Exists:', name + 'Client.tsx');
    return;
  }

  const code = [
    '"use client";',
    "import { useState } from 'react';",
    '',
    'interface Props {',
    '  tool?: {',
    '    name: string;',
    '    description: string;',
    '  };',
    '}',
    '',
    'export default function ' + name + '({ tool }: Props) {',
    '  const [input, setInput] = useState(\'\');',
    '  const [output, setOutput] = useState(\'\');',
    '',
    '  const process = () => {',
    "    setOutput('Processed: ' + input);",
    '  };',
    '',
    '  return (',
    '    <div className="max-w-2xl mx-auto p-6">',
    '      <h1 className="text-2xl font-bold mb-4">{tool?.name ?? "' + name + '"}</h1>',
    "      <p className=\"text-gray-600 mb-6\">{tool?.description ?? 'Tool description'}</p>",
    '      <textarea',
    '        className="w-full p-3 border rounded-lg mb-4 font-mono text-sm"',
    '        rows={6}',
    '        value={input}',
    '        onChange={e => setInput(e.target.value)}',
    '        placeholder="Enter input..."',
    '      />',
    '      <button',
    '        onClick={process}',
    '        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"',
    '      >',
    '        Process',
    '      </button>',
    '      {output && (',
    '        <div className="mt-4 p-3 bg-gray-50 rounded-lg font-mono text-sm whitespace-pre-wrap">',
    '          {output}',
    '        </div>',
    '      )}',
    '    </div>',
    '  );',
    '}',
    '',
  ].join('\n');

  fs.writeFileSync(fpath, code);
  console.log('Created:', name + 'Client.tsx');
});

console.log('\nDone. Created', missing.length, 'stub files');
