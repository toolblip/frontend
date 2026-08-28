'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface TypoCandidate {
  word: string;
  suggestion: string;
  position: number;
}

const EXAMPLE = 'I recieve emails from freinds every tommorow morning. Its definately wierd and seperate from teh usual routine.';

const commonTypos: Record<string, string> = {
  teh: 'the',
  hte: 'the',
  adn: 'and',
  nad: 'and',
  taht: 'that',
  thta: 'that',
  whcih: 'which',
  hwich: 'which',
  thier: 'their',
  tehre: 'there',
  recieve: 'receive',
  beleive: 'believe',
  achive: 'achieve',
  occured: 'occurred',
  occuring: 'occurring',
  untill: 'until',
  alot: 'a lot',
  realy: 'really',
  wierd: 'weird',
  neccessary: 'necessary',
  seperate: 'separate',
  definately: 'definitely',
  accidently: 'accidentally',
  agressive: 'aggressive',
  begining: 'beginning',
  beginer: 'beginner',
  calender: 'calendar',
  carreer: 'career',
  catagory: 'category',
  challange: 'challenge',
  collegue: 'colleague',
  colum: 'column',
  comming: 'coming',
  commitee: 'committee',
  compatable: 'compatible',
  competion: 'competition',
  concious: 'conscious',
  correspondance: 'correspondence',
  currancy: 'currency',
  deffinate: 'definite',
  desparate: 'desperate',
  develope: 'develop',
  diffrent: 'different',
  dissapoint: 'disappoint',
  embarass: 'embarrass',
  enviroment: 'environment',
  existance: 'existence',
  experince: 'experience',
  extrordinary: 'extraordinary',
  foriegn: 'foreign',
  fourty: 'forty',
  freind: 'friend',
  fustrate: 'frustrate',
  goverment: 'government',
  grammer: 'grammar',
  guarentee: 'guarantee',
  happend: 'happened',
  imediate: 'immediate',
  independant: 'independent',
  interupt: 'interrupt',
  intresting: 'interesting',
  knowlege: 'knowledge',
  lattitude: 'latitude',
  maintainance: 'maintenance',
  mispell: 'misspell',
  necessery: 'necessary',
  noticable: 'noticeable',
  ocassion: 'occasion',
  occurence: 'occurrence',
  peform: 'perform',
  persistant: 'persistent',
  posession: 'possession',
  priviledge: 'privilege',
  probly: 'probably',
  profesional: 'professional',
  publically: 'publicly',
  questionaire: 'questionnaire',
  recomend: 'recommend',
  refered: 'referred',
  relevent: 'relevant',
  repitition: 'repetition',
  resaurant: 'restaurant',
  rythm: 'rhythm',
  succesful: 'successful',
  suprise: 'surprise',
  tommorow: 'tomorrow',
  tounge: 'tongue',
  truely: 'truly',
  usefull: 'useful',
  wether: 'whether',
  wich: 'which',
  writting: 'writing',
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
        candidates.push({ word, suggestion: commonTypos[cleanWord], position });
      }
      position += word.length;
    });

    return candidates;
  }, [input]);

  const fixAll = () => {
    let result = input;
    typos.forEach((typo) => {
      const regex = new RegExp(`\\b${typo.word}\\b`, 'gi');
      result = result.replace(regex, (match) => {
        if (match[0] === match[0].toUpperCase()) {
          return typo.suggestion.charAt(0).toUpperCase() + typo.suggestion.slice(1);
        }
        return typo.suggestion;
      });
    });
    setInput(result);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter text to check</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
        placeholder="Paste or type your text here to check for typos..."
      />

      {input ? (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">
              {typos.length} potential typo{typos.length !== 1 ? 's' : ''}
            </span>
            {typos.length > 0 && (
              <button type="button" onClick={fixAll} className="tb-v2-btn-sm tb-v2-btn-primary">
                Fix All
              </button>
            )}
          </div>
          <div className="tb-v2-tool-output-body">
            {typos.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {typos.map((typo, i) => (
                  <div
                    key={`${typo.word}-${i}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '8px 12px',
                      background: 'var(--tb-bg-secondary)',
                      borderRadius: 8,
                      fontFamily: 'var(--f-mono)',
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: 'var(--tb-accent)' }}>{typo.word}</span>
                    <span style={{ color: 'var(--tb-text-secondary)' }}>→ {typo.suggestion}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>No common typos detected</span>
            )}
          </div>
        </>
      ) : (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <span style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter text to check for common typos</span>
        </div>
      )}
    </div>
  );
}
