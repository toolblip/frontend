interface Props {
  tool?: {
    name: string;
    slug?: string;
    description: string;
  };
}

export default function ImageAltTextGeneratorClient({ tool = { name: "", slug: "", description: "" } }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{tool.name || "Image Alt Text Generator"}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {tool.description || "Generate descriptive alt text for images to improve accessibility and SEO."}
          </p>
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <input type="file" accept="image/*" className="hidden" id="image-upload" />
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
          />
        </div>

        <button
          type="button"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Generate Alt Text
        </button>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Generated Alt Text</label>
          <textarea
            rows={3}
            placeholder="Alt text will appear here..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            readOnly
          />
          <button
            type="button"
            className="px-4 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}
