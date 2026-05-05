'use client';

import React, { useState, useRef } from 'react';

interface CleanupOptions {
  removeBackground: boolean;
  enhanceColors: boolean;
  adjustBrightness: number;
  adjustContrast: number;
  removeNoise: boolean;
}

export default function CleanupPictureClient() {
  const [image, setImage] = useState<string | null>(null);
  const [options, setOptions] = useState<CleanupOptions>({
    removeBackground: false,
    enhanceColors: false,
    adjustBrightness: 100,
    adjustContrast: 100,
    removeNoise: false,
  });
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (!image) return;

    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      // Apply filters based on options
      let filterString = '';
      if (options.adjustBrightness !== 100) {
        filterString += `brightness(${options.adjustBrightness}%) `;
      }
      if (options.adjustContrast !== 100) {
        filterString += `contrast(${options.adjustContrast}%) `;
      }
      if (options.enhanceColors) {
        filterString += 'saturate(1.2) ';
      }

      ctx.filter = filterString || 'none';
      ctx.drawImage(img, 0, 0);

      // Simulate background removal and noise reduction
      if (options.removeBackground || options.removeNoise) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        if (options.removeNoise) {
          // Simple noise reduction simulation
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i] * 0.8 + avg * 0.2;
            data[i + 1] = data[i + 1] * 0.8 + avg * 0.2;
            data[i + 2] = data[i + 2] * 0.8 + avg * 0.2;
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      setProcessedImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
    img.src = image;
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = 'cleaned-image.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Picture Cleanup Tool</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Upload Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="p-4 border rounded space-y-4">
            <h3 className="font-medium">Cleanup Options</h3>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.removeBackground}
                onChange={(e) =>
                  setOptions({ ...options, removeBackground: e.target.checked })
                }
              />
              <span>Remove Background</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.enhanceColors}
                onChange={(e) =>
                  setOptions({ ...options, enhanceColors: e.target.checked })
                }
              />
              <span>Enhance Colors</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.removeNoise}
                onChange={(e) =>
                  setOptions({ ...options, removeNoise: e.target.checked })
                }
              />
              <span>Remove Noise</span>
            </label>

            <div>
              <label className="block text-sm mb-1">
                Brightness: {options.adjustBrightness}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={options.adjustBrightness}
                onChange={(e) =>
                  setOptions({ ...options, adjustBrightness: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Contrast: {options.adjustContrast}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={options.adjustContrast}
                onChange={(e) =>
                  setOptions({ ...options, adjustContrast: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={processImage}
            disabled={!image || isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isProcessing ? 'Processing...' : 'Clean Up Image'}
          </button>
        </div>

        <div className="space-y-4">
          {image && (
            <div>
              <h3 className="font-medium mb-2">Original Image</h3>
              <img
                src={image}
                alt="Original"
                className="max-w-full rounded border"
              />
            </div>
          )}

          {processedImage && (
            <div>
              <h3 className="font-medium mb-2">Processed Image</h3>
              <img
                src={processedImage}
                alt="Processed"
                className="max-w-full rounded border"
              />
              <button
                onClick={downloadImage}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download Image
              </button>
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
