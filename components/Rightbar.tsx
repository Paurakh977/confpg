"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function RightBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [trending, setTrending] = useState<
    { id: string; text: string; department: string; views: number }[]
  >([]);

  // Update search query in URL (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }
      router.push(`/?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  // Fetch trending confessions (last 24h)
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("/api/trending");
        const data = await res.json();
        setTrending(data);
      } catch (err) {
        console.error("Failed to fetch trending confessions:", err);
      }
    };
    fetchTrending();
  }, []);

  return (
    <aside className="w-80 min-h-screen p-4 flex flex-col">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 rounded-2xl bg-black border border-white/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Trending */}
      <div>
        <h2 className="text-lg font-semibold mb-2"># Trending In KU</h2>
        {trending.length > 0 ? (
          <ul className="space-y-2">
            {trending.map((post) => (
              <li key={post.id}>
                <button
                  onClick={() =>
                    setQuery(post.text.slice(0, 20)) // search by snippet
                  }
                  className="block w-full text-left px-3 py-2 rounded hover:bg-gray-800 transition"
                >
                  <p className="text-sm text-gray-200 line-clamp-2">
                    {post.text}
                  </p>
                  <p className="text-xs text-gray-500">
                    {post.department} • {post.views} views
                  </p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No tea for now.</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto text-xs text-gray-400">
        © 2025 Kathmandu University
      </div>
    </aside>
  );
}
