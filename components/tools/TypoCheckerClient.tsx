'use client';

import { useState, useMemo } from 'react';

interface TypoCandidate {
  word: string;
  suggestion: string;
  position: number;
}

const commonTypos: Record<string, string> = {
  'teh': 'the',
  'hte': 'the',
  'adn': 'and',
  'nad': 'and',
  'taht': 'that',
  'thta': 'that',
  'whcih': 'which',
  'hwich': 'which',
  'thier': 'their',
  'tehre': 'there',
  'recieve': 'receive',
  'beleive': 'believe',
  'achive': 'achieve',
  'occured': 'occurred',
  'occuring': 'occurring',
  'untill': 'until',
  'alot': 'a lot',
  'realy': 'really',
  'wierd': 'weird',
  'neccessary': 'necessary',
  'seperate': 'separate',
  'definately': 'definitely',
  'accidently': 'accidentally',
  'agressive': 'aggressive',
  'begining': 'beginning',
  'beginer': 'beginner',
  'bigger': 'bigger',
  'calender': 'calendar',
  'carreer': 'career',
  'catagory': 'category',
  'challange': 'challenge',
  'collegue': 'colleague',
  'colum': 'column',
  'comming': 'coming',
  'commitee': 'committee',
  'compatable': 'compatible',
  'competion': 'competition',
  'concious': 'conscious',
  'convenient': 'convenient',
  'correspondance': 'correspondence',
  'currancy': 'currency',
  'deffinate': 'definite',
  'desparate': 'desperate',
  'develope': 'develop',
  'diffrent': 'different',
  'dissapoint': 'disappoint',
  'embarass': 'embarrass',
  'enviroment': 'environment',
  'existance': 'existence',
  'experince': 'experience',
  'extrordinary': 'extraordinary',
  'foriegn': 'foreign',
  'fourty': 'forty',
  'freind': 'friend',
  'fustrate': 'frustrate',
  'goverment': 'government',
  'grammer': 'grammar',
  'guarentee': 'guarantee',
  'happend': 'happened',
  'humour': 'humor',
  'imediate': 'immediate',
  'impressario': 'impresario',
  'independant': 'independent',
  'interupt': 'interrupt',
  'intresting': 'interesting',
  'knowlege': 'knowledge',
  'lattitude': 'latitude',
  'learned': 'learned',
  'liuke': 'like',
  'maintainance': 'maintenance',
  'mispell': 'misspell',
  'necessery': 'necessary',
  'neighbor': 'neighbor',
  'noticable': 'noticeable',
  'ocassion': 'occasion',
  'occurence': 'occurrence',
  'peform': 'perform',
  'persistant': 'persistent',
  'posession': 'possession',
  'priviledge': 'privilege',
  'probly': 'probably',
  'profesional': 'professional',
  'publically': 'publicly',
  'questionaire': 'questionnaire',
  'realy': 'really',
  'recomend': 'recommend',
  'refered': 'referred',
  'relevent': 'relevant',
  'religious': 'religious',
  'repitition': 'repetition',
  'resaurant': 'restaurant',
  'rythm': 'rhythm',
  'succesful': 'successful',
  'suprise': 'surprise',
  'tommorow': 'tomorrow',
  'tounge': 'tongue',
  'truely': 'truly',
  'usefull': 'useful',
  'wanna': 'want to',
  'wether': 'whether',
  'wich': 'which',
  'writting': 'writing',
};

export default function TypoCheckerClient() {
  const [input, setInput] = useState('');

  const typos = useMemo<TypoCandidate[]>(() => {
    if (!input.trim()) return [];

    const words = input.split(/(\s+)/);
    const candidates: TypoCandidate[] = [];
    let position = 0;

    words.forEach((word) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      
      if (cleanWord && commonTypos[cleanWord]) {
        candidates.push({
          word,
          suggestion: commonTypos[cleanWord],
          position,
        });
      }
      position += word.length;
    });

    return candidates;
  }, [input]);

  const highlightedText = useMemo(() => {
    if (!input || typos.length === 0) return input;

    let result = input;
    let offset = 0;

    typos.forEach((typo) => {
      const index = typo.position + offset;
      const before = result.slice(0, index);
      const word = result.slice(index, index + typo.word.length);
      const after = result.slice(index + typo.word.length);
      
      result = `${before}<mark class="bg-red-200 dark:bg-red-800">${word}</mark>${after}`;
      offset += `<mark class="bg-red-200 dark:bg-red-800">`.length + `</mark>`.length - 2;
    });

    return result;
  }, [input, typos]);

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
  };

  const fixAll = () => {
    let result = input;
    typos.forEach((typo) => {
      const regex = new RegExp(`\\b${typo.word}\\b`, 'gi');
      result = result.replace(regex, (match) => {
        // Preserve case
        if (match[0] === match[0].toUpperCase()) {
          return typo.suggestion.charAt(0).toUpperCase() + typo.suggestion.slice(1);
        }
        return typo.suggestion;
      });
    });
    setInput(result);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Typo Checker</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter text to check</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-lg h-48 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Paste or type your text here to check for typos..."
        />
      </div>

      {input && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm">
            Found <strong>{typos.length}</strong> potential typo{typos.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {typos.length > 0 && (
        <div className="mb-6 flex gap-3">
          <button
            onClick={fixAll}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Fix All
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Copy Original
          </button>
        </div>
      )}

      {typos.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Typos Found</label>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="text-left py-2 px-3">Found</th>
                  <th className="text-left py-2 px-3">Suggestion</th>
                </tr>
              </thead>
              <tbody>
                {typos.map((typo, i) => (
                  <tr key={i} className="border-t border-gray-200 dark:border-gray-600">
                    <td className="py-2 px-3 font-mono text-red-500">{typo.word}</td>
                    <td className="py-2 px-3 font-mono text-green-600 dark:text-green-400">→ {typo.suggestion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {input && typos.length === 0 && (
        <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/30 rounded-lg text-center">
          <div className="text-4xl mb-2">✓</div>
          <p className="text-green-700 dark:text-green-400 font-medium">
            No common typos detected!
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">How it works:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Checks against a dictionary of 100+ common typos</li>
          <li>• Click "Fix All" to automatically correct all found typos</li>
          <li>• Case is preserved when fixing (The → The)</li>
          <li>• Note: Not all corrections may be appropriate for your context</li>
        </ul>
      </div>
    </div>
  );
}
