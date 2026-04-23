import type { Tool } from '@/data/tools';
import WordCounterClient from '@/components/tools/WordCounterClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';
import Base64Client from '@/components/tools/Base64Client';
import UrlEncodeClient from '@/components/tools/UrlEncodeClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';
import GenericToolUI from '@/components/tools/GenericToolUI';

interface ToolDetailProps {
  tool: Tool;
}

// Map of tool slugs to their client components
const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'word-counter': WordCounterClient,
  'character-counter': CharacterCounterClient,
  'case-converter': CaseConverterClient,
  'base64': Base64Client,
  'url-encode': UrlEncodeClient,
  'json-formatter': JsonFormatterClient,
};

export default function ToolDetail({ tool }: ToolDetailProps) {
  const ToolComponent = TOOL_COMPONENTS[tool.slug];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{tool.emoji}</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {tool.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {tool.category}
          </span>
        </div>
        <p className="mt-3 text-gray-500 dark:text-gray-400 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Tool UI or Coming Soon */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        {ToolComponent ? (
          <ToolComponent />
        ) : (
          <ComingSoon tool={tool} />
        )}
      </div>
    </div>
  );
}

function ComingSoon({ tool }: { tool: Tool }) {
  return (
    <GenericToolUI
      inputLabel="Input"
      inputPlaceholder="This tool is coming soon. Enter text to preview..."
      outputLabel="Output"
      process={(input) => {
        // Generic placeholder: echo the input back
        return `[Coming soon] ${tool.name} will process: "${input}"`;
      }}
      actionLabel="Process"
    />
  );
}
