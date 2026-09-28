// Trust only the ephemeral candidate certificate, never unrelated HTTPS hosts.
export function candidateChromeArgs() {
  const hash = process.env.QA_ORIGIN_SPKI;
  if (!hash) return [];
  if (process.env.GITHUB_ACTIONS !== 'true' || process.env.RUNNER_ENVIRONMENT !== 'github-hosted' ||
      !/^[A-Za-z0-9+/]{43}=$/.test(hash)) throw Error('Invalid hosted candidate certificate hash');
  return [`--ignore-certificate-errors-spki-list=${hash}`];
}
