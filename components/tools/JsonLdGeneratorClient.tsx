'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

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

type BasicSchemaType =
  | 'WebPage'
  | 'LocalBusiness'
  | 'Restaurant'
  | 'Event'
  | 'Person'
  | 'Organization';

interface BasicSchemaData {
  name: string;
  description: string;
  url: string;
  image: string;
  jobTitle: string;
  logo: string;
  telephone: string;
  address: string;
  startDate: string;
  endDate: string;
  locationName: string;
  locationAddress: string;
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

const BASIC_SCHEMA_TYPES: BasicSchemaType[] = [
  'WebPage',
  'LocalBusiness',
  'Restaurant',
  'Event',
  'Person',
  'Organization',
];

const INITIAL_BASIC_DATA: BasicSchemaData = {
  name: '',
  description: '',
  url: '',
  image: '',
  jobTitle: '',
  logo: '',
  telephone: '',
  address: '',
  startDate: '',
  endDate: '',
  locationName: '',
  locationAddress: '',
};

const INITIAL_ARTICLE_DATA: ArticleData = {
  headline: '',
  description: '',
  authorName: '',
  authorType: 'Person',
  datePublished: '',
  dateModified: '',
  image: '',
  publisherName: '',
};

const INITIAL_PRODUCT_DATA: ProductData = {
  name: '',
  description: '',
  image: '',
  brand: '',
  sku: '',
  price: '',
  priceCurrency: 'USD',
};

const EXAMPLE_BASIC_DATA: BasicSchemaData = {
  name: 'Example Business',
  description: 'A local business serving customers in the community.',
  url: 'https://example.com',
  image: 'https://example.com/images/business.jpg',
  jobTitle: 'Product Designer',
  logo: 'https://example.com/images/logo.png',
  telephone: '+1-555-0100',
  address: '123 Main Street, Austin, TX 78701',
  startDate: '2026-06-20T18:00',
  endDate: '2026-06-20T21:00',
  locationName: 'Example Hall',
  locationAddress: '123 Main Street, Austin, TX 78701',
};

const EXAMPLE_ARTICLE_DATA: ArticleData = {
  headline: 'How to Build a Faster Website',
  description: 'Practical steps for improving page speed and user experience.',
  authorName: 'Alex Morgan',
  authorType: 'Person',
  datePublished: '2026-01-15',
  dateModified: '2026-02-01',
  image: 'https://example.com/images/article.jpg',
  publisherName: 'Example Media',
};

const EXAMPLE_PRODUCT_DATA: ProductData = {
  name: 'Example Product',
  description: 'A useful product for everyday work.',
  image: 'https://example.com/images/product.jpg',
  brand: 'Example Brand',
  sku: 'EX-100',
  price: '29.99',
  priceCurrency: 'USD',
};

const EXAMPLE_BREADCRUMBS: BreadcrumbItem[] = [
  { name: 'Home', url: 'https://example.com/' },
  { name: 'Guides', url: 'https://example.com/guides' },
  { name: 'Website Speed', url: 'https://example.com/guides/speed' },
];

const EXAMPLE_FAQ_QUESTIONS = [
  { q: 'What is structured data?', a: 'Structured data describes page content in a format search engines can understand.' },
  { q: 'Where should I add JSON-LD?', a: 'Add the generated script to the page head or body.' },
];

function isHttpUrl(value: string): boolean {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return Boolean(url.hostname) && (url.protocol === 'http:' || url.protocol === 'https:');
  } catch {
    return false;
  }
}

function generateWebsiteSchema(siteName: string, siteUrl: string, searchUrl: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName.trim(),
    url: siteUrl.trim(),
  };

  if (searchUrl.trim()) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrl.trim(),
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

function generateArticleSchema(data: ArticleData, type: 'Article' | 'NewsArticle' | 'BlogPosting') {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: data.headline.trim(),
    author: {
      '@type': data.authorType,
      name: data.authorName.trim(),
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisherName.trim(),
    },
    datePublished: data.datePublished.trim(),
  };

  if (data.description.trim()) schema.description = data.description.trim();
  if (data.image.trim()) schema.image = data.image.trim();
  if (data.dateModified.trim()) schema.dateModified = data.dateModified.trim();

  return schema;
}

function generateBasicSchema(type: BasicSchemaType, data: BasicSchemaData) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  const addValue = (key: string, value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue) schema[key] = trimmedValue;
  };

  addValue('name', data.name);
  addValue('description', data.description);
  addValue('url', data.url);
  addValue('image', data.image);

  if (type === 'Person') {
    addValue('jobTitle', data.jobTitle);
  }

  if (type === 'Organization') {
    addValue('logo', data.logo);
  }

  if (type === 'LocalBusiness' || type === 'Restaurant') {
    addValue('telephone', data.telephone);
    if (data.address.trim()) {
      schema.address = {
        '@type': 'PostalAddress',
        streetAddress: data.address.trim(),
      };
    }
  }

  if (type === 'Event') {
    addValue('startDate', data.startDate);
    addValue('endDate', data.endDate);
    if (data.locationName.trim() || data.locationAddress.trim()) {
      const location: Record<string, unknown> = { '@type': 'Place' };
      addValueTo(location, 'name', data.locationName);
      if (data.locationAddress.trim()) {
        location.address = {
          '@type': 'PostalAddress',
          streetAddress: data.locationAddress.trim(),
        };
      }
      schema.location = location;
    }
  }

  return schema;
}

function addValueTo(target: Record<string, unknown>, key: string, value: string) {
  const trimmedValue = value.trim();
  if (trimmedValue) target[key] = trimmedValue;
}

function generateProductSchema(data: ProductData) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name.trim(),
    offers: {
      '@type': 'Offer',
      price: data.price.trim(),
      priceCurrency: data.priceCurrency.trim(),
      availability: 'https://schema.org/InStock',
    },
  };

  if (data.description.trim()) schema.description = data.description.trim();
  if (data.image.trim()) schema.image = data.image.trim();
  if (data.brand.trim()) {
    schema.brand = {
      '@type': 'Brand',
      name: data.brand.trim(),
    };
  }
  if (data.sku.trim()) schema.sku = data.sku.trim();

  return schema;
}

function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name.trim(),
      item: item.url.trim(),
    })),
  };
}

function generateFaqSchema(questions: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((qa) => ({
      '@type': 'Question',
      name: qa.q.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.a.trim(),
      },
    })),
  };
}

export default function JsonLdGeneratorClient() {
  const [schemaType, setSchemaType] = useState<SchemaType>('WebSite');
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // WebSite fields
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [searchUrl, setSearchUrl] = useState('');

  // Article fields
  const [articleData, setArticleData] = useState<ArticleData>(INITIAL_ARTICLE_DATA);

  // Product fields
  const [productData, setProductData] = useState<ProductData>(INITIAL_PRODUCT_DATA);

  // WebPage, business, event, person, and organization fields
  const [basicData, setBasicData] = useState<BasicSchemaData>(INITIAL_BASIC_DATA);

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
        if (!siteName.trim()) {
          setError('Enter a site name before generating JSON-LD.');
          setGenerated('');
          return;
        }
        if (!isHttpUrl(siteUrl.trim())) {
          setError('Site URL must be an absolute http(s) URL.');
          setGenerated('');
          return;
        }
        if (searchUrl.trim() && !isHttpUrl(searchUrl.trim())) {
          setError('Search action URL must be an absolute http(s) URL.');
          setGenerated('');
          return;
        }
        schema = generateWebsiteSchema(siteName, siteUrl, searchUrl);
        break;
      case 'Article':
      case 'NewsArticle':
      case 'BlogPosting':
        if (!articleData.headline.trim() || !articleData.authorName.trim() || !articleData.publisherName.trim() || !articleData.datePublished.trim()) {
          setError('Enter a headline, author, publisher, and publication date before generating JSON-LD.');
          setGenerated('');
          return;
        }
        if (articleData.image.trim() && !isHttpUrl(articleData.image.trim())) {
          setError('Article image URL must be an absolute http(s) URL.');
          setGenerated('');
          return;
        }
        schema = generateArticleSchema(articleData, schemaType);
        break;
      case 'Product':
        if (!productData.name.trim() || !productData.price.trim() || !productData.priceCurrency.trim()) {
          setError('Enter a product name, price, and currency before generating JSON-LD.');
          setGenerated('');
          return;
        }
        if (!Number.isFinite(Number(productData.price)) || Number(productData.price) < 0) {
          setError('Product price must be a non-negative number.');
          setGenerated('');
          return;
        }
        if (productData.image.trim() && !isHttpUrl(productData.image.trim())) {
          setError('Product image URL must be an absolute http(s) URL.');
          setGenerated('');
          return;
        }
        schema = generateProductSchema(productData);
        break;
      case 'BreadcrumbList': {
        const validBreadcrumbs = breadcrumbs.filter((item) => item.name.trim() && item.url.trim());
        if (validBreadcrumbs.length === 0) {
          setError('Add at least one breadcrumb name and URL before generating JSON-LD.');
          setGenerated('');
          return;
        }
        if (validBreadcrumbs.some((item) => !isHttpUrl(item.url.trim()))) {
          setError('Breadcrumb URLs must be absolute http(s) URLs.');
          setGenerated('');
          return;
        }
        schema = generateBreadcrumbSchema(validBreadcrumbs);
        break;
      }
      case 'FAQPage': {
        const validQuestions = faqQuestions.filter((q) => q.q.trim() && q.a.trim());
        if (validQuestions.length === 0) {
          setError('Add at least one complete question and answer before generating JSON-LD.');
          setGenerated('');
          return;
        }
        schema = generateFaqSchema(validQuestions);
        break;
      }
      default:
        if (!basicData.name.trim()) {
          setError('Enter a name before generating JSON-LD.');
          setGenerated('');
          return;
        }
        if (basicData.url.trim() && !isHttpUrl(basicData.url.trim())) {
          setError('URL must be an absolute http(s) URL.');
          setGenerated('');
          return;
        }
        if (basicData.image.trim() && !isHttpUrl(basicData.image.trim())) {
          setError('Image URL must be an absolute http(s) URL.');
          setGenerated('');
          return;
        }
        if (basicData.logo.trim() && !isHttpUrl(basicData.logo.trim())) {
          setError('Logo URL must be an absolute http(s) URL.');
          setGenerated('');
          return;
        }
        if (schemaType === 'WebPage' && !isHttpUrl(basicData.url.trim())) {
          setError('Web Page URL must be an absolute http(s) URL.');
          setGenerated('');
          return;
        }
        if (schemaType === 'Event' && !basicData.startDate.trim()) {
          setError('Enter an event start date before generating JSON-LD.');
          setGenerated('');
          return;
        }
        schema = generateBasicSchema(schemaType, basicData);
    }

    const json = JSON.stringify(schema, null, 2);
    const safeJson = json.replace(/</g, '\\u003c');
    const output = `<script type="application/ld+json">\n${safeJson}\n</script>`;
    setError('');
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

  const updateBasicData = (field: keyof BasicSchemaData, value: string) => {
    setBasicData((current) => ({ ...current, [field]: value }));
  };

  const loadExample = () => {
    setGenerated('');
    setError('');
    if (schemaType === 'WebSite') {
      setSiteName('Example Site');
      setSiteUrl('https://example.com');
      setSearchUrl('https://example.com/search?q={search_term_string}');
    } else if (schemaType === 'Article' || schemaType === 'NewsArticle' || schemaType === 'BlogPosting') {
      setArticleData(EXAMPLE_ARTICLE_DATA);
    } else if (schemaType === 'Product') {
      setProductData(EXAMPLE_PRODUCT_DATA);
    } else if (schemaType === 'BreadcrumbList') {
      setBreadcrumbs(EXAMPLE_BREADCRUMBS.map((item) => ({ ...item })));
    } else if (schemaType === 'FAQPage') {
      setFaqQuestions(EXAMPLE_FAQ_QUESTIONS.map((item) => ({ ...item })));
    } else {
      setBasicData(EXAMPLE_BASIC_DATA);
    }
  };

  const clear = () => {
    setSiteName('');
    setSiteUrl('');
    setSearchUrl('');
    setArticleData(INITIAL_ARTICLE_DATA);
    setProductData(INITIAL_PRODUCT_DATA);
    setBasicData(INITIAL_BASIC_DATA);
    setBreadcrumbs([{ name: '', url: '' }]);
    setFaqQuestions([{ q: '', a: '' }]);
    setGenerated('');
    setCopied(false);
    setError('');
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Schema Type</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clear} canClear exampleCount={1} />
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
              setError('');
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
               <label className="tb-v2-tool-label" htmlFor="site-name" style={{ marginBottom: '4px', display: 'block' }}>
                 Site Name
               </label>
               <input
                 id="site-name"
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="My Awesome Site"
                className="tb-v2-tool-input"
              />
            </div>
            <div>
               <label className="tb-v2-tool-label" htmlFor="site-url" style={{ marginBottom: '4px', display: 'block' }}>
                 Site URL
               </label>
               <input
                 id="site-url"
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="tb-v2-tool-input"
              />
            </div>
            <div>
               <label className="tb-v2-tool-label" htmlFor="search-url" style={{ marginBottom: '4px', display: 'block' }}>
                 Search Action URL Template
               </label>
               <input
                 id="search-url"
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
               <label className="tb-v2-tool-label" htmlFor="article-headline" style={{ marginBottom: '4px', display: 'block' }}>
                 Headline
               </label>
               <input
                 id="article-headline"
                type="text"
                value={articleData.headline}
                onChange={(e) => setArticleData({ ...articleData, headline: e.target.value })}
                placeholder="Article headline"
                className="tb-v2-tool-input"
              />
            </div>
            <div>
               <label className="tb-v2-tool-label" htmlFor="article-description" style={{ marginBottom: '4px', display: 'block' }}>
                 Description
               </label>
               <textarea
                 id="article-description"
                value={articleData.description}
                onChange={(e) => setArticleData({ ...articleData, description: e.target.value })}
                placeholder="Brief article description..."
                className="tb-v2-tool-textarea"
                style={{ fontFamily: 'var(--f-mono)', minHeight: '60px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '12px' }}>
              <div>
                 <label className="tb-v2-tool-label" htmlFor="article-author-name" style={{ marginBottom: '4px', display: 'block' }}>
                   Author Name
                 </label>
                 <input
                   id="article-author-name"
                  type="text"
                  value={articleData.authorName}
                  onChange={(e) => setArticleData({ ...articleData, authorName: e.target.value })}
                  placeholder="John Doe"
                  className="tb-v2-tool-input"
                />
              </div>
              <div>
                 <label className="tb-v2-tool-label" htmlFor="article-author-type" style={{ marginBottom: '4px', display: 'block' }}>
                   Author Type
                 </label>
                 <select
                   id="article-author-type"
                  value={articleData.authorType}
                  onChange={(e) => setArticleData({ ...articleData, authorType: e.target.value as 'Person' | 'Organization' })}
                  className="tb-v2-tool-input"
                >
                  <option value="Person">Person</option>
                  <option value="Organization">Organization</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '12px' }}>
              <div>
                 <label className="tb-v2-tool-label" htmlFor="article-date-published" style={{ marginBottom: '4px', display: 'block' }}>
                   Date Published
                 </label>
                 <input
                   id="article-date-published"
                  type="date"
                  value={articleData.datePublished}
                  onChange={(e) => setArticleData({ ...articleData, datePublished: e.target.value })}
                  className="tb-v2-tool-input"
                />
              </div>
              <div>
                 <label className="tb-v2-tool-label" htmlFor="article-date-modified" style={{ marginBottom: '4px', display: 'block' }}>
                   Date Modified
                 </label>
                 <input
                   id="article-date-modified"
                  type="date"
                  value={articleData.dateModified}
                  onChange={(e) => setArticleData({ ...articleData, dateModified: e.target.value })}
                  className="tb-v2-tool-input"
                />
              </div>
            </div>
            <div>
               <label className="tb-v2-tool-label" htmlFor="article-image" style={{ marginBottom: '4px', display: 'block' }}>
                 Image URL
               </label>
               <input
                 id="article-image"
                type="url"
                value={articleData.image}
                onChange={(e) => setArticleData({ ...articleData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="tb-v2-tool-input"
              />
            </div>
            <div>
               <label className="tb-v2-tool-label" htmlFor="article-publisher-name" style={{ marginBottom: '4px', display: 'block' }}>
                 Publisher Name
               </label>
               <input
                 id="article-publisher-name"
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
               <label className="tb-v2-tool-label" htmlFor="product-name" style={{ marginBottom: '4px', display: 'block' }}>
                 Product Name
               </label>
               <input
                 id="product-name"
                type="text"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                placeholder="Awesome Product"
                className="tb-v2-tool-input"
              />
            </div>
            <div>
               <label className="tb-v2-tool-label" htmlFor="product-description" style={{ marginBottom: '4px', display: 'block' }}>
                 Description
               </label>
               <textarea
                 id="product-description"
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                placeholder="Product description..."
                className="tb-v2-tool-textarea"
                style={{ fontFamily: 'var(--f-mono)', minHeight: '60px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '12px' }}>
              <div>
                 <label className="tb-v2-tool-label" htmlFor="product-brand" style={{ marginBottom: '4px', display: 'block' }}>
                   Brand
                 </label>
                 <input
                   id="product-brand"
                  type="text"
                  value={productData.brand}
                  onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
                  placeholder="Brand Name"
                  className="tb-v2-tool-input"
                />
              </div>
              <div>
                 <label className="tb-v2-tool-label" htmlFor="product-sku" style={{ marginBottom: '4px', display: 'block' }}>
                   SKU
                 </label>
                 <input
                   id="product-sku"
                  type="text"
                  value={productData.sku}
                  onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
                  placeholder="SKU-123"
                  className="tb-v2-tool-input"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '12px' }}>
              <div>
                 <label className="tb-v2-tool-label" htmlFor="product-price" style={{ marginBottom: '4px', display: 'block' }}>
                   Price
                 </label>
                 <input
                   id="product-price"
                  type="text"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  placeholder="29.99"
                  className="tb-v2-tool-input"
                />
              </div>
              <div>
                 <label className="tb-v2-tool-label" htmlFor="product-currency" style={{ marginBottom: '4px', display: 'block' }}>
                   Currency
                 </label>
                 <select
                   id="product-currency"
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
               <label className="tb-v2-tool-label" htmlFor="product-image" style={{ marginBottom: '4px', display: 'block' }}>
                 Image URL
               </label>
               <input
                 id="product-image"
                type="url"
                value={productData.image}
                onChange={(e) => setProductData({ ...productData, image: e.target.value })}
                placeholder="https://example.com/product.jpg"
                className="tb-v2-tool-input"
              />
            </div>
          </>
        )}

        {BASIC_SCHEMA_TYPES.includes(schemaType as BasicSchemaType) && (
          <>
            <div>
              <label className="tb-v2-tool-label" htmlFor="basic-name" style={{ marginBottom: '4px', display: 'block' }}>
                Name
              </label>
              <input
                id="basic-name"
                type="text"
                value={basicData.name}
                onChange={(e) => updateBasicData('name', e.target.value)}
                placeholder="Example Business"
                className="tb-v2-tool-input"
              />
            </div>
            {schemaType !== 'Person' && (
              <div>
                <label className="tb-v2-tool-label" htmlFor="basic-description" style={{ marginBottom: '4px', display: 'block' }}>
                  Description
                </label>
                <textarea
                  id="basic-description"
                  value={basicData.description}
                  onChange={(e) => updateBasicData('description', e.target.value)}
                  placeholder="Brief description..."
                  className="tb-v2-tool-textarea"
                  style={{ minHeight: '60px' }}
                />
              </div>
            )}
            <div>
              <label className="tb-v2-tool-label" htmlFor="basic-url" style={{ marginBottom: '4px', display: 'block' }}>
                URL
              </label>
              <input
                id="basic-url"
                type="url"
                value={basicData.url}
                onChange={(e) => updateBasicData('url', e.target.value)}
                placeholder="https://example.com"
                className="tb-v2-tool-input"
              />
            </div>
            {schemaType === 'Person' && (
              <div>
                <label className="tb-v2-tool-label" htmlFor="basic-job-title" style={{ marginBottom: '4px', display: 'block' }}>
                  Job Title
                </label>
                <input
                  id="basic-job-title"
                  type="text"
                  value={basicData.jobTitle}
                  onChange={(e) => updateBasicData('jobTitle', e.target.value)}
                  placeholder="Product Designer"
                  className="tb-v2-tool-input"
                />
              </div>
            )}
            {schemaType === 'Organization' ? (
              <div>
                <label className="tb-v2-tool-label" htmlFor="basic-logo" style={{ marginBottom: '4px', display: 'block' }}>
                  Logo URL
                </label>
                <input
                  id="basic-logo"
                  type="url"
                  value={basicData.logo}
                  onChange={(e) => updateBasicData('logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="tb-v2-tool-input"
                />
              </div>
            ) : (
              <div>
                <label className="tb-v2-tool-label" htmlFor="basic-image" style={{ marginBottom: '4px', display: 'block' }}>
                  Image URL
                </label>
                <input
                  id="basic-image"
                  type="url"
                  value={basicData.image}
                  onChange={(e) => updateBasicData('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="tb-v2-tool-input"
                />
              </div>
            )}
            {(schemaType === 'LocalBusiness' || schemaType === 'Restaurant') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '12px' }}>
                <div>
                  <label className="tb-v2-tool-label" htmlFor="basic-telephone" style={{ marginBottom: '4px', display: 'block' }}>
                    Telephone
                  </label>
                  <input
                    id="basic-telephone"
                    type="tel"
                    value={basicData.telephone}
                    onChange={(e) => updateBasicData('telephone', e.target.value)}
                    placeholder="+1-555-0100"
                    className="tb-v2-tool-input"
                  />
                </div>
                <div>
                  <label className="tb-v2-tool-label" htmlFor="basic-address" style={{ marginBottom: '4px', display: 'block' }}>
                    Address
                  </label>
                  <input
                    id="basic-address"
                    type="text"
                    value={basicData.address}
                    onChange={(e) => updateBasicData('address', e.target.value)}
                    placeholder="123 Main Street, Austin, TX"
                    className="tb-v2-tool-input"
                  />
                </div>
              </div>
            )}
            {schemaType === 'Event' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '12px' }}>
                  <div>
                    <label className="tb-v2-tool-label" htmlFor="event-start-date" style={{ marginBottom: '4px', display: 'block' }}>
                      Start Date
                    </label>
                    <input
                      id="event-start-date"
                      type="datetime-local"
                      value={basicData.startDate}
                      onChange={(e) => updateBasicData('startDate', e.target.value)}
                      className="tb-v2-tool-input"
                    />
                  </div>
                  <div>
                    <label className="tb-v2-tool-label" htmlFor="event-end-date" style={{ marginBottom: '4px', display: 'block' }}>
                      End Date
                    </label>
                    <input
                      id="event-end-date"
                      type="datetime-local"
                      value={basicData.endDate}
                      onChange={(e) => updateBasicData('endDate', e.target.value)}
                      className="tb-v2-tool-input"
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '12px' }}>
                  <div>
                    <label className="tb-v2-tool-label" htmlFor="event-location-name" style={{ marginBottom: '4px', display: 'block' }}>
                      Location Name
                    </label>
                    <input
                      id="event-location-name"
                      type="text"
                      value={basicData.locationName}
                      onChange={(e) => updateBasicData('locationName', e.target.value)}
                      placeholder="Example Hall"
                      className="tb-v2-tool-input"
                    />
                  </div>
                  <div>
                    <label className="tb-v2-tool-label" htmlFor="event-location-address" style={{ marginBottom: '4px', display: 'block' }}>
                      Location Address
                    </label>
                    <input
                      id="event-location-address"
                      type="text"
                      value={basicData.locationAddress}
                      onChange={(e) => updateBasicData('locationAddress', e.target.value)}
                      placeholder="123 Main Street, Austin, TX"
                      className="tb-v2-tool-input"
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {schemaType === 'BreadcrumbList' && (
          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: '8px', display: 'block' }}>
              Breadcrumb Items
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {breadcrumbs.map((item, index) => (
                <div key={index} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <input
                    type="text"
                    aria-label={`Breadcrumb ${index + 1} name`}
                    value={item.name}
                    onChange={(e) => setBreadcrumbs((current) => current.map((breadcrumb, breadcrumbIndex) => (
                      breadcrumbIndex === index ? { ...breadcrumb, name: e.target.value } : breadcrumb
                    )))}
                    placeholder="Name"
                    className="tb-v2-tool-input"
                    style={{ flex: '1 1 180px', minWidth: 0 }}
                  />
                  <input
                    type="url"
                    aria-label={`Breadcrumb ${index + 1} URL`}
                    value={item.url}
                    onChange={(e) => setBreadcrumbs((current) => current.map((breadcrumb, breadcrumbIndex) => (
                      breadcrumbIndex === index ? { ...breadcrumb, url: e.target.value } : breadcrumb
                    )))}
                    placeholder="https://example.com/path"
                    className="tb-v2-tool-input"
                    style={{ flex: '1 1 240px', minWidth: 0 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeBreadcrumb(index)}
                    aria-label={`Remove breadcrumb ${index + 1}`}
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
                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px', border: '1px solid var(--line)', borderRadius: '8px' }}>
                  <input
                    type="text"
                    aria-label={`FAQ ${index + 1} question`}
                    value={item.q}
                    onChange={(e) => setFaqQuestions((current) => current.map((question, questionIndex) => (
                      questionIndex === index ? { ...question, q: e.target.value } : question
                    )))}
                    placeholder="Question"
                    className="tb-v2-tool-input"
                  />
                  <textarea
                    aria-label={`FAQ ${index + 1} answer`}
                    value={item.a}
                    onChange={(e) => setFaqQuestions((current) => current.map((question, questionIndex) => (
                      questionIndex === index ? { ...question, a: e.target.value } : question
                    )))}
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

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', fontSize: '13px' }}>
        <strong style={{ display: 'block', marginBottom: '4px' }}>💡 JSON-LD Tips</strong>
        <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
          <li>Place the generated code in the <code>&lt;head&gt;</code> section of your HTML</li>
          <li>Validate your structured data with <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Google Rich Results Test</a></li>
          <li>Use one generated schema block per page, then validate it before publishing</li>
        </ul>
      </div>
    </div>
  );
}
