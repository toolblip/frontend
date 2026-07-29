'use client';

import { useState, useMemo } from 'react';

const pinyinMap: Record<string, string> = {
  '一': 'yi', '二': 'er', '三': 'san', '四': 'si', '五': 'wu', '六': 'liu', '七': 'qi', '八': 'ba', '九': 'jiu', '十': 'shi',
  '百': 'bai', '千': 'qian', '万': 'wan', '亿': 'yi',
  '零': 'ling', '两': 'liang',
  '大': 'da', '小': 'xiao', '中': 'zhong', '国': 'guo', '人': 'ren', '我': 'wo', '你': 'ni', '他': 'ta', '她': 'ta', '它': 'ta',
  '是': 'shi', '不': 'bu', '了': 'le', '在': 'zai', '有': 'you', '和': 'he', '与': 'yu', '的': 'de', '地': 'di', '得': 'de',
  '这': 'zhe', '那': 'na', '个': 'ge', '们': 'men', '来': 'lai', '去': 'qu', '会': 'hui', '能': 'neng', '为': 'wei',
  '年': 'nian', '月': 'yue', '日': 'ri', '时': 'shi', '分': 'fen', '秒': 'miao',
  '好': 'hao', '很': 'hen', '都': 'dou', '说': 'shuo', '看': 'kan', '想': 'xiang', '知': 'zhi', '道': 'dao',
  '爱': 'ai', '心': 'xin', '天': 'tian', '气': 'qi', '雨': 'yu', '雪': 'xue', '风': 'feng', '云': 'yun',
  '山': 'shan', '水': 'shui', '火': 'huo', '木': 'mu', '金': 'jin', '土': 'tu',
  '东': 'dong', '西': 'xi', '南': 'nan', '北': 'bei', '左': 'zuo', '右': 'you',
  '上': 'shang', '下': 'xia', '前': 'qian', '后': 'hou', '里': 'li', '外': 'wai',
  '开': 'kai', '关': 'guan', '进': 'jin', '出': 'chu',
  '学': 'xue', '习': 'xi', '工': 'gong', '作': 'zuo', '生': 'sheng', '活': 'huo',
  '书': 'shu', '本': 'ben', '字': 'zi', '文': 'wen', '言': 'yan', '语': 'yu',
  '妈': 'ma', '爸': 'ba', '哥': 'ge', '姐': 'jie', '弟': 'di', '妹': 'mei',
  '朋': 'peng', '友': 'you', '老': 'lao', '师': 'shi', '同': 'tong',
  '谢': 'xie', '请': 'qing', '对': 'dui', '起': 'qi', '没关系': 'meiguanxi', '谢谢': 'xiexie',
};

const radicalStrokes: Record<string, { strokes: number; meaning: string }> = {
  '人': { strokes: 2, meaning: 'person' },
  '口': { strokes: 3, meaning: 'mouth' },
  '心': { strokes: 4, meaning: 'heart' },
  '手': { strokes: 4, meaning: 'hand' },
  '日': { strokes: 4, meaning: 'sun/day' },
  '月': { strokes: 4, meaning: 'moon' },
  '木': { strokes: 4, meaning: 'wood' },
  '水': { strokes: 4, meaning: 'water' },
  '火': { strokes: 4, meaning: 'fire' },
  '女': { strokes: 3, meaning: 'woman' },
  '子': { strokes: 3, meaning: 'child' },
  '山': { strokes: 3, meaning: 'mountain' },
  '川': { strokes: 3, meaning: 'river' },
  '土': { strokes: 3, meaning: 'earth' },
  '大': { strokes: 3, meaning: 'big' },
  '小': { strokes: 3, meaning: 'small' },
  '中': { strokes: 4, meaning: 'middle' },
  '王': { strokes: 4, meaning: 'king' },
  '石': { strokes: 5, meaning: 'stone' },
  '田': { strokes: 5, meaning: 'field' },
};

export default function ChineseCharConverterClient() {
  const [input, setInput] = useState('');

  const charAnalysis = useMemo(() => {
    if (!input.trim()) return [];

    const chars = [...input];
    return chars.map(char => {
      const pinyin = pinyinMap[char] || null;
      const isChinese = /[\u4e00-\u9fff]/.test(char);
      
      let unicode = '';
      if (isChinese) {
        unicode = `U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
      }

      let radicalInfo = null;
      for (const [radical, info] of Object.entries(radicalStrokes)) {
        if (char.includes(radical)) {
          radicalInfo = { radical, ...info };
          break;
        }
      }

      return {
        char,
        pinyin,
        isChinese,
        unicode,
        radicalInfo,
      };
    });
  }, [input]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="" style={{padding:"20px"}}>
      <h1 className="text-2xl font-bold mb-6">Chinese Character Converter</h1>

      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>Enter Chinese text or characters</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tb-v2-input"
          placeholder="Enter Chinese characters..."
        />
      </div>

      {charAnalysis.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Character Analysis</label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-2 px-3">Char</th>
                  <th className="text-left py-2 px-3">Pinyin</th>
                  <th className="text-left py-2 px-3">Unicode</th>
                  <th className="text-left py-2 px-3">Radical Info</th>
                </tr>
              </thead>
              <tbody>
                {charAnalysis.map((info, i) => (
                  <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-3 text-2xl font-mono">{info.char}</td>
                    <td className="py-3 px-3">
                      {info.pinyin ? (
                        <span className="text-blue-500 font-mono">{info.pinyin}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-sm text-gray-500">
                      {info.unicode || '-'}
                    </td>
                    <td className="py-3 px-3 text-sm">
                      {info.radicalInfo ? (
                        <span className="text-green-600">
                          {info.radicalInfo.radical} ({info.radicalInfo.strokes} strokes) - {info.radicalInfo.meaning}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {input && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleCopy(input)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Copy Original
          </button>
          <button
            onClick={() => handleCopy(charAnalysis.map(c => c.pinyin || c.char).join(' '))}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Copy Pinyin
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
          <h3 className="font-medium mb-3">Common Radicals</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(radicalStrokes).slice(0, 10).map(([char, info]) => (
              <div key={char} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded">
                <span className="text-xl">{char}</span>
                <span className="text-gray-500">{info.strokes} - {info.meaning}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
          <h3 className="font-medium mb-3">Numbers in Chinese</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {['一 二 三 四 五 六 七 八 九 十'.split(' '), ['yi', 'er', 'san', 'si', 'wu', 'liu', 'qi', 'ba', 'jiu', 'shi']].map((row, idx) => (
              <div key={idx} className="contents">
                {row.map((item, i) => (
                  <div key={i} className="p-2 bg-white dark:bg-gray-700 rounded text-center">
                    <span className="text-lg">{['一二三四五六七八九十'][i]}</span>
                    <span className="text-gray-500 ml-1">{['yi er san si wu liu qi ba jiu shi'][i]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
        <h3 className="font-medium mb-2">How it works:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Enter Chinese characters to see their pinyin pronunciation</li>
          <li>• Unicode code points are shown for each character</li>
          <li>• Radical information helps understand character composition</li>
          <li>• Note: This tool covers common characters but not all Chinese characters</li>
        </ul>
      </div>
    </div>
  );
}
