const fs = require('fs');

// Read the file
const filepath = 'app/tools/[slug]/ToolUI.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// Get all component files (without Client suffix)
const files = fs.readdirSync('components/tools/');
const componentNames = new Set(files.map(f => f.replace(/Client\.tsx$/, '')));

// Find all JSX tags used in switch cases and add Client suffix if missing
// Pattern: return <ComponentName />;
const lines = content.split('\n');
let fixed = 0;
const newLines = lines.map(line => {
  const match = line.match(/return <(\w+) \/>/);
  if (match) {
    const name = match[1];
    // Skip special components
    if (name === 'ComingSoonUI') return line;
    // If component name exists without Client suffix and with it, add Client
    if (componentNames.has(name) && !line.includes(name + 'Client')) {
      // But check if it's already the right name (file is FooClient.tsx, switch uses <FooClient />)
      // So we only need to add Client if the component is named without it
      const newLine = line.replace('return <' + name + ' />', 'return <' + name + 'Client />');
      if (newLine !== line) {
        fixed++;
      }
      return newLine;
    }
  }
  return line;
});

// Check specific problematic lines
const problematic = ['ImageScaleCalculator', 'ImageSquareFit', 'IPAPhoneticFinder', 'IPynbFormatter',
  'JSONPathQueryTester', 'JSONPathQueryTool', 'JwtTokenInspector', 'JwtTokenTester', 'JwtTool',
  'KeywordDifficultyTool', 'KeywordExtractor', 'KeywordGenerator', 'KubernetesYAMLGenerator',
  'ListDifferenceFinder', 'ListicleWriter', 'LinkedInPostGenerator', 'LandingPageCopyGenerator',
  'M4AToMP3', 'M4AToMP4', 'MakeBackgroundTransparent', 'MetaTagsTool', 'MetricImperialConverter',
  'MIMETypesReference', 'MP4ToMP3', 'MP4ToOGG', 'MuteVideoAudio', 'NetworkPortChecker',
  'NDAGenerator', 'OGGToMP3', 'PageSpeedPreview', 'PageTitleChecker', 'ParagraphCompleter',
  'PhotoMetadataRemover', 'PhotoResizeTool', 'PhysicsConstantsReference', 'PlagiarismChecker',
  'PodcastWriter', 'PollGenerator', 'PostIdeasGenerator', 'PostRewriter', 'PressureConverter',
  'ProfilePhotoEditor', 'ProtectPDF', 'PurchaseAgreementGenerator', 'PunycodeEncoder',
  'QuoteOfTheDay', 'RandomChoicePicker', 'RandomChoiceWheel', 'ReadabilityImprover',
  'ReadingLevelEstimator', 'RealEstateDescriptionWriter', 'RearrangePDFPages',
  'RegexDescriptionGenerator', 'RegexEscape', 'RegexExplainer', 'RegexPatternBuilder',
  'RegexPatternGenerator', 'RegexTool', 'RemoveExtraSpaces', 'RemoveObjectsFromPhoto',
  'RemovePersonFromPhoto', 'RemoveTextPhoto', 'RemoveWatermarkPhoto', 'RepairDefects',
  'ResponseHeaderAnalyzer', 'ScreenDensitySimulator', 'ScreenshotMaker',
  'ScientificNotationConverter', 'SentenceExtractor', 'SentimentAnalyzer', 'SEOMetaBuilder',
  'SEOTitleAnalyzer', 'SERPQuick', 'SERPRankTracker', 'SERPSnippetViewer',
  'ShellCommandReference', 'ShortenContent', 'SignPDF', 'SitemapHTMLNew', 'SitemapURLsExtractor',
  'SlugHealthChecker', 'SlugPermalinkChecker', 'SlideshowGenerator', 'StoryGenerator',
  'SummarizePodcastEpisodes', 'SummarizeYouTubeVideos', 'SynonymFinder', 'TextComplexityAnalyzer',
  'TextDeduplicator', 'TextHighlighter', 'TextImprover', 'TextLineDeduplicator',
  'TextSentenceShuffler', 'TextSortTool', 'TextStructureValidator', 'TikTokScriptWriter',
  'TimestampDiffCalculator', 'TitleRewriter', 'ToneOfVoiceRewriter', 'LogoTraceConverter',
  'TranscribePodcast', 'TriviaGenerator', 'TwitterCardPreview', 'UAParserExpress', 'UnblurImage',
  'UnicodeEscapeEncoder', 'UnitConversionTool', 'UnlockPDF', 'UpscaleImage', 'UUIDCompare',
  'UUIDComparator', 'UUIDNormalizer', 'WebhookTester', 'WebSocketTester',
  'WhatIfScenarioCalculator', 'WordAlphabetizer', 'WordCountFromURL', 'WordFinder',
  'WordFreqExpress', 'WordScrambleGenerator', 'YAMLPrettyPrint', 'YouTubeScriptWriter',
  'YouTubeTranscriptGenerator', 'AddWatermarkToPDF', 'ImageScaleCalculator', 'ImageSquareFit',
  'Base64'];

let manualFixes = 0;
const fixedContent = content;
newLines.forEach((line, i) => {
  problematic.forEach(name => {
    if (line.includes('<' + name + ' />') && !line.includes('<' + name + 'Client')) {
      console.log(`Line ${i+1}: ${line.trim()} should have Client`);
      manualFixes++;
    }
  });
});

console.log('Auto-fixed:', fixed);
console.log('Potentially manual fixes needed:', manualFixes);

// Actually do the replacements
let result = content;
problematic.forEach(name => {
  const old = 'return <' + name + ' />;';
  const newStr = 'return <' + name + 'Client />;';
  if (result.includes(old)) {
    result = result.replace(old, newStr);
    console.log('Fixed:', name);
  }
});

if (result !== content) {
  fs.writeFileSync(filepath, result);
  console.log('\nFile updated!');
} else {
  console.log('\nNo changes needed - file already correct');
}
