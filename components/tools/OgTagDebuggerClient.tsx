'use client';

import { useState } from 'react';

interface OgTag {
  property: string;
  content: string;
}

export default function OgTagDebuggerClient() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('Example Page Title');
  const [description, setDescription] = useState('This is an example description for the page that will appear in social previews.');
  const [image, setImage] = useState('https://example.com/og-image.jpg');
  const [siteName, setSiteName] = useState('Example Site');
  const [type, setType] = useState('website');
  const [locale, setLocale] = useState('en_US');
  const [customTags, setCustomTags] = useState<OgTag[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'tags'>('preview');

  const addCustomTag = () => {
    setCustomTags([...customTags, { property: '', content: '' }]);
  };

  const updateCustomTag = (index: number, field: 'property' | 'content', value: string) => {
    const updated = [...customTags];
    updated[index][field] = value;
    setCustomTags(updated);
  };

  const removeCustomTag = (index: number) => {
    setCustomTags(customTags.filter((_, i) => i !== index));
  };

  const generateOgTags = () => {
    let tags = `<!-- Open Graph / Social -->\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${description}" />\n<meta property="og:type" content="${type}" />\n<meta property="og:url" content="${url || 'https://example.com/page'}" />\n<meta property="og:image" content="${image}" />\n<meta property="og:site_name" content="${siteName}" />\n<meta property="og:locale" content="${locale}" />`;

    customTags.forEach(tag => {
      if (tag.property.trim()) {
        tags += `\n<meta property="${tag.property}" content="${tag.content}" />`;
      }
    });

    return tags;
  };

  const copyTags = () => {
    navigator.clipboard.writeText(generateOgTags()).catch(() => {});
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-3 py-1 text-sm rounded ${activeTab === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tags')}
          className={`px-3 py-1 text-sm rounded ${activeTab === 'tags' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          OG Tags
        </button>
      </div>

      {activeTab === 'preview' ? (
        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
          <div className="bg-gray-100 rounded-lg p-4 max-w-md mx-auto">
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }} />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <div className="p-3">
                <div className="text-xs text-gray-500 uppercase tracking-wide">{siteName}</div>
                <div className="font-semibold text-gray-900 mt-1 line-clamp-2">{title || 'Page Title'}</div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">{description || 'Page description will appear here...'}</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 text-center">Social Preview</div>
        </div>
      ) : null}

      {activeTab === 'tags' && (
        <>
          <div>
            <label className="tb-v2-tool-label">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page"
              className="tb-v2-input"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Page title"
              className="tb-v2-input"
            />
          </div>

          <div>
            <label className="tb-v2-tool-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Page description"
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
              placeholder="https://example.com/og-image.jpg"
              className="tb-v2-input"
            />
          </div>

          <div className="tb-v2-grid-2">
            <div>
              <label className="tb-v2-tool-label">Site Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="My Site"
                className="tb-v2-input"
              />
            </div>
            <div>
              <label className="tb-v2-tool-label">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="tb-v2-input"
              >
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="book">book</option>
                <option value="profile">profile</option>
                <option value="music.song">music.song</option>
                <option value="music.album">music.album</option>
                <option value="video.movie">video.movie</option>
                <option value="video.episode">video.episode</option>
              </select>
            </div>
          </div>

          <div>
            <label className="tb-v2-tool-label">Locale</label>
            <input
              type="text"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              placeholder="en_US"
              className="tb-v2-input"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="tb-v2-tool-label">Custom OG Tags</label>
              <button
                type="button"
                onClick={addCustomTag}
                className="tb-v2-btn-sm"
              >
                + Add Tag
              </button>
            </div>
            {customTags.map((tag, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tag.property}
                  onChange={(e) => updateCustomTag(index, 'property', e.target.value)}
                  placeholder="og:video"
                  className="tb-v2-input flex-1"
                />
                <input
                  type="text"
                  value={tag.content}
                  onChange={(e) => updateCustomTag(index, 'content', e.target.value)}
                  placeholder="https://..."
                  className="tb-v2-input flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeCustomTag(index)}
                  className="tb-v2-btn-sm text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Generated OG Tags</span>
            <button
              type="button"
              onClick={copyTags}
              className="tb-v2-copy-btn"
            >
              Copy
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre whitespace-pre-wrap">{generateOgTags()}</pre>
          </div>
        </>
      )}
    </div>
  );
}
