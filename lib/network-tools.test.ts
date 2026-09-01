import { describe, expect, it } from "vitest";
import yaml from "js-yaml";
import {
  calculateCidr,
  calculateIpRange,
  filterDnsAnswers,
  generateDockerComposeYaml,
  isComposeClearable,
  normalizeHostname,
  validateDnsQuery,
  parseIPv4,
  quoteYaml,
  validateComposeOptions,
  validatePort,
  validateServiceName,
} from "@/lib/network-tools";

describe("network tool helpers", () => {
  it("normalizes strict hostnames and rejects URL-like or malformed input", () => {
    expect(normalizeHostname("  Example.COM.  ")).toBe("example.com");
    expect(normalizeHostname("https://example.com")).toBeNull();
    expect(normalizeHostname("example.com/path")).toBeNull();
    expect(normalizeHostname("example.com:443")).toBeNull();
    expect(normalizeHostname("exam ple.com")).toBeNull();
    expect(normalizeHostname("example..com")).toBeNull();
    expect(normalizeHostname("-example.com")).toBeNull();
    expect(normalizeHostname("example-.com")).toBeNull();
    expect(normalizeHostname("exam_ple.com")).toBeNull();
    expect(normalizeHostname(`${"a".repeat(64)}.com`)).toBeNull();
    expect(normalizeHostname(`${"a.".repeat(127)}a`)).toBeNull();
  });

  it("filters DNS answers by the requested numeric record type", () => {
    const answers = [
      { type: 1, data: "192.0.2.1", TTL: 300 },
      { type: 5, data: "alias.example.com.", TTL: 120 },
      { type: 28, data: "2001:db8::1", TTL: 60 },
    ];
    expect(filterDnsAnswers("A", answers)).toEqual([answers[0]]);
    expect(filterDnsAnswers("AAAA", answers)).toEqual([answers[2]]);
    expect(filterDnsAnswers("CNAME", answers)).toEqual([answers[1]]);
    expect(filterDnsAnswers("MX", answers)).toEqual([]);
  });

  it("validates DNS query parameters and returns normalized input", () => {
    expect(validateDnsQuery("  Example.COM.  ", "AAAA")).toEqual({
      name: "example.com",
      type: "AAAA",
    });
    expect(validateDnsQuery(null, "A")).toBeNull();
    expect(validateDnsQuery("example.com", "a")).toBeNull();
    expect(validateDnsQuery("example.com/path", "TXT")).toBeNull();
  });

  it("strictly parses IPv4 and rejects malformed octets", () => {
    expect(parseIPv4("192.168.1.1")).toBe(3232235777);
    expect(parseIPv4("1..2.3")).toBeNull();
    expect(parseIPv4("1.2.3.4x")).toBeNull();
    expect(parseIPv4("01.2.3.4")).toBeNull();
    expect(parseIPv4("1.2.3.")).toBeNull();
    expect(parseIPv4("1.2.3.4e2")).toBeNull();
    expect(parseIPv4("1.2.3.4.5")).toBeNull();
  });

  it("calculates CIDR boundaries and special host counts", () => {
    expect(calculateCidr("192.168.1.9/24")).toMatchObject({
      network: "192.168.1.0",
      broadcast: "192.168.1.255",
      totalAddresses: 256,
      usableHosts: 254,
    });
    expect(calculateCidr("10.0.0.0/31")).toMatchObject({
      totalAddresses: 2,
      usableHosts: 2,
      firstHost: "10.0.0.0",
      lastHost: "10.0.0.1",
    });
    expect(calculateCidr("10.0.0.1/32")).toMatchObject({
      totalAddresses: 1,
      usableHosts: 1,
      firstHost: "10.0.0.1",
      lastHost: "10.0.0.1",
    });
    expect(calculateCidr("10.0.0.1/24x")).toBeNull();
    expect(calculateCidr("10.0.0.1/024")).toBeNull();
  });

  it("calculates an inclusive range and its smallest enclosing CIDR", () => {
    expect(calculateIpRange("192.168.1.10", "192.168.1.20")).toMatchObject({
      count: 11,
      network: "192.168.1.0",
      broadcast: "192.168.1.31",
      prefix: 27,
    });
    expect(calculateIpRange("10.0.0.20", "10.0.0.10")).toBeNull();
    expect(calculateIpRange("10.0.0.1", "192.168.1.1")).toMatchObject({
      count: 3064463617,
      network: "0.0.0.0",
      broadcast: "255.255.255.255",
      netmask: "0.0.0.0",
      prefix: 0,
    });
    expect(calculateIpRange("0.0.0.0", "255.255.255.255")).toMatchObject({
      count: 4294967296,
      network: "0.0.0.0",
      broadcast: "255.255.255.255",
      prefix: 0,
    });
    expect(calculateIpRange("1.2.3", "1.2.3.4")).toBeNull();
    expect(calculateIpRange("1.2.3.04", "1.2.3.5")).toBeNull();
  });

  it("validates compose identifiers and quotes YAML scalars", () => {
    expect(validateServiceName("api_1")).toBe(true);
    expect(validateServiceName("api: bad")).toBe(false);
    expect(validatePort("3000")).toBe(true);
    expect(validatePort("70000")).toBe(false);
    expect(quoteYaml("pa:ss\nword")).toBe('"pa:ss\\nword"');
  });

  it("builds parseable YAML for every compose template without cross-template replacements", () => {
    const options = {
      serviceName: "api",
      hostPort: "3000",
      appPort: "3000",
      dbName: "app#db",
      dbUser: "app:user",
      dbPassword: "p@ss:word#1",
    };
    for (const template of [
      "full-stack",
      "node-postgres",
      "node-mysql",
      "node-redis",
      "wordpress-mysql",
      "nginx-static",
    ] as const) {
      const document = yaml.load(
        generateDockerComposeYaml(template, options),
      ) as { services: Record<string, unknown> };
      expect(document.services).toBeTruthy();
    }
    const mysql = generateDockerComposeYaml("node-mysql", options);
    expect(mysql).toContain(
      "mysql://app%3Auser:p%40ss%3Aword%231@db:3306/app%23db",
    );
    expect(mysql).toContain('MYSQL_ROOT_PASSWORD="p@ss:word#1"');
  });

  it("validates only fields used by the selected compose template", () => {
    expect(
      validateComposeOptions("nginx-static", {
        serviceName: "",
        hostPort: "8080",
        appPort: "",
      }),
    ).toEqual([]);
    expect(
      validateComposeOptions("node-postgres", {
        serviceName: "",
        hostPort: "8080",
        appPort: "3000",
        dbName: "",
        dbUser: "",
        dbPassword: "",
      }),
    ).not.toEqual([]);
  });

  it("does not count the default compose template as clearable", () => {
    const empty = {
      template: "full-stack" as const,
      serviceName: "",
      hostPort: "",
      appPort: "",
      dbName: "",
      dbUser: "",
      dbPassword: "",
    };
    expect(isComposeClearable(empty, false)).toBe(false);
    expect(isComposeClearable({ ...empty, template: "node-redis" }, false)).toBe(
      true,
    );
    expect(isComposeClearable(empty, true)).toBe(true);
  });
});
