import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'API Documentation',
  description:
    'Toolblip REST API documentation. Free access to developer tools, MCP server registry, and user authentication. Base URL: https://api.toolblip.com/api/v1',
};

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-3">API Documentation</h1>
        <p className="text-gray-400">
          Free REST API for developer tools and MCP server registry.
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="text-gray-500">Base URL:</span>
          <code className="bg-gray-800 text-green-400 px-3 py-1 rounded text-xs">
            https://api.toolblip.com/api/v1
          </code>
        </div>
      </header>

      {/* Auth section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="text-green-400 text-sm font-mono">01</span>
          Authentication
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          The API uses Bearer token authentication via Laravel Sanctum. Include your token in the{' '}
          <code className="text-green-400 text-xs">Authorization</code> header:
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <p className="text-xs text-gray-500 mb-2">Example request</p>
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`Authorization: Bearer tb_your_token_here`}</code>
          </pre>
        </div>

        <h3 className="text-white font-medium mb-4 text-sm">Endpoints</h3>
        <div className="space-y-4">
          <EndpointRow method="POST" path="/auth/register" auth={false} description="Create a new account" />
          <EndpointRow method="POST" path="/auth/login" auth={false} description="Sign in and receive a token" />
          <EndpointRow method="POST" path="/auth/logout" auth={true} description="Revoke the current token" />
          <EndpointRow method="GET" path="/auth/me" auth={true} description="Get the authenticated user" />
        </div>
      </section>

      {/* Tools section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="text-green-400 text-sm font-mono">02</span>
          Tools
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Public endpoints for browsing Toolblip&apos;s developer tools. No authentication required.
        </p>

        <div className="space-y-4">
          <EndpointRow method="GET" path="/tools" auth={false} description="List all tools (paginated)" />
          <EndpointRow method="GET" path="/tools/{slug}" auth={false} description="Get a single tool by slug" />
        </div>

        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h4 className="text-white text-sm font-medium mb-3">Query parameters for /tools</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs text-left border-b border-gray-800">
                <th className="pb-2 font-medium">Parameter</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-xs">
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-green-400">category</td>
                <td className="py-2">string</td>
                <td className="py-2">Filter by category</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-green-400">search</td>
                <td className="py-2">string</td>
                <td className="py-2">Search name and description</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-green-400">page</td>
                <td className="py-2">integer</td>
                <td className="py-2">Page number (default: 1)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* MCP section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="text-green-400 text-sm font-mono">03</span>
          MCP Servers
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Browse and submit MCP (Model Context Protocol) servers to the community registry.
        </p>

        <div className="space-y-4">
          <EndpointRow method="GET" path="/mcp/servers" auth={false} description="List MCP servers (paginated)" />
          <EndpointRow method="GET" path="/mcp/servers/{slug}" auth={false} description="Get a single MCP server" />
          <EndpointRow method="POST" path="/mcp/servers/submit" auth={false} description="Submit a new MCP server (5/hour limit)" />
        </div>
      </section>

      {/* API Keys section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="text-green-400 text-sm font-mono">04</span>
          API Keys
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Create and manage personal API keys for programmatic access to your account.
        </p>

        <div className="space-y-4">
          <EndpointRow method="GET" path="/keys" auth={true} description="List your API keys" />
          <EndpointRow method="POST" path="/keys" auth={true} description="Create a new API key" />
          <EndpointRow method="DELETE" path="/keys/{id}" auth={true} description="Revoke an API key" />
        </div>

        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-yellow-400 text-xs">
            <strong>Note:</strong> The full API key is only returned once at creation. Store it securely — it cannot be retrieved again.
          </p>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="text-green-400 text-sm font-mono">05</span>
          Rate Limits
        </h2>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs text-left border-b border-gray-800">
                <th className="pb-2 font-medium">Tier</th>
                <th className="pb-2 font-medium">Limit</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-xs">
              <tr className="border-b border-gray-800">
                <td className="py-2">Unauthenticated</td>
                <td className="py-2 font-mono text-green-400">60 requests / minute</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">Authenticated</td>
                <td className="py-2 font-mono text-green-400">300 requests / minute</td>
              </tr>
              <tr>
                <td className="py-2">MCP submit</td>
                <td className="py-2 font-mono text-green-400">5 requests / hour</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Error format */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="text-green-400 text-sm font-mono">06</span>
          Error Format
        </h2>

        <p className="text-gray-400 text-sm mb-4">
          All errors follow a consistent JSON structure:
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The email field is required.",
    "details": {}
  }
}`}
          </pre>
        </div>

        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h4 className="text-white text-sm font-medium mb-3">Error codes</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs text-left border-b border-gray-800">
                <th className="pb-2 font-medium">Code</th>
                <th className="pb-2 font-medium">HTTP Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-xs">
              <tr className="border-b border-gray-800"><td className="py-2 font-mono text-red-400">VALIDATION_ERROR</td><td className="py-2">422</td></tr>
              <tr className="border-b border-gray-800"><td className="py-2 font-mono text-red-400">AUTH_INVALID</td><td className="py-2">401</td></tr>
              <tr className="border-b border-gray-800"><td className="py-2 font-mono text-red-400">FORBIDDEN</td><td className="py-2">403</td></tr>
              <tr className="border-b border-gray-800"><td className="py-2 font-mono text-red-400">NOT_FOUND</td><td className="py-2">404</td></tr>
              <tr className="border-b border-gray-800"><td className="py-2 font-mono text-red-400">RATE_LIMITED</td><td className="py-2">429</td></tr>
              <tr><td className="py-2 font-mono text-red-400">SERVER_ERROR</td><td className="py-2">500</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Try it */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="text-green-400 text-sm font-mono">07</span>
          Try It
        </h2>

        <p className="text-gray-400 text-sm mb-4">
          Test the API directly from your browser:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/tools"
            className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-green-500/50 rounded-xl px-5 py-4 transition-colors"
          >
            <span className="text-white text-sm font-medium">List tools</span>
            <span className="text-green-400 text-xs font-mono">GET /tools</span>
          </a>
          <a
            href="/directory"
            className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-green-500/50 rounded-xl px-5 py-4 transition-colors"
          >
            <span className="text-white text-sm font-medium">Browse MCP servers</span>
            <span className="text-green-400 text-xs font-mono">Directory</span>
          </a>
        </div>
      </section>

      {/* Footer note */}
      <footer className="border-t border-gray-800 pt-8 text-center">
        <p className="text-gray-500 text-xs">
          Questions or issues?{' '}
          <a href="mailto:harun@toolblip.com" className="text-green-400 hover:text-green-300">
            harun@toolblip.com
          </a>
        </p>
      </footer>
    </div>
  );
}

function EndpointRow({
  method,
  path,
  auth,
  description,
}: {
  method: string;
  path: string;
  auth: boolean;
  description: string;
}) {
  const colors = {
    GET: 'bg-green-500/10 text-green-400',
    POST: 'bg-blue-500/10 text-blue-400',
    PUT: 'bg-yellow-500/10 text-yellow-400',
    PATCH: 'bg-yellow-500/10 text-yellow-400',
    DELETE: 'bg-red-500/10 text-red-400',
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
      <span className={`${colors[method as keyof typeof colors] || ''} text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0`}>
        {method}
      </span>
      <code className="text-gray-300 text-xs font-mono shrink-0">{path}</code>
      <span className="text-gray-500 text-xs flex-1">{description}</span>
      {auth ? (
        <span className="text-xs text-yellow-400 shrink-0">🔒 auth</span>
      ) : (
        <span className="text-xs text-gray-600 shrink-0">public</span>
      )}
    </div>
  );
}
