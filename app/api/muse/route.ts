
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      prompt,
      language,
      geo,
      apiBaseUrl,
      selectorJson,
      apiKeyOverride,
      chatId,
    } = body as {
      prompt: string;
      language: "en" | "es";
      widgetCount?: number;
      geo?: { lat: number; lng: number };
      apiBaseUrl?: string;
      selectorJson?: string;
      apiKeyOverride?: string;
      chatId?: string;
    };

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Server-only key by default; override allowed for dev
    const apiKey = (apiKeyOverride || process.env.DY_API_KEY || "").trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing DY API key (set DY_API_KEY env var)" },
        { status: 400 }
      );
    }

    const baseUrl = (
      apiBaseUrl ||
      process.env.DY_API_BASE_URL ||
      "https://dy-api.com"
    ).trim();
    const endpoint = `${baseUrl.replace(/\/$/, "")}/v2/serve/user/assistant`;

    // selector is required
    let selector: any;
    try {
      selector = selectorJson ? JSON.parse(selectorJson) : null;
    } catch {
      return NextResponse.json(
        { error: "selectorJson must be valid JSON" },
        { status: 400 }
      );
    }
    if (!selector) {
      return NextResponse.json(
        { error: "selectorJson is required" },
        { status: 400 }
      );
    }

    // Forward incoming cookies to DY so IDs/session continuity can work
    const incomingCookie = req.headers.get("cookie") || "";

    const requestPayload: any = {
      user: {
        active_consent_accepted: true,
      },
      session: {},
      query: {
        text: String(prompt).slice(0, 250),
        ...(chatId ? { chatId } : {}),
      },
      context: {
        page: {
          type: "HOMEPAGE",
          location: "https://mcd-muse.local/",
          locale: language === "es" ? "es_ES" : "en_GB",
        },
        ...(geo ? { geo } : {}),
      },
      selector,
      options: {},
    };

    const museRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "dy-api-key": apiKey,
        ...(incomingCookie ? { cookie: incomingCookie } : {}),
      } as any,
      body: JSON.stringify(requestPayload),
    });

    const museJson = await museRes.json();

    const resp = NextResponse.json(museJson, { status: museRes.status });

    // If DY returns cookies in the response body, set them
    const cookies = museJson?.cookies;
    if (Array.isArray(cookies)) {
      for (const c of cookies) {
        if (c?.name && typeof c?.value === "string") {
          const maxAge = parseInt(String(c.maxAge ?? ""), 10);
          resp.cookies.set({
            name: c.name,
            value: c.value,
            maxAge: Number.isFinite(maxAge) ? maxAge : undefined,
            path: "/",
          });
        }
      }
    }

    return resp;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
