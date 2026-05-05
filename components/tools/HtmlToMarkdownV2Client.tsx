"use client";

import { useState } from "react";

export default function HtmlToMarkdownV2() {
  const [html, setHtml] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState("");

  const htmlToMarkdown = (html: string) => {
    let md = html
      .replace(/<h1[^>]*>([^<]*)<\/h1>/gi, "# $1\n")
      .replace(/<h2[^>]*>([^<]*)<\/h2>/gi, "## $1\n")
      .replace(/<h3[^>]*>([^<]*)<\/h3>/gi, "### $1\n")
      .replace(/<h4[^>]*>([^<]*)<\/h4>/gi, "#### $1\n")
      .replace(/<h5[^>]*>([^<]*)<\/h5>/gi, "##### $1\n")
      .replace(/<h6[^>]*>([^<]*)<\/h6>/gi, "###### $1\n")
      .replace(/<strong[^>]*>([^<]*)<\/strong>/gi, "**$1**")
      .replace(/<b[^>]*>([^<]*)<\/b>/gi, "**$1**")
      .replace(/<em[^>]*>([^<]*)<\/em>/gi, "*$1*")
      .replace(/<i[^>]*>([^<]*)<\/i>/gi, "*$1*")
      .replace(/<code[^>]*>([^<]*)<\/code>/gi, "`$1`")
      .replace(/<pre[^>]*>([^<]*)<\/pre>/gi, "```\n$1\n```\n")
      .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, "[$2]($1)")
      .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, "![$2]($1)")
      .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/gi, "![$1]($2)")
      .replace(/<li[^>]*>([^<]*)<\/li>/gi, "- $1\n")
      .replace(/<blockquote[^>]*>([^<]*)<\/blockquote>/gi, "> $1\n")
      .replace(/<p[^>]*>([^<]*)<\/p>/gi, "$1\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
    
    return md.replace(/\n{3,}/g, "\n\n").trim();
  };

  const handleConvert = () => {
    setError("");
    try {
      setMarkdown(htmlToMarkdown(html));
    } catch (err) {
      setError("Failed to convert HTML to Markdown");
      setMarkdown("");
    }
  };

  return (
    <div className="tb-v2-section">
      <h2 className="tb-v2-heading-sm">HTML to Markdown</h2>
      <p className="tb-v2-text">Convert HTML to Markdown format for documentation and blogs.</p>
      
      <div className="tb-v2-form-group">
        <label className="tb-v2-label">HTML Input</label>
        <textarea
          className="tb-v2-textarea"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="Enter HTML code..."
          rows={8}
        />
      </div>

      <button className="tb-v2-button" onClick={handleConvert}>
        Convert to Markdown
      </button>

      {error && <p className="tb-v2-error">{error}</p>}

      {markdown && (
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Markdown Output</label>
          <textarea
            className="tb-v2-textarea"
            value={markdown}
            readOnly
            rows={8}
          />
        </div>
      )}
    </div>
  );
}
