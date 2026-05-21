import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper: keep Muse text within 250 chars as documented
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
      selectorJson,
      chatId,
      // optional overrides if you still want them
      apiKeyOverride,
    } = body as {
      prompt: string;
      language: "en" | "es";
      selectorJson?: string;
      chatId?: string;
      apiKeyOverride?: string;
    };

    const apiKey = String(apiKeyOverride || process.env.DY_API_KEY || "").trim();
    if (!apiKey) {
      return NextResponse.json({ error: "Missing DY_API_KEY" }, { status: 400 });
    }

    // ✅ Muse v3 endpoint (agent-assistant) per internal DY guidance
    const endpoint = "https://dy-api.com/v2/serve/user/agent-assistant"; // [3](https://outlook.office365.com/owa/?ItemID=AAMkAGYyNWZlYzRiLTZkMDUtNGM2MC1iZWRlLTQwOWM4MzIyZDAxZQBGAAAAAADx5b8W%2b2tNRKT%2bk%2bLc%2bVkmBwB5XjCWIIpPSL2T%2bqWq01%2fVAAAAAAEMAAB5XjCWIIpPSL2T%2bqWq01%2fVAARIbxpbAAA%3d&exvsurl=1&viewmodel=ReadMessageItem)[4](https://mastercard.sharepoint.com/sites/DynamicYield-All/_layouts/15/Doc.aspx?sourcedoc=%7B4B09C0BE-09D3-4328-BCAF-A58DB50A3F2D%7D&file=Shopping%20Muse%20V3%20Summary%20for%20CS.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

    // Selector is required; allow it from settings if provided, otherwise default
    let selector: any = { name: "Shopping Muse" };
    if (selectorJson) {
      try {
        selector = JSON.parse(selectorJson);
      } catch {
        return NextResponse.json({ error: "selectorJson must be valid JSON" }, { status: 400 });
      }
    }

    // ✅ Read existing DY cookies (first-party) for reuse across requests
    // Cookie names are referenced in DY docs for script+API usage. [6](https://dy.dev/docs/using-experience-apis-and-script-together)
    const dyid = req.cookies.get("_dyid")?.value;
    const dyidServer = req.cookies.get("_dyid_server")?.value;
    const dySession = req.cookies.get("_dyjsession")?.value;

    // Build user/session objects:
    // - If IDs exist, include them.
    // - If not, omit them to allow bootstrap (DY can return cookies). [2](https://dy.dev/reference/shoppingmuse)
    const user: any = {
      active_consent_accepted: true,
      ...(dyid ? { dyid } : {}),
      ...(dyidServer ? { dyid_server: dyidServer } : {}),
    };

    const session: any = {
      ...(dySession ? { dy: dySession } : {}),
    };

    const requestPayload: any = {
      user,
      session,
      query: {
        text: clampMuseText(prompt),
        ...(chatId ? { chatId } : {}), // omit on first call; include subsequently [5](https://dy.dev/docs/muse)[1](https://dy.dev/docs/muse-samples)
      },
      context: {
        page: {
          type: "HOMEPAGE",
          // sample shows page.type required; you can keep location/locale too [1](https://dy.dev/docs/muse-samples)
          location: "https://geunui.vercel.app",
          locale: language === "es" ? "es_ES" : "en_GB",
        },
      },
      selector,
      options: {
        // User-required options (not from public docs in our citations, but fine to include)
        returnAnalyticsMetadata: false,
        isImplicitClientData: false,
        isImplicitKeywordSearchEvent: false,
      },
    };

    // ✅ Debug: print payload being sent
    console.log("=== MUSE V3 REQUEST ENDPOINT ===", endpoint);
    console.log("=== MUSE V3 REQUEST PAYLOAD ===");
    console.log(JSON.stringify(requestPayload, null, 2));
    console.log("=== END PAYLOAD ===");

    const museRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "dy-api-key": apiKey,
        // forward cookies if present (helps continuity)
        ...(req.headers.get("cookie") ? { cookie: req.headers.get("cookie")! } : {}),
      } as any,
      body: JSON.stringify(requestPayload),
    });

    const museJson = await museRes.json();

    // Return response to client
    const resp = NextResponse.json(museJson, { status: museRes.status });

    // ✅ If DY returns cookies[] in response body, set them (bootstrap & continuity) [2](https://dy.dev/reference/shoppingmuse)
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
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
