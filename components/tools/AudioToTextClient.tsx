'use client';

import { useState, useRef, useEffect } from 'react';

export default function AudioToTextClient() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [manualText, setManualText] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          const transcript_part = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript_part + ' ';
          } else {
            interimTranscript += transcript_part;
          }
        }
        setTranscript(prev => {
          const base = prev.replace(/\[.*$/, '').trim();
          return base + (base ? ' ' : '') + finalTranscript + (interimTranscript ? `[${interimTranscript}]` : '');
        });
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleManualSubmit = () => {
    setTranscript(manualText);
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
        <strong>Note:</strong> This tool uses the Web Speech API for live transcription. Results depend on browser support and audio quality.
      </div>

      {isSupported ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={toggleListening}
              className={`tb-v2-btn ${isListening ? 'bg-red-500 hover:bg-red-600' : 'tb-v2-btn-primary'}`}
            >
              {isListening ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">●</span> Stop Listening
                </span>
              ) : (
                <span className="flex items-center gap-2">🎤 Start Listening</span>
              )}
            </button>
          </div>

          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Transcript</span>
            {transcript && (
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(transcript); }}
                className="tb-v2-copy-btn"
              >
                Copy
              </button>
            )}
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre whitespace-pre-wrap">{transcript || 'Your speech will appear here...'}</pre>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="mb-4">🎤 Speech recognition is not supported in this browser.</p>
          <p className="text-sm">Please use Chrome, Edge, or Safari.</p>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-400">or paste transcript manually</span>
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label mb-2">Manual Input</div>
        <textarea
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Paste or type your transcript here..."
          className="tb-v2-tool-textarea"
          rows={4}
        />
        <button
          type="button"
          onClick={handleManualSubmit}
          disabled={!manualText.trim()}
          className="tb-v2-btn tb-v2-btn-secondary mt-2 w-full"
        >
          Use This Text
        </button>
      </div>
    </div>
  );
}
