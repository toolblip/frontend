'use client';
import { useState } from 'react';

export default function RgbHslColorPickerClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {
    setOutput('Processed: ' + input);
  };

  return (
    <div className="tb-v2-tool-card">
      <h1 className="text-2xl font-bold">Rgb Hsl Color Picker</h1>
      <p className="text-gray-600 dark:text-gray-400">Pick colors visually and switch between HEX, RGB, RGBA, HSL, and HSLA formats.</p>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-input"
        placeholder="Enter input..."
      />
      <button
        onClick={process}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
      >
        Process
      </button>
      {output && (
        <div className="tb-v2-tool-output-body">
          {output}
        </div>
      )}
    </div>
  );
}
