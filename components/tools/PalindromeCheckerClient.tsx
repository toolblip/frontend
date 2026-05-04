'use client';

import { useState, useMemo } from 'react';

interface Analysis {
  isPalindrome: boolean;
  cleaned: string;
  reversed: string;
  length: number;
  middle: string;
  firstHalf: string;
  secondHalf: string;
}

export default function PalindromeCheckerClient() {
  const [input, setInput] = useState('');

  const analysis = useMemo<Analysis>(() => {
    if (!input.trim()) {
      return {
        isPalindrome: false,
        cleaned: '',
        reversed: '',
        length: 0,
        middle: '',
        firstHalf: '',
        secondHalf: '',
      };
    }

    // Clean the string: remove non-alphanumeric and convert to lowercase
    const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, '');
    const reversed = cleaned.split('').reverse().join('');
    const isPalindrome = cleaned === reversed && cleaned.length > 0;

    const halfLen = Math.floor(cleaned.length / 2);
    const firstHalf = cleaned.slice(0, halfLen);
    const secondHalf = cleaned.slice(cleaned.length - halfLen);
    const middle = cleaned.length % 2 === 1 ? cleaned[halfLen] : '';

    return {
      isPalindrome,
      cleaned,
      reversed,
      length: cleaned.length,
      middle,
      firstHalf,
      secondHalf,
    };
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.cleaned);
  };

  const examples = [
    'racecar',
    'A man a plan a canal Panama',
    'Was it a car or a cat I saw',
    'hello',
    'madam',
    'rotor',
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Palindrome Checker</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter text to check</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-lg h-32 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Enter text or phrase to check if it's a palindrome..."
        />
      </div>

      {input && (
        <div className="mb-6">
          <div className={`p-6 rounded-lg text-center ${analysis.isPalindrome ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <div className={`text-3xl font-bold mb-2 ${analysis.isPalindrome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {analysis.isPalindrome ? '✓ PALINDROME' : '✗ NOT A PALINDROME'}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {analysis.cleaned ? (
                <span>"{analysis.cleaned}" {analysis.isPalindrome ? 'reads the same forwards and backwards' : 'does not read the same forwards and backwards'}</span>
              ) : (
                <span>Enter text to check</span>
              )}
            </div>
          </div>
        </div>
      )}

      {analysis.cleaned && analysis.length > 1 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Cleaned</div>
            <div className="font-mono text-lg">{analysis.cleaned}</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Reversed</div>
            <div className="font-mono text-lg">{analysis.reversed}</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Length</div>
            <div className="font-mono text-lg">{analysis.length}</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Middle Character</div>
            <div className="font-mono text-lg">{analysis.middle || '(none)'}</div>
          </div>
        </div>
      )}

      {analysis.length > 1 && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 mb-2">Visual Breakdown</div>
          <div className="font-mono text-lg flex justify-center gap-1">
            {analysis.firstHalf.split('').map((char, i) => (
              <span key={i} className="text-blue-500">{char}</span>
            ))}
            {analysis.middle && <span className="text-yellow-500 font-bold">{analysis.middle}</span>}
            {analysis.secondHalf.split('').reverse().map((char, i) => (
              <span key={i} className="text-blue-500">{char}</span>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {analysis.firstHalf} {analysis.middle && `[${analysis.middle}]`} {analysis.secondHalf}
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Copy Cleaned Text
        </button>
      </div>

      <div className="mt-8">
        <h3 className="font-medium mb-3">Try these examples:</h3>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => setInput(example)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">What is a Palindrome?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A palindrome is a word, phrase, number, or other sequence of characters that reads the same 
          forward and backward (ignoring spaces, punctuation, and capitalization). Examples include 
          "racecar", "level", and "madam".
        </p>
      </div>
    </div>
  );
}
