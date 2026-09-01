"use client";

import { useState } from "react";
import ToolExampleClearActions from "@/components/tools/ToolExampleClearActions";
import { calculateCidr } from "@/lib/network-tools";

const EXAMPLE = "192.168.1.0/24";

export default function CidrCalculatorClient() {
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
  const copy = () => {
    if (!result) return;
    navigator.clipboard
      .writeText(
        Object.entries(result)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),
      )
      .catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  const rows = result
    ? [
        ["Network Address", result.network],
        ["Subnet Mask", result.subnetMask],
        ["Wildcard Mask", result.wildcard],
        ["Broadcast Address", result.broadcast],
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
          type="text"
          value={cidr}
          onChange={(event) => setCidr(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && calculate()}
          placeholder={EXAMPLE}
          className="tb-v2-input"
          style={{ flex: "1 1 220px", fontFamily: "var(--f-mono)" }}
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
            <span className="tb-v2-tool-label">Results</span>
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
