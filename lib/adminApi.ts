export async function parseLaravelJsonResponse(
  response: Response,
  fallbackMessage: string,
): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      // Fall through to text handling below.
    }
  }

  const text = await response.text().catch(() => "");
  if (text.trim()) {
    return { message: text };
  }

  return { message: response.statusText || fallbackMessage };
}
