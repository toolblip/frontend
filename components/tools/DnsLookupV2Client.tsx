"use client";

import { useRef, useState } from "react";
import ToolExampleClearActions from "@/components/tools/ToolExampleClearActions";
import {
  DnsAnswer,
  filterDnsAnswers,
  normalizeHostname,
} from "@/lib/network-tools";

export const RECORD_TYPES = ["A", "AAAA", "MX", "TXT", "CNAME"] as const;
export type RecordType = (typeof RECORD_TYPES)[number];
const EXAMPLE_DOMAIN = "google.com";
const DEFAULT_RECORD_TYPES: RecordType[] = [...RECORD_TYPES];
export interface TypeResult {
  type: RecordType;
  records: string[];
  error?: string;
}

export async function queryDnsType(
  domain: string,
  type: RecordType,
): Promise<TypeResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(
      `/api/dns/resolve?name=${encodeURIComponent(domain)}&type=${type}`,
      { signal: controller.signal },
    );
    if (!response.ok) throw new Error("resolver");
    const data = (await response.json()) as {
      Status: number;
      Answer?: DnsAnswer[];
    };
    return data.Status === 0 && data.Answer
      ? {
          type,
          records: filterDnsAnswers(type, data.Answer).map(
            (answer) => answer.data,
          ),
        }
      : { type, records: [] };
  } catch (error) {
    return {
      type,
      records: [],
      error:
        error instanceof DOMException && error.name === "AbortError"
          ? "Lookup timed out."
          : "Lookup failed.",
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function DnsLookupV2Client() {
  const [domain, setDomain] = useState("");
  const [selected, setSelected] = useState<RecordType[]>(DEFAULT_RECORD_TYPES);
  const [results, setResults] = useState<TypeResult[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const requestId = useRef(0);
  const clear = () => {
    requestId.current += 1;
    setDomain("");
    setSelected([...DEFAULT_RECORD_TYPES]);
    setResults(null);
    setError("");
    setLoading(false);
    setCopied(false);
  };
  const loadExample = () => {
    requestId.current += 1;
    setDomain(EXAMPLE_DOMAIN);
    setSelected([...DEFAULT_RECORD_TYPES]);
    setResults(null);
    setError("");
    setLoading(false);
    setCopied(false);
  };
  const toggleType = (type: RecordType) =>
    setSelected((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  const lookup = async () => {
    const target = normalizeHostname(domain);
    if (!target) {
      requestId.current += 1;
      setResults(null);
      setError("Enter a valid hostname, such as example.com.");
      setLoading(false);
      setCopied(false);
      return;
    }
    if (selected.length === 0) {
      requestId.current += 1;
      setResults(null);
      setError("Select at least one record type.");
      setLoading(false);
      setCopied(false);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setResults(null);
    setError("");
    setCopied(false);
    const all = await Promise.all(
      selected.map((type) => queryDnsType(target, type)),
    );
    if (id === requestId.current) {
      setResults(all);
      setLoading(false);
    }
  };
  const outputText =
    results
      ?.filter((result) => result.records.length > 0)
      .map(
        (result) =>
          `${result.type}:\n${result.records.map((record) => `  ${record}`).join("\n")}`,
      )
      .join("\n\n") ?? "";
  const copy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Domain</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={
            Boolean(domain || results || error || copied) ||
            selected.length !== DEFAULT_RECORD_TYPES.length ||
            DEFAULT_RECORD_TYPES.some((type) => !selected.includes(type))
          }
        />
      </div>
      <div style={{ padding: 20 }} className="flex flex-col gap-4">
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            placeholder="example.com"
            className="tb-v2-input"
            style={{ flex: 1 }}
            onKeyDown={(event) => event.key === "Enter" && lookup()}
            aria-label="Domain"
          />
          <button
            type="button"
            onClick={lookup}
            disabled={loading || !domain.trim() || selected.length === 0}
            className="tb-v2-btn tb-v2-btn-primary"
            style={{ minWidth: 90 }}
          >
            {loading ? "Looking up" : "Lookup All"}
          </button>
        </div>
        <div>
          <label className="tb-v2-tool-label">Record Types</label>
          <div
            className="tb-v2-mode-tabs"
            role="group"
            style={{ marginTop: 8 }}
          >
            {RECORD_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`tb-v2-mode-tab ${selected.includes(type) ? "on" : ""}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && (
        <div style={{ color: "#ef4444", padding: "0 20px 12px", fontSize: 13 }}>
          {error}
        </div>
      )}
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Results by Type</span>
        <button
          type="button"
          onClick={copy}
          disabled={!outputText}
          className={`tb-v2-copy-btn ${copied ? "done" : ""}`}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!results ? (
          <p className="tb-v2-empty">
            Enter a hostname to query its A, AAAA, MX, TXT, and CNAME records.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {results.map((result) => (
              <div
                key={result.type}
                className="tb-v2-tool-pre"
                style={{ padding: "10px 14px" }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: result.records.length ? 6 : 0,
                  }}
                >
                  {result.type}
                </div>
                {result.error ? (
                  <div style={{ color: "var(--red, #dc2626)" }}>
                    {result.error}
                  </div>
                ) : result.records.length === 0 ? (
                  <div style={{ color: "var(--fg-2)" }}>No records found</div>
                ) : (
                  result.records.map((record, index) => (
                    <div key={`${record}-${index}`}>{record}</div>
                  ))
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
