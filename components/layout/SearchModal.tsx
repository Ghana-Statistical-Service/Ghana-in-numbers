"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { querySearch, CATEGORY_COLORS, type SearchItem } from "@/lib/searchIndex";

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset and focus when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Update results as query changes
  useEffect(() => {
    setResults(querySearch(query));
    setActiveIndex(0);
  }, [query]);

  const navigate = useCallback(
    (item: SearchItem) => {
      router.push(item.href);
      onClose();
    },
    [router, onClose]
  );

  // Keyboard handling
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (results[activeIndex]) navigate(results[activeIndex]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, results, activeIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      style={{ background: "rgba(15,15,30,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search indicators, topics…"
            className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
          />
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono">⌘K</kbd>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === "" && (
            <p className="px-4 py-8 text-center text-sm text-gray-400">
              Start typing to search indicators and topics
            </p>
          )}

          {query.trim() !== "" && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-gray-400">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {results.length > 0 && (
            <ul>
              {results.map((item, i) => {
                const dotColor = CATEGORY_COLORS[item.category] ?? "#6B7280";
                const isActive = i === activeIndex;
                return (
                  <li key={item.id}>
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isActive ? "bg-gray-50" : "hover:bg-gray-50"
                      }`}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => navigate(item)}
                    >
                      {/* Category dot */}
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
                        style={{ background: dotColor }}
                      />

                      {/* Title + category */}
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-gray-800 truncate">
                          {item.title}
                        </span>
                        <span className="block text-xs text-gray-400 truncate">
                          {item.category}
                        </span>
                      </span>

                      {/* Value chip */}
                      {item.value && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: `${dotColor}18`,
                            color: dotColor,
                          }}
                        >
                          {item.value}
                        </span>
                      )}

                      {/* Arrow indicator when active */}
                      {isActive && (
                        <ArrowRight size={14} className="text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-400">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-gray-100 font-mono">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-gray-100 font-mono">↵</kbd> open
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-gray-100 font-mono">esc</kbd> close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
