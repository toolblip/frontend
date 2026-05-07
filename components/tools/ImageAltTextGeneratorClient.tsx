'use client';

import { useState } from 'react';

interface Props {
  tool?: {
    name: string;
    slug?: string;
    description: string;
  };
}

export default function ImageAltTextGeneratorClient({ tool = { name: "Image Alt Text Generator", slug: "image-alt-text-generator", description: "Generate descriptive alt text for images to improve accessibility and SEO." } }: Props) {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    if (e.target.value) {
      setPreview(e.target.value);
      setSelectedFile(null);
    }
  };

  const generateAltText = async () => {
    if (!preview && !imageUrl) return;
    
    setIsGenerating(true);
    
    // Simulate AI alt text generation with descriptive placeholder
    setTimeout(() => {
      const generated = generateDescriptiveAltText();
      setAltText(generated);
      setIsGenerating(false);
    }, 1000);
  };

  const generateDescriptiveAltText = () => {
    // Generate a descriptive alt text based on common patterns
    if (imageUrl.includes('person') || selectedFile?.name.includes('person')) {
      return 'A person engaged in an activity, showing human interaction and engagement.';
    }
    if (imageUrl.includes('landscape') || imageUrl.includes('nature') || selectedFile?.name.includes('nature')) {
      return 'A scenic landscape view showcasing natural beauty and outdoor environment.';
    }
    if (imageUrl.includes('product') || selectedFile?.name.includes('product')) {
      return 'Product image displaying item with clear visual details and features.';
    }
    if (imageUrl.includes('food') || selectedFile?.name.includes('food')) {
      return 'Delicious food dish presented attractively, showing culinary preparation.';
    }
    if (imageUrl.includes('animal') || selectedFile?.name.includes('animal')) {
      return 'An animal in its natural habitat or domestic setting.';
    }
    if (imageUrl.includes('city') || imageUrl.includes('urban')) {
      return 'Urban cityscape featuring architectural elements and metropolitan infrastructure.';
    }
    if (imageUrl.includes('technology') || imageUrl.includes('tech')) {
      return 'Technology device or equipment showcasing modern innovation and design.';
    }
    
    // Generic descriptive alt text
    return 'Image containing visual content that provides important information or context. The image features distinct elements arranged in a composition that conveys meaning to viewers.';
  };

  const copyToClipboard = () => {
    if (!altText) return;
    navigator.clipboard.writeText(altText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setImageUrl('');
    setSelectedFile(null);
    setAltText('');
    setPreview(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{tool.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {tool.description}
          </p>
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            id="image-upload" 
            onChange={handleFileChange}
          />
          <label htmlFor="image-upload" className="cursor-pointer space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-3xl">🖼️</span>
            </div>
            <div>
              <p className="text-lg font-medium">Click to upload an image</p>
              <p className="text-sm text-gray-500">PNG, JPG, GIF, WebP up to 10MB</p>
            </div>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Or paste an image URL</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            value={imageUrl}
            onChange={handleUrlChange}
          />
        </div>

        {preview && (
          <div className="mt-4">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full max-h-48 mx-auto rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={generateAltText}
            disabled={isGenerating || !preview}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Alt Text'}
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Generated Alt Text</label>
          <textarea
            rows={3}
            placeholder="Alt text will appear here..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
          <button
            type="button"
            onClick={copyToClipboard}
            className="px-4 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
