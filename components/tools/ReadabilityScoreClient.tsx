'use client';

import { useState } from 'react';

function getWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function getSentences(text: string): string[] {
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
}

function getVowelCount(text: string): number {
  return (text.match(/[aeiouAEIOU]/g) || []).length;
}

function fleschKincaid(text: string): number {
  const words = getWords(text);
  const sentences = getSentences(text);
  const syllables = getVowelCount(text);
  if (words.length === 0 || sentences.length === 0) return 0;
  return 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length);
}

function fleschKincaidGrade(text: string): number {
  const words = getWords(text);
  const sentences = getSentences(text);
  const syllables = getVowelCount(text);
  if (words.length === 0 || sentences.length === 0) return 0;
  return 0.39 * (words.length / sentences.length) + 11.8 * (syllables / words.length) - 15.59;
}

function smogIndex(text: string): number {
  const sentences = getSentences(text);
  const polysyllables = (text.match(/[aeiouyAEIOUY]{3,}/g) || []).length;
  if (sentences.length === 0) return 0;
  return 1.043 * Math.sqrt(polysyllables * (30 / sentences.length)) + 3.1291;
}

function gradeLevel(score: number): string {
  if (score >= 90) return '5th grade';
  if (score >= 80) return '6th grade';
  if (score >= 70) return '7th grade';
  if (score >= 60) return '8th-9th grade';
  if (score >= 50) return '10th-12th grade';
  if (score >= 30) return 'College';
  return 'College graduate';
}

export default function ReadabilityScoreClient() {
  const [text, setText] = useState('');

  const words = getWords(text);
  const sentences = getSentences(text);
  const fkScore = fleschKincaid(text);
  const fkGrade = fleschKincaidGrade(text);
  const smog = smogIndex(text);

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div>
        <label className="tb-v2-tool-label" style={{marginBottom:6}}>
          Paste your text (minimum 3 sentences for accurate results)
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter at least a few sentences to analyze readability..."
          rows={6}
          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
        />
      </div>
      {words.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Words', value: words.length.toLocaleString() },
              { label: 'Sentences', value: sentences.length.toLocaleString() },
              { label: 'Avg word length', value: text.length > 0 ? (text.replace(/\s/g,'').length / words.length).toFixed(1) : '0' },
              { label: 'Avg sentence length', value: sentences.length > 0 ? (words.length / sentences.length).toFixed(1) : '0' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Flesch Reading Ease', score: fkScore.toFixed(1), level: fkScore >= 60 ? 'Easy' : fkScore >= 30 ? 'Moderate' : 'Difficult', color: fkScore >= 60 ? 'text-red-600' : fkScore >= 30 ? 'text-yellow-600' : 'text-red-600' },
              { label: 'Flesch-Kincaid Grade', score: fkGrade.toFixed(1), level: gradeLevel(fkGrade * 10), color: 'text-gray-900 dark:text-white' },
              { label: 'SMOG Index', score: smog.toFixed(1), level: gradeLevel(smog * 10), color: 'text-gray-900 dark:text-white' },
            ].map(({ label, score, level, color }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{label}</div>
                <div className={`text-3xl font-bold ${color} dark:text-white mb-1`}>{score}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{level}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
