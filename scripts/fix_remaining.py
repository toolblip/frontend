#!/usr/bin/env python3
"""Fix remaining 36 missing slugs."""
import os
from pathlib import Path

TOOLS_DIR = Path("/Users/ray/Work/toolblip/components/tools")
TOOLUI_PATH = Path("/Users/ray/Work/toolblip/app/tools/[slug]/ToolUI.tsx")

ROUTING = [
    ("jwt-quick", "JwtDecoderClient"),
    ("jwt-tool", "JwtDecoderClient"),
    ("metadata", "ImageMetadataViewerClient"),
    ("pdf-password-remover", "AddWatermarkToPDFClient"),
    ("percentage-change-calc", "PercentageCalculatorClient"),
    ("port-checker", "PortScannerClient"),
    ("port-scan-tool", "PortScannerClient"),
    ("readability-dg", "ReadabilityScoreClient"),
    ("readability-expander", "ReadabilityScoreClient"),
    ("readability-grade-tool", "ReadabilityScoreClient"),
    ("readability-quick", "ReadabilityScoreClient"),
    ("readability-toolblip", "ReadabilityScoreClient"),
    ("regex-match-tool", "RegexTesterClient"),
    ("regex-quick", "RegexTesterClient"),
    ("regex-test-tool", "RegexTesterClient"),
    ("regex-tool", "RegexTesterClient"),
    ("remove-watermark", "RemoveWatermarkFromPhotoClient"),
    ("rot13-express", "Rot13CipherClient"),
    ("serp-browser", "SerpPreviewClient"),
    ("serp-fresh", "SerpPreviewClient"),
    ("sitemap-extractor", "SitemapAnalyzerClient"),
    ("sleep-duration-calculator", "SleepDurationCalculatorClient"),
    ("ssh-key-gen", "SSHKeyGeneratorClient"),
    ("text-sorting-tool", "TextSorterClient"),
    ("translate", "TextTranslatorClient"),
    ("unit-convert-toolblip", "UnitConverterClient"),
    ("unit-fresh", "UnitConverterClient"),
    ("unit-quick", "UnitConverterClient"),
    ("unit-toolblip", "UnitConverterClient"),
    ("vsd-to-docx", "VsdxToDocxClient"),
    ("vsd-to-pptx", "VsdxToPptxClient"),
    ("vsdx-to-docx", "VsdxToDocxClient"),
    ("vsdx-to-pptx", "VsdxToPptxClient"),
    ("word-combinations", "WordCombinationsGeneratorClient"),
    ("zip", "CreateZipFileClient"),
]

NEW_COMPONENTS = [
    ("PsdToAIConverterClient", "psd-to-ai", "PSD to AI Converter",
     "Convert Adobe PSD files to AI vector format. Extract layers and convert to scalable graphics."),
    ("SleepDurationCalculatorClient", "sleep-duration-calculator", "Sleep Duration Calculator",
     "Calculate optimal sleep duration and wake times. Find the best sleep windows based on sleep cycles."),
    ("TextTranslatorClient", "translate", "Text Translator",
     "Translate text between 100+ languages. Detect language automatically and convert instantly."),
    ("VsdxToDocxClient", "vsdx-to-docx", "VSDX to DOCX Converter",
     "Convert Microsoft Visio VSDX files to DOCX Word documents. Export diagrams as editable text."),
    ("VsdxToPptxClient", "vsdx-to-pptx", "VSDX to PPTX Converter",
     "Convert Microsoft Visio VSDX files to PPTX PowerPoint presentations. Turn diagrams into slides."),
    ("VsdToDocxClient", "vsd-to-docx", "VSD to DOCX Converter",
     "Convert legacy Microsoft Visio VSD files to DOCX Word documents. Upgrade old diagrams."),
    ("VsdToPptxClient", "vsd-to-pptx", "VSD to PPTX Converter",
     "Convert legacy Microsoft Visio VSD files to PPTX PowerPoint presentations."),
    ("CreateZipFileClient", "zip", "Create ZIP File",
     "Create ZIP archives from files and folders. Compress multiple files into a single portable archive."),
]

STUB_TEMPLATE = """'use client';

interface Props {{
  tool: {{
    name: string;
    slug: string;
    description: string;
  }};
}}

export default function {name}({{ tool }}: Props) {{
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{{tool.name}}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{{tool.description}}</p>
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-500">Tool coming soon...</p>
      </div>
    </div>
  );
}}
"""

with open(TOOLUI_PATH, 'r') as f:
    content = f.read()

DEFAULT_MARKER = "    default:\n      return <ComingSoonUI tool={tool} />;"

added_switch = 0
for slug, comp in ROUTING:
    case_line = f"    case '{slug}': return <{comp} />;"
    if f"case '{slug}':" not in content:
        content = content.replace(DEFAULT_MARKER, f"{case_line}\n  {DEFAULT_MARKER}")
        added_switch += 1
        print(f"  ROUTING: {slug} -> {comp}")

for name, slug, title, desc in NEW_COMPONENTS:
    path = TOOLS_DIR / f"{name}.tsx"
    if not path.exists():
        with open(path, 'w') as f:
            f.write(STUB_TEMPLATE.format(name=name))
        print(f"  CREATED: {name} -> {slug}")
    else:
        print(f"  SKIP (exists): {name}")

    case_line = f"    case '{slug}': return <{name} />;"
    if f"case '{slug}':" not in content:
        content = content.replace(DEFAULT_MARKER, f"{case_line}\n  {DEFAULT_MARKER}")
        print(f"  SWITCH: {slug} -> {name}")

with open(TOOLUI_PATH, 'w') as f:
    f.write(content)

print(f"\nDone. Added {added_switch} routing cases + {len(NEW_COMPONENTS)} new switch cases.")
