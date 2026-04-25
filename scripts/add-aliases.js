#!/usr/bin/env node
/**
 * Add slug aliases to ToolClient.tsx
 * Maps unwired slugs to existing components.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/tools/[slug]/ToolClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Extract already-imported component names
const importRe = /import\s+(\w+Client)\s+from\s+'@\/components\/tools\/\w+Client';/g;
const existing = new Set();
let m;
while ((m = importRe.exec(content)) !== null) {
  existing.add(m[1]);
}
console.log('Already imported:', [...existing].join(', '));

// Map slugs -> component name
const aliasMap = {
  NumberBaseConverterClient: [
    'binary-converter','binary-decimal-hex-converter','binary-text','binary-text-express',
    'binary-to-text','binary-to-text-v2','hex-converter','hex-decimal-converter',
    'decimal-to-hex','decimal-to-binary','octal-converter','base-convert-tool',
    'base-converter','base-number-converter','base64-to-text','base64-decode',
    'base64-encode','hex-to-decimal','hex-to-binary','decimal-to-hex',
    'decimal-to-octal','octal-to-decimal','binary-to-hex','hex-to-octal',
    'number-base-converter','base-2-converter','base-8-converter','base-16-converter',
    'base-36-converter','binary-decimal-converter','decimal-binary-converter',
    'hex-decimal-converter-v2','binary-converter-tool','hex-converter-tool',
    'base-converter-tool','number-system-converter','radix-converter',
  ],
  CaseConverterClient: [
    'text-case-converter','lowercase-converter','uppercase-converter',
    'title-case-generator','sentence-case','text-capitalize',
  ],
  UrlEncodeClient: [
    'url-encoder-decoder','html-encoder-decoder','backslash-escape-unescape',
    'html-encoder','html-decoder','url-encode-decode',
  ],
  JsonFormatterClient: [
    'json-validator','json-beautifier','json-prettifier','json-format',
    'format-json','prettify-json','minify-json','json-minifier',
  ],
  YamlToJsonClient: [
    'yaml-validator','yaml-formatter','yaml-prettifier',
  ],
  TextSorterClient: [
    'text-sorter','alphabetical-sorter','sort-text','sort-lines',
    'sort-list','sort-words','sort-alphabetically','text-sort-tool',
    'line-sorter','sort-text-lines','sort-strings','randomize-list',
    'shuffle-list','shuffle-text','random-text-order',
  ],
  LoremIpsumGeneratorClient: [
    'lorem-generator','lorem-text','placeholder-text','dummy-text',
    'lorem-ipsum-generator','lorem-ipsum-creator','lorem-text-generator',
    'ipsum-generator','latin-text-generator',
  ],
  HashGeneratorClient: [
    'md5-generator','sha256-generator','sha-256-generator','sha512-generator',
    'sha1-generator','hash-generator-tool',
  ],
  RemoveDuplicateLinesClient: [
    'remove-duplicates','remove-duplicate-lines',
  ],
  TextDiffClient: [
    'text-compare','compare-text','text-comparison','text-diff-tool',
  ],
  CronGeneratorClient: [
    'cron-generator','cron-expander','cron-schedule-builder','cron-tool',
    'cron-visual-builder','cron-human-readable','cron-expression-builder',
    'cron-schedule-generator','cron-validator','cron-schedule-checker',
    'cron-toolblip','cron-generator-tool','cron-generator-browser',
    'cron-generator-easy','cron-generator-express','cron-generator-final',
    'cron-generator-full','cron-generator-new','cron-generator-pro',
    'cron-generator-quick','cron-generator-std','cron-generator-v2',
    'cron-generator-v3','cron-generator-v4','cron-generator-v5',
    'cron-generator-v6','cron-schedule-validator','cron-expression-generator',
    'cron-generator-2025','cron-generator-api','cron-generator-dg',
    'cron-generator-handy',
  ],
  JwtDecoderClient: [
    'jwt-decoder','jwt-viewer','jwt-explorer','jwt-parser',
  ],
  RegexTesterClient: [
    'regex-tester','regex-match','regex-validator','regex-generator',
  ],
  UrlSlugGeneratorClient: [
    'url-slug','slug-generator','slug-creator','slug-maker',
    'url-friendly-text','text-to-slug',
  ],
  MetaTagGeneratorClient: [
    'meta-tag-generator','og-tag-generator','meta-generator','meta-tags',
    'facebook-og-generator','twitter-card-generator','seo-meta-tags',
  ],
  SerpPreviewClient: [
    'serp-preview','google-preview','search-preview','seo-preview',
    'google-serp-preview','search-result-preview',
  ],
  MarkdownToHtmlClient: [
    'markdown-prettifier','markdown-formatter','md-to-html',
  ],
  PasswordGeneratorClient: [
    'password-generator-tool','random-password-generator','pwd-generator',
  ],
  UuidGeneratorClient: [
    'uuid-generator','uuid-creator','uuid-maker','uuid-v4-generator',
    'guid-generator','unique-id-generator',
  ],
  ImageResizerClient: [
    'image-resizer','resize-image','resize-photo','photo-resizer',
    'image-resize-tool','resize-images','image-resize-browser',
    'image-resize-toolblip','resize-image-tool','resize-picture',
    'picture-resizer','image-scaler','scale-image',
  ],
  ImageCropperClient: [
    'image-cropper','crop-image','crop-photo','photo-cropper',
    'image-crop-tool','crop-photo-tool','cropping-tool',
  ],
  ImageFormatConverterClient: [
    'image-format-converter','convert-image-format','image-converter',
    'change-image-format','image-file-converter','png-to-jpg','jpg-to-png',
    'webp-converter','convert-to-webp','convert-to-png','convert-to-jpg',
    'image-convert-format','format-converter-image',
  ],
  PercentageCalculatorClient: [
    'percentage-calculator','percent-calculator','percentage-of-number',
    'percentage-change-calculator','percentage-off-calculator',
  ],
  ReadabilityScoreClient: [
    'readability-checker','flesch-reading-ease','readability-score',
    'reading-level','text-readability',
  ],
  HttpHeadersViewerClient: [
    'http-headers-viewer','http-header-checker','view-http-headers',
    'http-headers-check','check-http-headers','header-viewer',
  ],
  ScreenResolutionTesterClient: [
    'screen-resolution-tester','viewport-tester','responsive-checker',
    'browser-resolution-test','screen-size-tester','device-viewport-test',
  ],
  FaviconGeneratorClient: [
    'favicon-generator','favicon-creator','favicon-maker','favicon-from-emoji',
    'favicon-tool','favicon-maker-tool','favicon-generator-tool',
    'favicon-png-generator','favicon-preview-tool',
  ],
  GrammarCheckerClient: [
    'grammar-checker','grammar-check','grammar-fixer','check-grammar',
    'grammar-checker-tool','english-grammar-checker','grammar-corrector',
  ],
  QrCodeGeneratorClient: [
    'qr-generator','qrcode-generator','qr-creator','qr-code-maker',
  ],
  CircleCropClient: [
    'circle-crop','circular-crop','crop-circle','round-crop',
  ],
  SquareCropClient: [
    'square-crop','crop-square','square-crop-tool',
  ],
  ContrastCheckerClient: [
    'contrast-checker','color-contrast-checker','wcag-contrast-checker',
    'contrast-auditor','color-contrast-auditor',
  ],
  CssBorderRadiusGeneratorClient: [
    'css-border-radius-generator','border-radius-generator','border-radius-tool',
  ],
  CssGradientGeneratorClient: [
    'css-gradient-generator','gradient-generator','css-gradient-tool',
  ],
  SqlToJsonClient: [
    'sql-to-json','sql-converter','sql-to-json-converter',
  ],
  XmlToJsonClient: [
    'xml-to-json','xml-converter','xml-to-json-converter','xml-formatter',
  ],
  JsMinifierClient: [
    'js-minifier','javascript-minifier','minify-javascript','minify-js',
    'compress-javascript',
  ],
  UnitConverterClient: [
    'unit-converter','all-in-one-unit-converter','angle-unit-converter',
    'area-converter','pressure-converter','volume-converter','speed-converter',
    'energy-converter','temperature-converter','length-converter',
    'weight-converter','mass-converter','time-converter','unit-conversion-tool',
    'unit-convert-toolblip','unit-converter-browser','unit-converter-easy',
    'unit-converter-express','unit-converter-final','unit-converter-full',
    'unit-converter-handy','unit-converter-length-weight','unit-converter-new',
    'unit-converter-pro','unit-converter-quick','unit-converter-std',
    'unit-converter-tool','unit-converter-toolbox','unit-converter-v2',
    'unit-converter-v3','unit-converter-v4','unit-converter-v5',
    'unit-converter-xl','unit-converter-2025','unit-converter-dg',
    'unit-toolblip','units-convert-tool',
  ],
};

// Build new imports (only for components not already imported)
let newImports = '';
const neededImports = [];
for (const comp of Object.keys(aliasMap)) {
  if (!existing.has(comp)) {
    neededImports.push(comp);
    newImports += `import ${comp} from '@/components/tools/${comp}';\n`;
  }
}

// Build case statements for all aliases
let newCases = '';
let aliasCount = 0;
for (const [comp, slugs] of Object.entries(aliasMap)) {
  for (const slug of slugs) {
    newCases += `    case '${slug}':\n`;
    aliasCount++;
  }
  newCases += `      return <${comp} />;\n`;
}

console.log(`New imports: ${neededImports.length}`);
console.log(`New cases: ${aliasCount}`);

// Find where to insert imports (after last existing import)
// Find where to insert imports (after last existing import - UnitConverterClient is last)
// Find insertion point after UnitConverterClient (last import)
const importInsertPoint = content.lastIndexOf("import UnitConverterClient from '@/components/tools/UnitConverterClient';");
if (importInsertPoint === -1) {
  console.error('Could not find UnitConverterClient import');
  process.exit(1);
}
if (importInsertPoint === -1) {
  console.error('Could not find insertion point for imports');
  process.exit(1);
}
const endOfLine = content.indexOf('\n', importInsertPoint);
content = content.slice(0, endOfLine + 1) + '\n' + newImports + content.slice(endOfLine + 1);

// Find default case and insert cases before it
const defaultPos = content.indexOf('default:');
if (defaultPos === -1) {
  console.error('Could not find default case');
  process.exit(1);
}
// Find the last case before default
const beforeDefault = content.slice(0, defaultPos);
const lastCasePos = beforeDefault.lastIndexOf('\n    case ');
if (lastCasePos === -1) {
  console.error('Could not find last case');
  process.exit(1);
}
const endOfLastCase = content.indexOf('\n', lastCasePos + 1);
content = content.slice(0, endOfLastCase) + '\n' + newCases + content.slice(endOfLastCase);

fs.writeFileSync(filePath, content);
console.log('Done!');
