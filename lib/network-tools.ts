export type CidrResult = {
  network: string;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  totalAddresses: number;
  usableHosts: number;
  subnetMask: string;
  wildcard: string;
  prefix: number;
};

export type RangeResult = {
  startIp: string;
  endIp: string;
  count: number;
  network: string;
  broadcast: string;
  netmask: string;
  prefix: number;
  firstIp: string;
  lastIp: string;
};

export type ComposeTemplate =
  | "full-stack"
  | "node-postgres"
  | "node-mysql"
  | "node-redis"
  | "wordpress-mysql"
  | "nginx-static";

export type ComposeOptions = {
  serviceName: string;
  hostPort: string;
  appPort: string;
  dbName?: string;
  dbUser?: string;
  dbPassword?: string;
};

export type DnsRecordType = "A" | "AAAA" | "MX" | "TXT" | "CNAME";

export type DnsAnswer = {
  type: number;
  data: string;
  TTL: number;
};

const DNS_TYPE_CODES: Record<DnsRecordType, number> = {
  A: 1,
  AAAA: 28,
  MX: 15,
  TXT: 16,
  CNAME: 5,
};

export function normalizeHostname(value: string): string | null {
  const input = value.trim();
  const hostname = input.endsWith(".") ? input.slice(0, -1) : input;
  if (!hostname || hostname.length > 253 || /[\s/:]/.test(hostname)) return null;

  const labels = hostname.split(".");
  if (
    labels.some(
      (label) =>
        !label ||
        label.length > 63 ||
        label.startsWith("-") ||
        label.endsWith("-") ||
        !/^[a-z0-9-]+$/i.test(label),
    )
  )
    return null;

  return hostname.toLowerCase();
}

export function filterDnsAnswers(
  type: DnsRecordType,
  answers: DnsAnswer[] | undefined,
): DnsAnswer[] {
  return (answers ?? []).filter((answer) => answer.type === DNS_TYPE_CODES[type]);
}

export function isComposeClearable(
  state: ComposeOptions & { template: ComposeTemplate },
  copied: boolean,
): boolean {
  return (
    copied ||
    state.template !== "full-stack" ||
    Boolean(
      state.serviceName ||
        state.hostPort ||
        state.appPort ||
        state.dbName ||
        state.dbUser ||
        state.dbPassword,
    )
  );
}

export function parseIPv4(value: string): number | null {
  const parts = value.trim().split(".");
  if (
    parts.length !== 4 ||
    parts.some(
      (part) =>
        !/^\d{1,3}$/.test(part) || (part.length > 1 && part.startsWith("0")),
    )
  )
    return null;
  const octets = parts.map(Number);
  if (octets.some((octet) => octet > 255)) return null;
  return (
    (((octets[0] * 256 + octets[1]) * 256 + octets[2]) * 256 + octets[3]) >>> 0
  );
}

export function formatIPv4(value: number): string {
  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ].join(".");
}

function maskForPrefix(prefix: number): number {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

export function calculateCidr(value: string): CidrResult | null {
  const match = value.trim().match(/^([^/]+)\/(\d{1,2})$/);
  if (!match) return null;
  const ip = parseIPv4(match[1]);
  const prefix = Number(match[2]);
  if (ip === null || prefix > 32 || String(prefix) !== match[2]) return null;

  const mask = maskForPrefix(prefix);
  const network = (ip & mask) >>> 0;
  const wildcard = ~mask >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);
  const usableHosts =
    prefix === 31 ? 2 : prefix === 32 ? 1 : Math.max(0, totalAddresses - 2);

  return {
    network: formatIPv4(network),
    firstHost: formatIPv4(
      prefix === 32 || prefix === 31 ? network : (network + 1) >>> 0,
    ),
    lastHost: formatIPv4(
      prefix === 32
        ? network
        : prefix === 31
          ? broadcast
          : (broadcast - 1) >>> 0,
    ),
    broadcast: formatIPv4(broadcast),
    totalAddresses,
    usableHosts,
    subnetMask: formatIPv4(mask),
    wildcard: formatIPv4(wildcard),
    prefix,
  };
}

export function calculateIpRange(
  startValue: string,
  endValue: string,
): RangeResult | null {
  const start = parseIPv4(startValue);
  const end = parseIPv4(endValue);
  if (start === null || end === null || end < start) return null;

  const xor = (start ^ end) >>> 0;
  const prefix = xor === 0 ? 32 : Math.clz32(xor);
  const mask = maskForPrefix(prefix);
  const network = (start & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;

  return {
    startIp: formatIPv4(start),
    endIp: formatIPv4(end),
    count: end - start + 1,
    network: formatIPv4(network),
    broadcast: formatIPv4(broadcast),
    netmask: formatIPv4(mask),
    prefix,
    firstIp: formatIPv4(start),
    lastIp: formatIPv4(end),
  };
}

export function validatePort(value: string): boolean {
  return /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 65535;
}

export function validateServiceName(value: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,62}$/.test(value);
}

export function quoteYaml(value: string): string {
  return JSON.stringify(
    value.replace(/[\u0000-\u001f\u007f]/g, (character) =>
      character === "\n" ? character : "",
    ),
  );
}

export function encodeDatabaseCredential(value: string): string {
  return encodeURIComponent(value);
}

function needsDatabase(template: ComposeTemplate): boolean {
  return (
    template === "full-stack" ||
    template === "node-postgres" ||
    template === "node-mysql" ||
    template === "wordpress-mysql"
  );
}

function needsAppPort(template: ComposeTemplate): boolean {
  return (
    template === "full-stack" ||
    template === "node-postgres" ||
    template === "node-mysql" ||
    template === "node-redis"
  );
}

export function validateComposeOptions(
  template: ComposeTemplate,
  options: ComposeOptions,
): string[] {
  const errors: string[] = [];
  if (
    template !== "wordpress-mysql" &&
    template !== "nginx-static" &&
    !validateServiceName(options.serviceName)
  )
    errors.push("Enter a valid service name.");
  if (!validatePort(options.hostPort))
    errors.push("Enter a host port from 1 to 65535.");
  if (needsAppPort(template) && !validatePort(options.appPort))
    errors.push("Enter a container port from 1 to 65535.");
  if (needsDatabase(template) && !options.dbName?.trim())
    errors.push("Enter a database name.");
  if (needsDatabase(template) && !options.dbUser?.trim())
    errors.push("Enter a database user.");
  if (needsDatabase(template) && !options.dbPassword?.trim())
    errors.push("Enter a database password.");
  return errors;
}

function databaseEnvironment(options: ComposeOptions, mysql: boolean): string {
  const lines = mysql
    ? [
        `      - MYSQL_DATABASE=${quoteYaml(options.dbName ?? "")}`,
        `      - MYSQL_USER=${quoteYaml(options.dbUser ?? "")}`,
        `      - MYSQL_PASSWORD=${quoteYaml(options.dbPassword ?? "")}`,
        `      - MYSQL_ROOT_PASSWORD=${quoteYaml(options.dbPassword ?? "")}`,
      ]
    : [
        `      - POSTGRES_USER=${quoteYaml(options.dbUser ?? "")}`,
        `      - POSTGRES_PASSWORD=${quoteYaml(options.dbPassword ?? "")}`,
        `      - POSTGRES_DB=${quoteYaml(options.dbName ?? "")}`,
      ];
  return `    environment:\n${lines.join("\n")}\n`;
}

export function generateDockerComposeYaml(
  template: ComposeTemplate,
  options: ComposeOptions,
): string {
  const appName = quoteYaml(options.serviceName);
  const ports = `      - ${quoteYaml(`${options.hostPort}:${options.appPort}`)}\n`;
  const databaseUrl = (scheme: "postgres" | "mysql", port: number) =>
    `${scheme}://${encodeDatabaseCredential(options.dbUser ?? "")}:${encodeDatabaseCredential(options.dbPassword ?? "")}@db:${port}/${encodeDatabaseCredential(options.dbName ?? "")}`;

  switch (template) {
    case "full-stack":
      return `version: '3.8'\nservices:\n  ${appName}:\n    build: .\n    ports:\n${ports}    environment:\n      - DATABASE_URL=${quoteYaml(databaseUrl("postgres", 5432))}\n    depends_on:\n      - db\n      - cache\n  db:\n    image: postgres:16\n${databaseEnvironment(options, false)}    volumes:\n      - db_data:/var/lib/postgresql/data\n  cache:\n    image: redis:7-alpine\n    volumes:\n      - redis_data:/data\nvolumes:\n  db_data:\n  redis_data:\n`;
    case "node-postgres":
      return `version: '3.8'\nservices:\n  ${appName}:\n    build: .\n    ports:\n${ports}    environment:\n      - DATABASE_URL=${quoteYaml(databaseUrl("postgres", 5432))}\n    depends_on:\n      - db\n  db:\n    image: postgres:16\n${databaseEnvironment(options, false)}    volumes:\n      - db_data:/var/lib/postgresql/data\nvolumes:\n  db_data:\n`;
    case "node-mysql":
      return `version: '3.8'\nservices:\n  ${appName}:\n    build: .\n    ports:\n${ports}    environment:\n      - DATABASE_URL=${quoteYaml(databaseUrl("mysql", 3306))}\n    depends_on:\n      - db\n  db:\n    image: mysql:8\n${databaseEnvironment(options, true)}    volumes:\n      - db_data:/var/lib/mysql\nvolumes:\n  db_data:\n`;
    case "node-redis":
      return `version: '3.8'\nservices:\n  ${appName}:\n    build: .\n    ports:\n${ports}    environment:\n      - REDIS_URL=redis://cache:6379\n    depends_on:\n      - cache\n  cache:\n    image: redis:7-alpine\n    volumes:\n      - redis_data:/data\nvolumes:\n  redis_data:\n`;
    case "wordpress-mysql":
      return `version: '3.8'\nservices:\n  wordpress:\n    image: wordpress:latest\n    ports:\n      - ${quoteYaml(`${options.hostPort}:80`)}\n    environment:\n      - WORDPRESS_DB_HOST=db\n      - WORDPRESS_DB_USER=${quoteYaml(options.dbUser ?? "")}\n      - WORDPRESS_DB_PASSWORD=${quoteYaml(options.dbPassword ?? "")}\n      - WORDPRESS_DB_NAME=${quoteYaml(options.dbName ?? "")}\n    volumes:\n      - wp_content:/var/www/html\n    depends_on:\n      - db\n  db:\n    image: mysql:8\n${databaseEnvironment(options, true)}    volumes:\n      - db_data:/var/lib/mysql\nvolumes:\n  wp_content:\n  db_data:\n`;
    case "nginx-static":
      return `version: '3.8'\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - ${quoteYaml(`${options.hostPort}:80`)}\n    volumes:\n      - ./html:/usr/share/nginx/html:ro\n`;
  }
}
