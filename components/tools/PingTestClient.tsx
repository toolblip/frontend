"use client";

import { useRef, useState } from "react";
import ToolExampleClearActions from "@/components/tools/ToolExampleClearActions";
import { normalizeHostname } from "@/lib/network-tools";

type AddressType = "A" | "AAAA";
type Record = { address: string; ttl: number; type: AddressType };
type Result = {
  status: "Reachable" | "No records" | "Network error" | "Invalid input";
  time: number;
  records: Record[];
  error?: string;
};
const EXAMPLE = "example.com";

async function query(
  host: string,
  type: AddressType,
  signal: AbortSignal,
): Promise<Record[]> {
  const response = await fetch(
    `https://dns.google/resolve?name=${encodeURIComponent(host)}&type=${type}`,
    { signal },
  );
  if (!response.ok) throw new Error("resolver");
  const data = (await response.json()) as {
    Status: number;
    Answer?: { type: number; data: string; TTL: number }[];
  };
  if (data.Status !== 0) return [];
  return (data.Answer ?? [])
    .filter((answer) => answer.type === (type === "A" ? 1 : 28))
    .map((answer) => ({ address: answer.data, ttl: answer.TTL, type }));
}

export default function PingTestClient() {
  const [host, setHost] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const requestId = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  const clear = () => {
    requestId.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    setHost("");
    setResult(null);
    setLoading(false);
    setCopied(false);
  };
  const loadExample = () => {
    requestId.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    setHost(EXAMPLE);
    setResult(null);
    setLoading(false);
    setCopied(false);
  };
  const check = async () => {
    const normalized = normalizeHostname(host);
    if (!normalized) {
      setResult({
        status: "Invalid input",
        time: 0,
        records: [],
        error: "Enter a valid hostname, such as example.com.",
      });
      return;
    }
    const id = ++requestId.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    const start = performance.now();
    setLoading(true);
    setResult(null);
    setCopied(false);
    try {
      const records = (
        await Promise.all([
          query(normalized, "A", controller.signal),
          query(normalized, "AAAA", controller.signal),
        ])
      ).flat();
      if (id !== requestId.current) return;
      const time = Math.round(performance.now() - start);
      setResult(
        records.length
          ? { status: "Reachable", time, records }
          : {
              status: "No records",
              time,
              records,
              error: `No A or AAAA records were returned for ${normalized}.`,
            },
      );
    } catch (error) {
      if (id !== requestId.current) return;
      setResult({
        status: "Network error",
        time: Math.round(performance.now() - start),
        records: [],
        error:
          error instanceof DOMException && error.name === "AbortError"
            ? "The DNS check timed out after 5 seconds."
            : "The DNS check could not reach the resolver.",
      });
    } finally {
      window.clearTimeout(timeout);
      if (id === requestId.current) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  };
  const copy = async () => {
    if (!result) return;
    const text =
      result.records
        .map(
          (record) => `${record.type}: ${record.address} (TTL ${record.ttl}s)`,
        )
        .join("\n") || `${result.status}: ${result.error ?? ""}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">DNS Check</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={Boolean(host || result)}
        />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 20 }}>
        <input
          type="text"
          value={host}
          onChange={(event) => setHost(event.target.value)}
          placeholder="example.com"
          className="tb-v2-input"
          style={{ flex: "1 1 220px" }}
          onKeyDown={(event) => event.key === "Enter" && check()}
          aria-label="Hostname"
        />
        <button
          type="button"
          onClick={check}
          disabled={loading}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          {loading ? "Checking" : "Check DNS"}
        </button>
      </div>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        {result && (
          <button
            type="button"
            onClick={copy}
            className={`tb-v2-copy-btn ${copied ? "done" : ""}`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        {result ? (
          <div>
            <strong>{result.status}</strong>
            <div style={{ color: "var(--tb-text-secondary)", marginTop: 6 }}>
              {result.error ?? `DNS records returned in ${result.time}ms.`}
            </div>
            {result.records.map((record) => (
              <div
                key={`${record.type}-${record.address}`}
                style={{ fontFamily: "var(--f-mono)", marginTop: 8 }}
              >
                {record.type}: {record.address}{" "}
                <span style={{ color: "var(--tb-text-secondary)" }}>
                  TTL {record.ttl}s
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="tb-v2-empty">
            Checks A and AAAA records through Google DNS-over-HTTPS. It does not
            send an ICMP ping.
          </p>
        )}
      </div>
    </div>
  );
}
