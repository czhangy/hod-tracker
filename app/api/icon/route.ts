const ALLOWED_HOSTS = new Set([
  "static.wikia.nocookie.net",
  "www.castlevaniacrypt.com",
  "castlevaniacrypt.com",
]);

const REFERERS: Record<string, string> = {
  "static.wikia.nocookie.net": "https://castlevania.fandom.com/",
  "www.castlevaniacrypt.com": "https://www.castlevaniacrypt.com/",
  "castlevaniacrypt.com": "https://www.castlevaniacrypt.com/",
};

/**
 * Proxies item icons and character portraits from the Castlevania Wiki and Castlevania Crypt.
 * The wiki's CDN blocks direct <img> hotlinking (checks Referer/Sec-Fetch-Site), so this
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

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return new Response("Host not allowed", { status: 400 });
  }

  const upstream = await fetch(parsed.toString(), {
    headers: {
      Referer: REFERERS[parsed.hostname],
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
