"use client";

import { useState, useEffect, useRef, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import Link from "next/link";
import RecruiterToggle from "./RecruiterToggle";
import AdminPanel from "./AdminPanel";
import { useContent } from "@/lib/content-context";
import { NAV_LINKS, PERSONAL_NAV_LINKS } from "@/lib/constants";
import { useRecruiter } from "@/lib/recruiter-context";
import { cn } from "@/lib/utils";

/* ── Smooth eased scroll (easeInOutCubic) ──────────────────────────────── */
/* ── Doodle circle: red ink, loops forever, endpoint overshoots start ── */
const DoodleCircle = memo(function DoodleCircle() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const len = path.getTotalLength();

    // 4-phase cycle totalling exactly 5 seconds:
    // 1. Draw in  (stroke tip travels from start → end)  : 1.5s
    // 2. Hold fully drawn                                 : 0.5s
    // 3. Draw out (tip retraces back end → start)         : 1.5s
    // 4. Pause (invisible)                                : 1.5s
    const DRAW_IN  = 1500;
    const HOLD     = 500;
    const DRAW_OUT = 1500;
    const PAUSE    = 5000;
    const CYCLE    = DRAW_IN + HOLD + DRAW_OUT + PAUSE; // 8500 ms

    let rafId: number;
    let startTs: number | null = null;

    const ease = (p: number) =>
      p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = (ts - startTs) % CYCLE;

      if (t < DRAW_IN) {
        // Phase 1 — draw in: dashoffset len → 0, dasharray fixed at len
        const e = ease(t / DRAW_IN);
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len * (1 - e));

      } else if (t < DRAW_IN + HOLD) {
        // Phase 2 — hold: fully visible
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = "0";

      } else if (t < DRAW_IN + HOLD + DRAW_OUT) {
        // Phase 3 — draw out: shrink dasharray len → 0 (erases from the tip back)
        const e = ease((t - DRAW_IN - HOLD) / DRAW_OUT);
        path.style.strokeDasharray = String(len * (1 - e));
        path.style.strokeDashoffset = "0";

      } else {
        // Phase 4 — pause: fully hidden, ready for next cycle
        path.style.strokeDasharray = "0";
        path.style.strokeDashoffset = "0";
      }

      rafId = requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => {
      rafId = requestAnimationFrame(tick);
    }, 800);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <svg
      className="pointer-events-none absolute"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 300,
        height: 58,
        overflow: "visible",
        zIndex: 10,
      }}
      viewBox="0 0 158 54"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      {/*
        Wobbly ellipse — uneven bezier handles so it's not a perfect oval.
        The tail overshoots past the start and curls slightly inward,
        just like a real pen stroke that goes a bit too far.
      */}
      <path
        ref={pathRef}
        d="M 26,12 C 44,-7 120,-2 138,14 C 152,26 148,44 128,50 C 104,58 34,57 15,43 C 0,32 5,15 26,12 C 28,11 31,9 38,6"
        stroke="#EF4444"
        strokeWidth="2.2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
});

export default function Header({ initialDark = false }: { initialDark?: boolean }) {
  const { content } = useContent();
  const { viewMode } = useRecruiter();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const logoClicks = useRef(0);
  const logoTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    logoClicks.current += 1;
    if (logoClicks.current === 3) {
      setIsAdminOpen(true);
      logoClicks.current = 0;
    }
    if (logoTimer.current) clearTimeout(logoTimer.current);
    logoTimer.current = setTimeout(() => {
      logoClicks.current = 0;
    }, 1000);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // If initialDark is true, use dark text (text-text) when NOT scrolled too
  // Normal behavior: white text at top, dark text when scrolled
  const isDarkText = initialDark || scrolled;
  const navLinks = viewMode === "personal" ? PERSONAL_NAV_LINKS : NAV_LINKS;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-lg border-b border-border"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-8 md:px-16 lg:px-24 overflow-visible">
          {/* Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className={cn(
              "font-mono text-sm font-medium tracking-tight transition-colors",
              isDarkText ? "text-text" : "text-white"
            )}
            aria-label="Home"
          >
            {content.SITE.name ? content.SITE.name.split(" ")[0].toLowerCase() + "." : "portfolio."}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                className={cn(
                  "font-mono text-xs tracking-wide transition-colors",
                  isDarkText
                    ? "text-text-secondary hover:text-text"
                    : "text-white/60 hover:text-white"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden items-center gap-5 md:flex" data-tour="recruiter">
            <div className="relative inline-flex items-center">
              <RecruiterToggle size="sm" dark={!isDarkText} />
              <DoodleCircle />
            </div>
            <a
              href={content.SITE.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs font-medium transition-all duration-200 hover:-translate-y-px",
                isDarkText
                  ? "bg-text text-white hover:bg-text/90"
                  : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 border border-white/10"
              )}
            >
              <Download size={13} />
              Resume
            </a>
          </div>

          {/* Mobile: recruiter toggle + testimonial circles + menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <RecruiterToggle size="sm" dark={!isDarkText} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn("relative z-50", isDarkText ? "text-text" : "text-white")}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

      </header>

      {/* Mobile drawer — rendered via portal so it's never clipped by the header stacking context */}
      {mounted && createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 bg-dark md:hidden"
            >
              {/* Close button inside drawer */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-5 right-6 text-white/60 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>

              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-2xl font-semibold text-white transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
              <RecruiterToggle dark />
              <a
                href={content.SITE.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-mono text-sm text-white"
              >
                <Download size={14} />
                Download Resume
              </a>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </>
  );
}
