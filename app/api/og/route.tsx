import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

async function loadGoogleFont(text: string, weight: 400 | 700) {
  const url = `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error(`Failed to load Inter font (weight ${weight})`);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") ?? "Toolblip";
  const category = searchParams.get("category") ?? "Developer Tools";
  const date = searchParams.get("date") ?? "";

  const fontText = `Toolblip${title}${category}${date}toolblip.com`;

  const [interRegular, interBold] = await Promise.all([
    loadGoogleFont(fontText, 400),
    loadGoogleFont(fontText, 700),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          fontFamily: "Inter",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex" }}>
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#d93030",
              letterSpacing: "-0.02em",
            }}
          >
            Toolblip
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: "28px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px 22px",
              borderRadius: "999px",
              border: "2px solid #d93030",
              color: "#d93030",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            {category}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.25,
              maxWidth: "980px",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.6)" }}>
            {date}
          </span>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)" }}>
            toolblip.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
      ],
    }
  );
}
