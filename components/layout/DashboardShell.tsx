"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import Sidebar, { GssLockup } from "./Sidebar";
import SearchModal from "./SearchModal";

const SearchContext = createContext<() => void>(() => undefined);
/** Opens the global search dialog from anywhere inside the shell (e.g. the overview top bar). */
export const useOpenSearch = () => useContext(SearchContext);

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const openSearch = useCallback(() => { setDrawerOpen(false); setSearchOpen(true); }, []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Ctrl/Cmd+K opens the global search from anywhere in the dashboard.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Mobile drawer behaves as a modal: focus moves in, Escape and Tab are contained, focus returns to the menu button.
  useEffect(() => {
    if (!drawerOpen) return;
    const drawer = drawerRef.current;
    const trigger = menuButtonRef.current;
    drawer?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setDrawerOpen(false); return; }
      if (event.key !== "Tab" || !drawer) return;
      const items = Array.from(drawer.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)"));
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); trigger?.focus({ preventScroll: true }); };
  }, [drawerOpen]);

  return (
    <div className="flex h-full overflow-hidden bg-canvas">
      <a href="#main" className="sr-only z-[100] rounded-md bg-white px-4 py-2 font-semibold text-brand shadow-pop focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Skip to content</a>

      <div className="hidden lg:flex">
        <Sidebar onSearch={openSearch} idPrefix="nav-desktop" />
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[rgba(15,23,43,0.45)]" onClick={closeDrawer} aria-hidden />
          <div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Navigation" className="relative h-full w-[min(272px,86vw)] shadow-pop [&>aside]:w-full">
            <Sidebar onSearch={openSearch} onNavigate={closeDrawer} onClose={closeDrawer} idPrefix="nav-mobile" />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="on-dark flex h-14 shrink-0 items-center gap-2 bg-nav px-2 pt-[env(safe-area-inset-top)] text-white lg:hidden">
          <button ref={menuButtonRef} type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation" aria-expanded={drawerOpen} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/10">
            <Menu size={22} />
          </button>
          <Link href="/" aria-label="Ghana in Numbers, overview" className="min-w-0 flex-1 rounded-lg">
            <GssLockup compact />
          </Link>
          <button type="button" onClick={openSearch} aria-label="Search indicators" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/10">
            <Search size={20} />
          </button>
        </header>

        <main id="main" tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden focus:outline-none">
          <SearchContext.Provider value={openSearch}>{children}</SearchContext.Provider>
        </main>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
