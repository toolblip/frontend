'use client';

import { useState, useRef, useEffect } from 'react';

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

function parseSRT(content: string): Subtitle[] {
  const subtitles: Subtitle[] = [];
  const blocks = content.trim().split(/\n\n+/);
  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length < 3) continue;
    const timeMatch = lines[1].match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
    if (!timeMatch) continue;
    const start = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
    const end = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
    subtitles.push({ start, end, text: lines.slice(2).join('\n').replace(/<[^>]+>/g, '') });
  }
  return subtitles;
}

function parseVTT(content: string): Subtitle[] {
  const subtitles: Subtitle[] = [];
  const lines = content.split('\n');
  let i = 0;
  while (i < lines.length && !lines[i].includes('-->')) i++;
  while (i < lines.length) {
    const timeMatch = lines[i].match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
    if (timeMatch) {
      const start = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
      const end = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
      const textLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('-->')) {
        textLines.push(lines[i].replace(/<[^>]+>/g, ''));
        i++;
      }
      subtitles.push({ start, end, text: textLines.join('\n') });
    } else { i++; }
  }
  return subtitles;
}

export default function AddSubtitlesClient() {
  const [videoUrl, setVideoUrl] = useState('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [style, setStyle] = useState<'default' | 'outline' | 'shadow'>('default');
  const [bgColor, setBgColor] = useState('rgba(0,0,0,0.7)');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [subtitleFileName, setSubtitleFileName] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const subInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', () => setCurrentTime(videoRef.current?.currentTime || 0));
    }
  }, [videoUrl]);

  const handleSubtitleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubtitleFileName(file.name);
    const content = await file.text();
    setSubtitles(file.name.endsWith('.srt') ? parseSRT(content) : parseVTT(content));
  };

  const currentSubtitle = subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);

  return (
    <div>
      {/* Video upload */}
      <div>
        <label className="tb-v2-tool-label">Video</label>
        <div
          onClick={() => videoInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
        >
          <div className="text-3xl mb-2">🎬</div>
          <p className="text-gray-600 dark:text-gray-400">
            {videoUrl ? 'Click to change video' : 'Click to select video'}
          </p>
        </div>
        <input ref={videoInputRef} type="file" accept="video/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setVideoUrl(URL.createObjectURL(file));
        }} className="hidden" />
      </div>

      {/* Subtitle file */}
      <div>
        <label className="tb-v2-tool-label">Subtitle File (SRT/VTT)</label>
        <div
          onClick={() => subInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
        >
          <div className="text-3xl mb-2">📝</div>
          <p className="text-gray-600 dark:text-gray-400">
            {subtitleFileName || 'Click to select subtitle file'}
          </p>
        </div>
        <input ref={subInputRef} type="file" accept=".srt,.vtt" onChange={handleSubtitleFile} className="hidden" />
      </div>

      {/* Style settings */}
      {subtitles.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="tb-v2-tool-label">Text Color</label>
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="tb-v2-tool-label">Font Size: {fontSize}px</label>
            <input type="range" min={16} max={48} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="tb-v2-tool-label">Style</label>
            <div className="flex gap-2">
              {(['default', 'outline', 'shadow'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`flex-1 p-2 rounded-lg text-sm capitalize transition-colors ${
                    style === s
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="tb-v2-tool-label">Subtitles: {subtitles.length}</label>
            <div className="text-sm text-gray-500">{subtitleFileName}</div>
          </div>
        </div>
      )}

      {/* Video preview */}
      {videoUrl && (
        <div className="relative rounded-xl overflow-hidden bg-black">
          <video ref={videoRef} src={videoUrl} controls className="w-full" />
          {currentSubtitle && (
            <div
              className="absolute bottom-4 left-0 right-0 text-center px-4 py-2"
              style={{
                color: textColor,
                backgroundColor: bgColor,
                fontSize: `${fontSize}px`,
                textShadow: style === 'shadow' ? '2px 2px 4px rgba(0,0,0,0.8)' : style === 'outline' ? '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' : 'none',
              }}
            >
              {currentSubtitle.text.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {!videoUrl && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🎬</div>
          <p>Upload a video and subtitle file to preview</p>
        </div>
      )}
    </div>
  );
}
