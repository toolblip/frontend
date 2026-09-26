"use client";
import { downloadText } from '@/lib/seo-network/request';
import { SeoOwnedBoundary } from './SeoNetworkShared';

import { useEffect, useState } from "react";
import ToolExampleClearActions from "@/components/tools/ToolExampleClearActions";
import { calculateCidr } from "@/lib/network-tools";

const EXAMPLE = "192.168.1.0/24";

function CidrCalculatorForm() {
  const [cidr, setCidr] = useState(EXAMPLE);
  const [result, setResult] = useState<ReturnType<typeof calculateCidr>>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const calculate = () => {
    const next = calculateCidr(cidr);
    setResult(next);
    setError(next ? "" : "Enter a valid IPv4 CIDR such as 192.168.1.0/24.");
    setCopied(false);
  };
  const clear = () => {
    setCidr("");
    setResult(null);
    setError("");
    setCopied(false);
  };
  const loadExample = () => {
    setCidr(EXAMPLE);
    setResult(null);
    setError("");
    setCopied(false);
  };
  const copy = async () => {
    if (!result) return;
    await navigator.clipboard
      .writeText(
        Object.entries(result)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),
      )
      .then(() => setCopied(true)).catch(() => setError("Clipboard unavailable. Select the result to copy."));
    window.setTimeout(() => setCopied(false), 1500);
  };
  useEffect(() => { if (cidr) calculate(); else { setResult(null); setError(""); } }, [cidr]);

  const rows = result
    ? [
        ["Network Address", result.network],
        ["Subnet Mask", result.subnetMask],
        ["Wildcard Mask", result.wildcard],
        [result.prefix >= 31 ? "Last Address (no broadcast on /31 or /32)" : "Broadcast Address", result.broadcast],
        ["First Host", result.firstHost],
        ["Last Host", result.lastHost],
        ["Total Addresses", result.totalAddresses.toLocaleString()],
        ["Usable Hosts", result.usableHosts.toLocaleString()],
      ]
    : [];
  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CIDR Notation</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={Boolean(cidr || result || error)}
        />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 20 }}>
        <input
          maxLength={32}
          type="text"
          value={cidr}
          onChange={(event) => setCidr(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && calculate()}
          placeholder={EXAMPLE}
          className="tb-v2-input"
          style={{ flex: "1 1 180px", minWidth: 0, fontFamily: "var(--f-mono)" }}
          aria-label="CIDR input"
        />
        <button
          type="button"
          onClick={calculate}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          Calculate
        </button>
      </div>
      {error && (
        <div style={{ color: "#ef4444", padding: "0 20px 12px", fontSize: 13 }}>
          {error}
        </div>
      )}
      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Results</span><button className="tb-v2-btn-sm" onClick={() => downloadText(rows.map(([label, value]) => `${label}: ${value}`).join("\n"), "network-result.txt")}>Download</button>
            <button
              type="button"
              onClick={copy}
              className={`tb-v2-copy-btn ${copied ? "done" : ""}`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            {rows.map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--tb-border)",
                }}
              >
                <span
                  style={{ color: "var(--tb-text-secondary)", fontSize: 13 }}
                >
                  {label}
                </span>
                <span style={{ fontFamily: "var(--f-mono)" }}>{value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CidrCalculatorClient() { return <SeoOwnedBoundary><CidrCalculatorForm /></SeoOwnedBoundary>; }
