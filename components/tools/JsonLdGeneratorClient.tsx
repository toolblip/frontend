'use client';

import { useState } from 'react';

type SchemaType =
  | 'Article'
  | 'NewsArticle'
  | 'BlogPosting'
  | 'Product'
  | 'LocalBusiness'
  | 'Restaurant'
  | 'Event'
  | 'Person'
  | 'Organization'
  | 'WebSite'
  | 'WebPage'
  | 'BreadcrumbList'
  | 'FAQPage';

interface PersonData {
  name: string;
  url: string;
  jobTitle: string;
}

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
}

interface ProductData {
  name: string;
  description: string;
  image: string;
  brand: string;
  sku: string;
  price: string;
  priceCurrency: string;
}

interface ArticleData {
  headline: string;
  description: string;
  authorName: string;
  authorType: 'Person' | 'Organization';
  datePublished: string;
  dateModified: string;
  image: string;
  publisherName: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

const SCHEMA_TYPES: { value: SchemaType; label: string }[] = [
  { value: 'WebSite', label: 'Web Site' },
  { value: 'WebPage', label: 'Web Page' },
  { value: 'Article', label: 'Article' },
  { value: 'NewsArticle', label: 'News Article' },
  { value: 'BlogPosting', label: 'Blog Post' },
  { value: 'Product', label: 'Product' },
  { value: 'LocalBusiness', label: 'Local Business' },
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Event', label: 'Event' },
  { value: 'Person', label: 'Person' },
  { value: 'Organization', label: 'Organization' },
  { value: 'BreadcrumbList', label: 'Breadcrumb List' },
  { value: 'FAQPage', label: 'FAQ Page' },
];

function escapeJson(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function generateWebsiteSchema(siteName: string, siteUrl: string, searchUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrl,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

function generateArticleSchema(data: ArticleData) {
  return {
    '@context': 'https://schema.org',
    '@type': data.authorType === 'Person' ? 'Article' : 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image || undefined,
    author: {
      '@type': data.authorType,
      name: data.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisherName,
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
  };
}

function generateProductSchema(data: ProductData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image || undefined,
    brand: {
      '@type': 'Brand',
      name: data.brand,
    },
    sku: data.sku || undefined,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.priceCurrency,
      availability: 'https://schema.org/InStock',
    },
  };
}

function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function generateFaqSchema(questions: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((qa) => ({
      '@type': 'Question',
      name: qa.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.a,
      },
    })),
  };
}

export default function JsonLdGeneratorClient() {
  const [schemaType, setSchemaType] = useState<SchemaType>('WebSite');
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  // WebSite fields
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [searchUrl, setSearchUrl] = useState('');

  // Article fields
  const [articleData, setArticleData] = useState<ArticleData>({
    headline: '',
    description: '',
    authorName: '',
    authorType: 'Person',
    datePublished: '',
    dateModified: '',
    image: '',
    publisherName: '',
  });

  // Product fields
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    description: '',
    image: '',
    brand: '',
    sku: '',
    price: '',
    priceCurrency: 'USD',
  });

  // Breadcrumb fields
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { name: '', url: '' },
  ]);

  // FAQ fields
  const [faqQuestions, setFaqQuestions] = useState([{ q: '', a: '' }]);

  const generate = () => {
    let schema: Record<string, unknown>;

    switch (schemaType) {
      case 'WebSite':
        schema = generateWebsiteSchema(siteName, siteUrl, searchUrl);
        break;
      case 'Article':
      case 'NewsArticle':
      case 'BlogPosting':
        schema = generateArticleSchema(articleData);
        break;
      case 'Product':
        schema = generateProductSchema(productData);
        break;
      case 'BreadcrumbList':
        schema = generateBreadcrumbSchema(breadcrumbs);
        break;
      case 'FAQPage':
        schema = generateFaqSchema(faqQuestions.filter((q) => q.q && q.a));
        break;
      default:
        schema = { '@context': 'https://schema.org', '@type': schemaType };
    }

    const json = JSON.stringify(schema, null, 2);
    const output = `<script type="application/ld+json">\n${json}\n</script>`;
    setGenerated(output);
  };

  const copy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const addBreadcrumb = () => {
    setBreadcrumbs([...breadcrumbs, { name: '', url: '' }]);
  };

  const removeBreadcrumb = (index: number) => {
    setBreadcrumbs(breadcrumbs.filter((_, i) => i !== index));
  };

  const addFaqQuestion = () => {
    setFaqQuestions([...faqQuestions, { q: '', a: '' }]);
  };

  const removeFaqQuestion = (index: number) => {
    setFaqQuestions(faqQuestions.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Schema Type</span>
      </div>
      <div className="tb-v2-mode-tabs" role="tablist">
        {SCHEMA_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            role="tab"
            aria-selected={schemaType === type.value}
            onClick={() => {
              setSchemaType(type.value);
              setGenerated('');
            }}
            className={`tb-v2-mode-tab ${schemaType === type.value ? 'on' : ''}`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {schemaType === 'WebSite' && (
          <>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="My Awesome Site"
                className="tb-v2-tool-input"
              />
            </div>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                Site URL
              </label>
              <input
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="tb-v2-tool-input"
              />
            </div>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                Search Action URL Template
              </label>
              <input
                type="url"
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                placeholder="https://example.com/search?q={search_term_string}"
                className="tb-v2-tool-input"
              />
            </div>
          </>
        )}

        {(schemaType === 'Article' || schemaType === 'NewsArticle' || schemaType === 'BlogPosting') && (
          <>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                Headline
              </label>
              <input
                type="text"
                value={articleData.headline}
                onChange={(e) => setArticleData({ ...articleData, headline: e.target.value })}
                placeholder="Article headline"
                className="tb-v2-tool-input"
              />
            </div>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                Description
              </label>
              <textarea
                value={articleData.description}
                onChange={(e) => setArticleData({ ...articleData, description: e.target.value })}
                placeholder="Brief article description..."
                className="tb-v2-tool-textarea"
                style={{ fontFamily: 'var(--f-mono)', minHeight: '60px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                  Author Name
                </label>
                <input
                  type="text"
                  value={articleData.authorName}
                  onChange={(e) => setArticleData({ ...articleData, authorName: e.target.value })}
                  placeholder="John Doe"
                  className="tb-v2-tool-input"
                />
              </div>
              <div>
                <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                  Author Type
                </label>
                <select
                  value={articleData.authorType}
                  onChange={(e) => setArticleData({ ...articleData, authorType: e.target.value as 'Person' | 'Organization' })}
                  className="tb-v2-tool-input"
                >
                  <option value="Person">Person</option>
                  <option value="Organization">Organization</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                  Date Published
                </label>
                <input
                  type="date"
                  value={articleData.datePublished}
                  onChange={(e) => setArticleData({ ...articleData, datePublished: e.target.value })}
                  className="tb-v2-tool-input"
                />
              </div>
              <div>
                <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                  Date Modified
                </label>
                <input
                  type="date"
                  value={articleData.dateModified}
                  onChange={(e) => setArticleData({ ...articleData, dateModified: e.target.value })}
                  className="tb-v2-tool-input"
                />
              </div>
            </div>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                Image URL
              </label>
              <input
                type="url"
                value={articleData.image}
                onChange={(e) => setArticleData({ ...articleData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="tb-v2-tool-input"
              />
            </div>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                Publisher Name
              </label>
              <input
                type="text"
                value={articleData.publisherName}
                onChange={(e) => setArticleData({ ...articleData, publisherName: e.target.value })}
                placeholder="Publisher Inc."
                className="tb-v2-tool-input"
              />
            </div>
          </>
        )}

        {schemaType === 'Product' && (
          <>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                Product Name
              </label>
              <input
                type="text"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                placeholder="Awesome Product"
                className="tb-v2-tool-input"
              />
            </div>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                Description
              </label>
              <textarea
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                placeholder="Product description..."
                className="tb-v2-tool-textarea"
                style={{ fontFamily: 'var(--f-mono)', minHeight: '60px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                  Brand
                </label>
                <input
                  type="text"
                  value={productData.brand}
                  onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
                  placeholder="Brand Name"
                  className="tb-v2-tool-input"
                />
              </div>
              <div>
                <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                  SKU
                </label>
                <input
                  type="text"
                  value={productData.sku}
                  onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
                  placeholder="SKU-123"
                  className="tb-v2-tool-input"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                  Price
                </label>
                <input
                  type="text"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  placeholder="29.99"
                  className="tb-v2-tool-input"
                />
              </div>
              <div>
                <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                  Currency
                </label>
                <select
                  value={productData.priceCurrency}
                  onChange={(e) => setProductData({ ...productData, priceCurrency: e.target.value })}
                  className="tb-v2-tool-input"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>
            </div>
            <div>
              <label className="tb-v2-tool-label" style={{ marginBottom: '4px', display: 'block' }}>
                Image URL
              </label>
              <input
                type="url"
                value={productData.image}
                onChange={(e) => setProductData({ ...productData, image: e.target.value })}
                placeholder="https://example.com/product.jpg"
                className="tb-v2-tool-input"
              />
            </div>
          </>
        )}

        {schemaType === 'BreadcrumbList' && (
          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: '8px', display: 'block' }}>
              Breadcrumb Items
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {breadcrumbs.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newBreadcrumbs = [...breadcrumbs];
                      newBreadcrumbs[index].name = e.target.value;
                      setBreadcrumbs(newBreadcrumbs);
                    }}
                    placeholder="Name"
                    className="tb-v2-tool-input"
                  />
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => {
                      const newBreadcrumbs = [...breadcrumbs];
                      newBreadcrumbs[index].url = e.target.value;
                      setBreadcrumbs(newBreadcrumbs);
                    }}
                    placeholder="https://example.com/path"
                    className="tb-v2-tool-input"
                  />
                  <button
                    type="button"
                    onClick={() => removeBreadcrumb(index)}
                    className="tb-v2-copy-btn"
                    style={{ background: '#dc2626', color: 'white' }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addBreadcrumb}
                className="tb-v2-copy-btn"
                style={{ alignSelf: 'flex-start' }}
              >
                + Add Item
              </button>
            </div>
          </div>
        )}

        {schemaType === 'FAQPage' && (
          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: '8px', display: 'block' }}>
              FAQ Questions
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {faqQuestions.map((item, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px', border: '1px solid var(--tb-border)', borderRadius: '8px' }}>
                  <input
                    type="text"
                    value={item.q}
                    onChange={(e) => {
                      const newQuestions = [...faqQuestions];
                      newQuestions[index].q = e.target.value;
                      setFaqQuestions(newQuestions);
                    }}
                    placeholder="Question"
                    className="tb-v2-tool-input"
                  />
                  <textarea
                    value={item.a}
                    onChange={(e) => {
                      const newQuestions = [...faqQuestions];
                      newQuestions[index].a = e.target.value;
                      setFaqQuestions(newQuestions);
                    }}
                    placeholder="Answer"
                    className="tb-v2-tool-textarea"
                    style={{ fontFamily: 'var(--f-mono)', minHeight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFaqQuestion(index)}
                    className="tb-v2-copy-btn"
                    style={{ background: '#dc2626', color: 'white', alignSelf: 'flex-start' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFaqQuestion}
                className="tb-v2-copy-btn"
                style={{ alignSelf: 'flex-start' }}
              >
                + Add Question
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={generate}
        className="tb-v2-copy-btn"
        style={{ marginTop: '16px', background: '#2563eb', color: 'white' }}
      >
        Generate JSON-LD
      </button>

      {generated && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: '16px' }}>
            <span className="tb-v2-tool-label">Generated JSON-LD</span>
            <button
              type="button"
              onClick={copy}
              className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre">{generated}</pre>
          </div>
        </>
      )}

      <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', fontSize: '13px' }}>
        <strong style={{ display: 'block', marginBottom: '4px' }}>💡 JSON-LD Tips</strong>
        <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
          <li>Place the generated code in the <code>&lt;head&gt;</code> section of your HTML</li>
          <li>Validate your structured data with <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Google Rich Results Test</a></li>
          <li>Multiple schema types can be combined using @graph</li>
        </ul>
      </div>
    </div>
  );
}
