
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function clampMuseText(input: string) {
  const s = String(input ?? "");
  return s.length > 250 ? s.slice(0, 250) : s;
}

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
      widgetCount,
      loyaltyPoints,
      pageType,
      pageLocation,
    } = body as any;

    if (!prompt || !String(prompt).trim()) {
      return NextResponse.json({ error: { message: "Missing prompt", type: "badRequest" } }, { status: 400 });
    }

    const apiKey = String(apiKeyOverride || process.env.DY_API_KEY || "").trim();
    if (!apiKey) {
      return NextResponse.json({ error: { message: "Missing DY_API_KEY", type: "badRequest" } }, { status: 400 });
    }

    const baseUrl = String(apiBaseUrl || process.env.DY_API_BASE_URL || "https://dy-api.com").trim();

    // Muse v3 endpoint
    const endpoint = `${baseUrl.replace(/\/$/, "")}/v2/serve/user/agent-assistant`;

    let selector: any;
    try {
      selector = selectorJson ? JSON.parse(selectorJson) : { name: "Shopping Muse" };
    } catch {
      return NextResponse.json({ error: { message: "selectorJson must be valid JSON", type: "badRequest" } }, { status: 400 });
    }

    // Read existing DY cookies if available
    const dyid = req.cookies.get("_dyid")?.value;
    const dyidServer = req.cookies.get("_dyid_server")?.value;
    const dySession = req.cookies.get("_dyjsession")?.value;

    const user: any = {
      active_consent_accepted: true,
      ...(dyid ? { dyid } : {}),
      ...(dyidServer ? { dyid_server: dyidServer } : {}),
    };

    const session: any = {
      ...(dySession ? { dy: dySession } : {}),
    };

    // Put app-specific metadata into pageAttributes (keeps query.text shorter)
    const pageAttributes: any = {
      ...(typeof widgetCount === "number" ? { widgets_to_display: widgetCount } : {}),
      ...(typeof loyaltyPoints === "number" ? { loyalty_points: loyaltyPoints } : {}),
    };

    const requestPayload: any = {
      user,
      session,
      query: {
        text: clampMuseText(prompt),
        ...(chatId ? { chatId } : {}),
      },
      context: {
        page: {
          type: String(pageType || "HOMEPAGE"),
          data: [],
          location: String(pageLocation || "https://geunui.vercel.app"),
          locale: language === "es" ? "es_ES" : "en_GB",
        },
        ...(Object.keys(pageAttributes).length ? { pageAttributes } : {}),
      },
      selector,
      options: {
        returnAnalyticsMetadata: false,
        isImplicitClientData: false,
        isImplicitKeywordSearchEvent: false,
      },
    };

    // Debug logs
    console.log("=== MUSE V3 ENDPOINT ===", endpoint);
    console.log("=== MUSE V3 REQUEST PAYLOAD ===");
    console.log(JSON.stringify(requestPayload, null, 2));
    console.log("=== END PAYLOAD ===");

    const incomingCookie = req.headers.get("cookie") || "";

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

    // If DY returns cookies[] in response body, set them for continuity
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
    return NextResponse.json({ error: { message: e?.message || "Unexpected error", type: "serverError" } }, { status: 500 });
  }
}
