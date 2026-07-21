import { createServerFn } from "@tanstack/react-start";
import { XMLParser } from "fast-xml-parser";

export type NewsCategory =
  | "top"
  | "world"
  | "business"
  | "technology"
  | "politics"
  | "science"
  | "sports"
  | "entertainment"
  | "health";

export type NewsRegion = "global" | "us" | "in" | "gb";

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  category: NewsCategory;
  summary?: string;
}

const REGION_PARAMS: Record<NewsRegion, string> = {
  global: "hl=en-US&gl=US&ceid=US:en",
  us: "hl=en-US&gl=US&ceid=US:en",
  in: "hl=en-IN&gl=IN&ceid=IN:en",
  gb: "hl=en-GB&gl=GB&ceid=GB:en",
};

const GN = (topic: string, region: NewsRegion) =>
  `https://news.google.com/rss/headlines/section/topic/${topic}?${REGION_PARAMS[region]}`;

const SEARCH = (q: string, region: NewsRegion) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&${REGION_PARAMS[region]}`;

function feedsFor(category: NewsCategory, region: NewsRegion): string[] {
  switch (category) {
    case "top":
      return [GN("WORLD", region), GN("BUSINESS", region), GN("TECHNOLOGY", region)];
    case "world":
      return [GN("WORLD", region)];
    case "business":
      return [GN("BUSINESS", region)];
    case "technology":
      return [GN("TECHNOLOGY", region)];
    case "politics":
      return [SEARCH("politics", region)];
    case "science":
      return [GN("SCIENCE", region)];
    case "sports":
      return [GN("SPORTS", region)];
    case "entertainment":
      return [GN("ENTERTAINMENT", region)];
    case "health":
      return [GN("HEALTH", region)];
  }
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFeed(url: string, category: NewsCategory): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 OPOAD-NewsBot/1.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const data = parser.parse(xml);
    const items = data?.rss?.channel?.item ?? [];
    const arr = Array.isArray(items) ? items : [items];
    return arr.filter(Boolean).map((it: Record<string, unknown>, idx: number): NewsItem => {
      const rawTitle = (it.title as string) ?? "";
      const title = stripHtml(String(rawTitle));
      const link = String(it.link ?? "");
      const pub = String(it.pubDate ?? new Date().toISOString());
      const src = it.source as { "#text"?: string } | string | undefined;
      const source = typeof src === "string" ? src : (src?.["#text"] ?? "Google News");
      const desc = stripHtml(String(it.description ?? ""));
      return {
        id: `${category}-${idx}-${link.slice(-40)}`,
        title,
        link,
        source,
        publishedAt: new Date(pub).toISOString(),
        category,
        summary: desc.slice(0, 220),
      };
    });
  } catch {
    return [];
  }
}

export const getNews = createServerFn({ method: "GET" })
  .inputValidator((data: { category?: NewsCategory; region?: NewsRegion } | undefined) => ({
    category: (data?.category ?? "top") as NewsCategory,
    region: (data?.region ?? "global") as NewsRegion,
  }))
  .handler(async ({ data }) => {
    const urls = feedsFor(data.category, data.region);
    const batches = await Promise.all(urls.map((u) => fetchFeed(u, data.category)));
    const merged = batches.flat();
    const seen = new Set<string>();
    const unique = merged.filter((n) => {
      const key = n.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    unique.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    return {
      category: data.category,
      region: data.region,
      count: unique.length,
      fetchedAt: new Date().toISOString(),
      items: unique.slice(0, 40),
    };
  });
