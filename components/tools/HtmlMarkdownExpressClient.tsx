"use client";

import { useState } from "react";

export default function HtmlMarkdownExpress() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"toMd" | "toHtml">("toMd");

  const htmlToMarkdown = (html: string) => {
    return html
      .replace(/<\/?h1[^>]*>/gi, "# ")
      .replace(/<\/?h2[^>]*>/gi, "## ")
      .replace(/<\/?h3[^>]*>/gi, "### ")
      .replace(/<\/?h4[^>]*>/gi, "#### ")
      .replace(/<\/?h5[^>]*>/gi, "##### ")
      .replace(/<\/?h6[^>]*>/gi, "###### ")
      .replace(/<\/?p[^>]*>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?strong[^>]*>/gi, "**")
      .replace(/<\/?b[^>]*>/gi, "**")
      .replace(/<\/?em[^>]*>/gi, "*")
      .replace(/<\/?i[^>]*>/gi, "*")
      .replace(/<\/?a[^>]*>([^<]*)<\/?a>/gi, "[$1](url)")
      .replace(/<\/?ul[^>]*>/gi, "\n")
      .replace(/<\/?ol[^>]*>/gi, "\n")
      .replace(/<\/?li[^>]*>/gi, "- ")
      .replace(/<\/?code[^>]*>/gi, "`")
      .replace(/<\/?pre[^>]*>/gi, "```\n")
      .replace(/<\/?blockquote[^>]*>/gi, "> ")
      .replace(/<\/?[^>]+>/gi, "")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&nbsp;/gi, " ")
      .trim();
  };

  const markdownToHtml = (md: string) => {
    return md
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
      .replace(/^##### (.+)$/gm, "<h5>$1</h5>")
      .replace(/^###### (.+)$/gm, "<h6>$1</h6>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");
  };

  const handleConvert = () => {
    setOutput(mode === "toMd" ? htmlToMarkdown(input) : markdownToHtml(input));
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">HTML / Markdown Express</h2>
      <p className="tb-v2-text">Convert between HTML and Markdown formats.</p>
      
      <div className="tb-v2-form-group">
        <div className="tb-v2-button-group">
          <button
            className={mode === "toMd" ? "tb-v2-button" : "tb-v2-button-secondary"}
            onClick={() => setMode("toMd")}
          >
            HTML → Markdown
          </button>
          <button
            className={mode === "toHtml" ? "tb-v2-button" : "tb-v2-button-secondary"}
            onClick={() => setMode("toHtml")}
          >
            Markdown → HTML
          </button>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Input</label>
        <textarea
          className="tb-v2-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "toMd" ? "Enter HTML..." : "Enter Markdown..."}
          rows={6}
        />
      </div>

      <button className="tb-v2-button" onClick={handleConvert}>
        Convert
      </button>

      {output && (
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Output</label>
          <textarea
            className="tb-v2-textarea"
            value={output}
            readOnly
            rows={6}
          />
        </div>
      )}
    </div>
  );
}
