/**
 * Vercel Serverless Function - jumpUrl 302 proxy
 */
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { jumpUrl = "" } = req.query;

  if (!jumpUrl) {
    res.status(400).json({ error: "Missing jumpUrl" });
    return;
  }

  let decodedUrl = "";
  try {
    decodedUrl = decodeURIComponent(jumpUrl);
  } catch (error) {
    res.status(400).json({ error: "Invalid jumpUrl encoding" });
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(decodedUrl);
  } catch (error) {
    res.status(400).json({ error: "Invalid jumpUrl" });
    return;
  }

  const pkg = parsedUrl.searchParams.get("i");
  const page = parsedUrl.searchParams.get("p") || "pages/Index";
  const extra = parsedUrl.searchParams.get("a") || "";

  if (!pkg) {
    res.status(400).json({ error: "Missing package name: i" });
    return;
  }

  const hapUrl = `hap://app/${pkg}/${page}${extra ? `?${extra}` : ""}`;
  res.redirect(302, hapUrl);
}
