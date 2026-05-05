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
    
    const timeLine = lines[1];
    const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
    if (!timeMatch) continue;
    
    const start = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
    const end = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
    const text = lines.slice(2).join('\n').replace(/<[^>]+>/g, '');
    
    subtitles.push({ start, end, text });
  }
  
  return subtitles;
}

function parseVTT(content: string): Subtitle[] {
  const subtitles: Subtitle[] = [];
  const lines = content.split('\n');
  let i = 0;
  
  // Skip header
  while (i < lines.length && !lines[i].includes('-->')) i++;
  
  while (i < lines.length) {
    const line = lines[i];
    const timeMatch = line.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
    const simpleMatch = line.match(/(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2})\.(\d{3})/);
    
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
    } else if (simpleMatch) {
      const start = parseInt(simpleMatch[1]) * 60 + parseInt(simpleMatch[2]) + parseInt(simpleMatch[3]) / 1000;
      const end = parseInt(simpleMatch[4]) * 60 + parseInt(simpleMatch[5]) + parseInt(simpleMatch[6]) / 1000;
      const textLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('-->')) {
        textLines.push(lines[i].replace(/<[^>]+>/g, ''));
        i++;
      }
      subtitles.push({ start, end, text: textLines.join('\n') });
    } else {
      i++;
    }
  }
  
  return subtitles;
}

export default function AddSubtitlesClient() {
  const [videoUrl, setVideoUrl] = useState('');
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [style, setStyle] = useState<'default' | 'outline' | 'shadow'>('default');
  const [bgColor, setBgColor] = useState('rgba(0,0,0,0.7)');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(videoRef.current?.currentTime || 0);
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSubtitleFile(file);
    const content = await file.text();
    
    if (file.name.endsWith('.srt')) {
      setSubtitles(parseSRT(content));
    } else if (file.name.endsWith('.vtt')) {
      setSubtitles(parseVTT(content));
    }
  };

  const currentSubtitle = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime <= sub.end
  );

  const handleVideoSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setVideoUrl(URL.createObjectURL(file));
        }}
        className="hidden"
      />

      <div className="space-y-3">
        <div>
          <label className="tb-v2-tool-label">Video</label>
          <button type="button" onClick={handleVideoSelect} className="tb-v2-btn w-full">
            {videoUrl ? 'Change Video' : 'Select Video'}
          </button>
        </div>

        <div>
          <label className="tb-v2-tool-label">Subtitle File (SRT/VTT)</label>
          <input
            type="file"
            accept=".srt,.vtt"
            onChange={handleFileChange}
            className="tb-v2-input"
          />
        </div>

        {subtitles.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="tb-v2-tool-label">Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="tb-v2-input h-10"
                />
              </div>
              <div>
                <label className="tb-v2-tool-label">Background</label>
                <input
                  type="color"
                  value={bgColor.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+).*/, (_, r, g, b) => `#${Number(r).toString(16).padStart(2,'0')}${Number(g).toString(16).padStart(2,'0')}${Number(b).toString(16).padStart(2,'0')}`)}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="tb-v2-input h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="tb-v2-tool-label">Font Size: {fontSize}px</label>
                <input
                  type="range"
                  min={16}
                  max={48}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="tb-v2-input w-full"
                />
              </div>
              <div>
                <label className="tb-v2-tool-label">Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as 'default' | 'outline' | 'shadow')}
                  className="tb-v2-input"
                >
                  <option value="default">Solid</option>
                  <option value="outline">Outline</option>
                  <option value="shadow">Shadow</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {videoUrl && (
        <div className="relative rounded-xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full"
          />
          {currentSubtitle && (
            <div
              className="absolute bottom-4 left-0 right-0 text-center px-4"
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

      {subtitles.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {subtitles.length} subtitles loaded • {subtitleFile?.name}
        </p>
      )}
    </div>
  );
}
