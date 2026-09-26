"use client";
import { SeoOwnedBoundary } from './SeoNetworkShared';

import { useMemo, useState } from "react";
import { downloadText } from '@/lib/seo-network/request';
import ToolExampleClearActions from "@/components/tools/ToolExampleClearActions";
import {
  ComposeOptions,
  ComposeTemplate,
  generateDockerComposeYaml,
  isComposeClearable,
  validateComposeOptions,
} from "@/lib/network-tools";

const TEMPLATES: Record<ComposeTemplate, string> = {
  "full-stack": "App + PostgreSQL + Redis",
  "node-postgres": "Node.js + PostgreSQL",
  "node-mysql": "Node.js + MySQL",
  "node-redis": "Node.js + Redis",
  "wordpress-mysql": "WordPress + MySQL",
  "nginx-static": "Nginx (Static Site)",
};
const EMPTY_STATE: ComposeOptions & { template: ComposeTemplate } = {
  template: "full-stack",
  serviceName: "",
  hostPort: "",
  appPort: "",
  dbName: "",
  dbUser: "",
  dbPassword: "",
};
const EXAMPLE_STATE: ComposeOptions & { template: ComposeTemplate } = {
  template: "full-stack",
  serviceName: "app",
  hostPort: "3000",
  appPort: "3000",
  dbName: "appdb",
  dbUser: "appuser",
  dbPassword: "changeme",
};

function DockerComposeGeneratorForm() {
  const [state, setState] = useState(EMPTY_STATE);
  const [copied, setCopied] = useState(false);
  const update = (key: keyof typeof state, value: string) =>
    { setCopied(false); setState((current) => ({ ...current, [key]: value })); }
  const errors = useMemo(
    () => [...validateComposeOptions(state.template, state), ...(["db", "cache"].includes(state.serviceName) ? ["App service name must differ from db and cache."] : [])],
    [state],
  );
  const yaml = useMemo(
    () =>
      errors.length === 0
        ? generateDockerComposeYaml(state.template, state).replace(/\$/g, "$$$$")
        : "# Enter valid values to generate Compose YAML.",
    [errors.length, state],
  );
  const loadExample = () => {
    setState(EXAMPLE_STATE);
    setCopied(false);
  };
  const clear = () => {
    setState(EMPTY_STATE);
    setCopied(false);
  };
  const copy = async () => {
    if (errors.length > 0) return;
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  const databaseTemplate = [
    "full-stack",
    "node-postgres",
    "node-mysql",
    "wordpress-mysql",
  ].includes(state.template);
  const appPortTemplate = [
    "full-stack",
    "node-postgres",
    "node-mysql",
    "node-redis",
  ].includes(state.template);
  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Template</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clear}
          canClear={isComposeClearable(state, copied)}
        />
      </div>
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <select
          value={state.template}
          onChange={(event) => update("template", event.target.value)}
          className="tb-v2-input"
          aria-label="Compose template"
        >
          {Object.entries(TEMPLATES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        {!["wordpress-mysql", "nginx-static"].includes(state.template) && (
          <input
            maxLength={512}
            value={state.serviceName}
            onChange={(event) => update("serviceName", event.target.value)}
            className="tb-v2-input"
            placeholder="Service name (app)"
            aria-label="Service name"
          />
        )}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            maxLength={512}
            value={state.hostPort}
            onChange={(event) => update("hostPort", event.target.value)}
            className="tb-v2-input"
            placeholder="Host port"
            aria-label="Host port"
            style={{ flex: "1 1 100px", minWidth: 0 }}
          />
          {appPortTemplate && (
            <input
            maxLength={512}
              value={state.appPort}
              onChange={(event) => update("appPort", event.target.value)}
              className="tb-v2-input"
              placeholder="Container port"
              aria-label="Container port"
              style={{ flex: "1 1 100px", minWidth: 0 }}
            />
          )}
        </div>
        {databaseTemplate && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {(["dbName", "dbUser", "dbPassword"] as const).map((key) => (
              <input
            maxLength={512}
                key={key}
                value={state[key] ?? ""}
                onChange={(event) => update(key, event.target.value)}
                className="tb-v2-input"
                placeholder={key}
                aria-label={key}
                style={{ flex: "1 1 180px" }}
              />
            ))}
          </div>
        )}
        {errors.length > 0 && (
          <div style={{ color: "#ef4444", fontSize: 13 }}>{errors[0]}</div>
        )}
      </div>
      <div className="tb-v2-tool-output-head">
<span className="tb-v2-tool-label">docker-compose.yml</span><button className="tb-v2-btn-sm" disabled={errors.length > 0} onClick={() => downloadText(yaml, "docker-compose.yml")}>Download</button>
        <button
          type="button"
          onClick={copy}
          disabled={errors.length > 0}
          className={`tb-v2-copy-btn ${copied ? "done" : ""}`}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }} className="tb-v2-tool-pre">{yaml}</pre>
      </div>
    </div>
  );
}

export default function DockerComposeGeneratorClient() { return <SeoOwnedBoundary><DockerComposeGeneratorForm /></SeoOwnedBoundary>; }
