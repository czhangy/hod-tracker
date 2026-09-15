const ALLOWED_HOST = "static.wikia.nocookie.net";

/**
 * Proxies item icon images from the Castlevania Wiki's CDN.
 * The CDN blocks direct <img> hotlinking (checks Referer/Sec-Fetch-Site), so this
 * fetches server-side with a same-site referer and streams the image back from our
 * own origin instead.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");

  if (!target) {
    return new Response("Missing url", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return new Response("Host not allowed", { status: 400 });
  }

  const upstream = await fetch(parsed.toString(), {
    headers: {
      Referer: "https://castlevania.fandom.com/",
      "User-Agent": "hod-tracker (https://github.com/czhangy/hod-tracker)",
    },
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream error", { status: upstream.status || 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/png",
      "Cache-Control": "public, max-age=2592000, immutable",
    },
  });
}
