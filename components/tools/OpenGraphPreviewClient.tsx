'use client';

import { useState } from 'react';

type Platform = 'twitter' | 'facebook' | 'linkedin' | 'slack';

export default function OpenGraphPreviewClient() {
  const [url, setUrl] = useState('https://example.com/article');
  const [title, setTitle] = useState('How to Master Web Development in 2024');
  const [description, setDescription] = useState('A comprehensive guide to learning modern web development, from HTML basics to advanced React patterns and deployment strategies.');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop');
  const [siteName, setSiteName] = useState('DevMastery');
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [copied, setCopied] = useState(false);

  const copyAsImage = () => {
    // For demo, we'll copy the image URL
    navigator.clipboard.writeText(image).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const renderTwitterPreview = () => (
    <div className="bg-[#15202B] rounded-xl p-4 max-w-[500px]">
      <div className="tb-v2-mode-tabs">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
          <div className="w-full h-full bg-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-white">{siteName}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500 text-sm">2h</span>
          </div>
          <div className="mt-0.5">
            <a href={url} className="text-white hover:underline">
              <span className="font-bold">{title}</span>
            </a>
          </div>
          <div className="mt-2">
            <div className="rounded-lg border border-gray-700 overflow-hidden">
              <div className="h-52 bg-gray-800 overflow-hidden">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                )}
              </div>
              <div className="p-3 bg-[#192734]">
                <div className="text-sm text-gray-400 uppercase tracking-wide truncate">{url}</div>
                <div className="font-bold text-white mt-1 line-clamp-2">{title}</div>
                <div className="text-sm text-gray-400 mt-1 line-clamp-2">{description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFacebookPreview = () => (
    <div className="bg-[#32383E] rounded-xl p-3 max-w-[500px]">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="h-52 bg-gray-200 overflow-hidden">
          {image ? (
            <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>
        <div className="p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide">{url}</div>
          <div className="font-bold text-xl text-[#1D2129] mt-1">{title}</div>
          <div className="text-sm text-[#606770] mt-1 line-clamp-2">{description}</div>
        </div>
      </div>
    </div>
  );

  const renderLinkedInPreview = () => (
    <div className="bg-white rounded-lg border border-gray-200 max-w-[500px] overflow-hidden">
      <div className="h-52 bg-gray-200 overflow-hidden">
        {image ? (
          <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-3">
        <div className="text-xs text-gray-400 uppercase tracking-wide">{siteName}</div>
        <div className="font-semibold text-base text-gray-900 mt-0.5 line-clamp-2">{title}</div>
        <div className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</div>
      </div>
    </div>
  );

  const renderSlackPreview = () => (
    <div className="bg-white rounded-lg border border-gray-200 max-w-[500px] overflow-hidden shadow-lg">
      <div className="flex">
        <div className="w-16 h-16 bg-gray-200 flex-shrink-0 overflow-hidden">
          {image ? (
            <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
          )}
        </div>
        <div className="p-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">{siteName}</span>
            <span className="text-gray-400 text-xs">{url}</span>
          </div>
          <div className="text-gray-900 text-sm font-semibold line-clamp-1">{title}</div>
          <div className="text-gray-500 text-xs line-clamp-2 mt-0.5">{description}</div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (platform) {
      case 'twitter':
        return renderTwitterPreview();
      case 'facebook':
        return renderFacebookPreview();
      case 'linkedin':
        return renderLinkedInPreview();
      case 'slack':
        return renderSlackPreview();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {(['twitter', 'facebook', 'linkedin', 'slack'] as Platform[]).map(p => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`px-3 py-1.5 text-sm rounded capitalize ${platform === p ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="tb-v2-grid-2">
        <div className="space-y-3">
          <div>
            <label className="tb-v2-tool-label">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="tb-v2-input"
            />
          </div>
          <div>
            <label className="tb-v2-tool-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="tb-v2-input"
            />
          </div>
          <div>
            <label className="tb-v2-tool-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="tb-v2-tool-textarea"
              rows={2}
            />
          </div>
          <div>
            <label className="tb-v2-tool-label">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="tb-v2-input"
            />
          </div>
          <div>
            <label className="tb-v2-tool-label">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="tb-v2-input"
            />
          </div>
        </div>

        <div className="flex items-start justify-center bg-gray-100 rounded-lg p-4">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}
