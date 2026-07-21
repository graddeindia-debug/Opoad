import { useEffect, useState, useCallback } from "react";
import type { NewsItem } from "@/lib/news.functions";

const KEY = "opoad.bookmarks.v1";

function read(): NewsItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as NewsItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: NewsItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("opoad:bookmarks"));
  } catch {
    /* ignore */
  }
}

export function useBookmarks() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener("opoad:bookmarks", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("opoad:bookmarks", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isSaved = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback((item: NewsItem) => {
    const cur = read();
    const next = cur.some((i) => i.id === item.id)
      ? cur.filter((i) => i.id !== item.id)
      : [item, ...cur].slice(0, 100);
    write(next);
  }, []);

  const clear = useCallback(() => write([]), []);

  return { items, isSaved, toggle, clear };
}
