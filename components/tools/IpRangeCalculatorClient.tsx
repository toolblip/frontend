"use client";

import { useState } from "react";
import ToolExampleClearActions from "@/components/tools/ToolExampleClearActions";
import { calculateIpRange } from "@/lib/network-tools";

const EXAMPLE_START = "192.168.1.1";
const EXAMPLE_END = "192.168.1.254";

export default function IpRangeCalculatorClient() {
  const [start, setStart] = useState(EXAMPLE_START);
  const [end, setEnd] = useState(EXAMPLE_END);
  const [result, setResult] =
    useState<ReturnType<typeof calculateIpRange>>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const calculate = () => {
    const next = calculateIpRange(start, end);
    setResult(next);
    setError(
      next
        ? ""
        : "Enter valid IPv4 addresses with the start at or before the end.",
    );
    setCopied(false);
  };
  const clear = () => {
    setStart("");
    setEnd("");
    setResult(null);
    setError("");
    setCopied(false);
  };
  const loadExample = () => {
    setStart(EXAMPLE_START);
    setEnd(EXAMPLE_END);
    setResult(null);
    setError("");
    setCopied(false);
  };
  const copy = () => {
    if (!result) return;
    navigator.clipboard
      .writeText(
        `Range: ${result.startIp} - ${result.endIp}\nCount: ${result.count}\nCIDR: ${result.network}/${result.prefix}\nNetmask: ${result.netmask}\nNetwork: ${result.network}\nBroadcast: ${result.broadcast}`,
      )
      .catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  const rows = result
    ? [
        ["First IP", result.firstIp],
        ["Last IP", result.lastIp],
        ["Inclusive Address Count", result.count.toLocaleString()],
        ["Smallest Enclosing CIDR", `${result.network}/${result.prefix}`],
        ["Netmask", result.netmask],
        ["Network Address", result.network],
        ["Broadcast Address", result.broadcast],
      ]
    : [];
  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">IP Range</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={Boolean(start || end || result || error)}
        />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 20 }}>
        <input
          type="text"
          value={start}
          onChange={(event) => setStart(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && calculate()}
          placeholder="Start IP"
          className="tb-v2-input"
          style={{ flex: "1 1 220px", fontFamily: "var(--f-mono)" }}
          aria-label="Start IP"
        />
        <input
          type="text"
          value={end}
          onChange={(event) => setEnd(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && calculate()}
          placeholder="End IP"
          className="tb-v2-input"
          style={{ flex: "1 1 220px", fontFamily: "var(--f-mono)" }}
          aria-label="End IP"
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
