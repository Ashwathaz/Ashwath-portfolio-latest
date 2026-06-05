"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRecruiter } from "@/lib/recruiter-context";
import { useContent } from "@/lib/content-context";
import { ROTATING_WORDS } from "@/lib/constants";

export default function Hero() {
  const { isRecruiterMode, viewMode } = useRecruiter();
  const { content } = useContent();
  const [wordIndex, setWordIndex] = useState(0);
  const [scrambledWord, setScrambledWord] = useState(ROTATING_WORDS[0]);
  const firstName = content.SITE.name.split(" ")[0] || "there";
  const personalHeroTitle = content.PERSONAL?.heroTitle || "Personal Blog & Hobbies";
  const personalHeroHeadingBefore = content.PERSONAL?.heroHeadingBefore || "Beyond the";
  const personalHeroHeadingAccent = content.PERSONAL?.heroHeadingAccent || "Build";
  const personalHeroHeadingAfter = content.PERSONAL?.heroHeadingAfter || "I explore";
  const personalHeroText =
    content.PERSONAL?.heroText ||
    "Passionate gamer, sports enthusiast, and life explorer. This is where I document my personal journey, gaming milestones, and the things that keep me inspired outside of tech.";
  const heroImage =
    viewMode === "personal"
      ? content.PERSONAL?.heroImage || "/personal.jpg"
      : content.SITE.photoUrl || "/profile.jpg";

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Scramble effect — cycles random chars then locks in left-to-right when word changes
  useEffect(() => {
    const target = ROTATING_WORDS[wordIndex];
    const LC = "abcdefghijklmnopqrstuvwxyz";
    const UC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let frame = 0;
    const TOTAL = 22;
    const id = setInterval(() => {
      const lockCount = Math.floor((frame / TOTAL) * target.length);
      const next = target.split("").map((char, i) => {
        if (char === " ") return " ";
        if (i < lockCount) return char;
        const pool = char !== char.toLowerCase() ? UC : LC;
        return pool[Math.floor(Math.random() * pool.length)];
      }).join("");
      setScrambledWord(next);
      frame++;
      if (frame >= TOTAL) { clearInterval(id); setScrambledWord(target); }
    }, 42);
    return () => clearInterval(id);
  }, [wordIndex]);

  return (
    <section id="hero-section" className="hero-gradient bg-lines relative flex min-h-screen flex-col justify-between overflow-hidden pt-16">
      {/* Main content — left aligned */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-1 flex-col md:flex-row items-center justify-between px-8 py-24 md:px-16 lg:px-24 gap-12">
        {/* Left content */}
        <div className="flex-1 flex flex-col justify-center text-left">
          {/* Top row: greeting + availability */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 flex flex-wrap items-center gap-4"
          >
            <p className="font-mono text-sm text-neutral-500">
              {isRecruiterMode ? (
                <>Hi recruiter, I&apos;m <span className="text-neutral-900">{firstName}</span></>
              ) : viewMode === "personal" ? (
                <><span className="text-neutral-900">{personalHeroTitle}</span></>
              ) : (
                <>Hii! I&apos;m <span className="text-neutral-900">{firstName}</span></>
              )}
            </p>

            {viewMode !== "personal" && (
              <div className="flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1">
                <span className="pulse-dot h-2 w-2 rounded-full bg-success" />
                <span className="font-mono text-[11px] text-success">
                  Available for projects
                </span>
              </div>
            )}
          </motion.div>

          {/* Big bold hero text */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[1.05] tracking-tight text-neutral-900"
          >
            {viewMode === "personal" ? (
              <>
                {personalHeroHeadingBefore}{" "}
                <span className="text-accent">{personalHeroHeadingAccent}</span>,
                <br className="hidden lg:block" />
                {personalHeroHeadingAfter}
              </>
            ) : (
              <>
                {content.SITE.title.split(" & ")[0]} <br className="hidden lg:block" />
                with a focus on{" "}
                <br />
                <span className="relative inline-grid grid-cols-1 align-bottom md:min-h-0">
                  <span className="col-start-1 row-start-1 text-accent">
                    {scrambledWord}
                  </span>
                  <span className="invisible col-start-1 row-start-1 opacity-0" aria-hidden>
                    {ROTATING_WORDS[wordIndex]}
                  </span>
                </span>
              </>
            )}
          </motion.h1>

          {/* Sub-description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 max-w-[520px] font-mono text-sm leading-relaxed text-neutral-400"
          >
            {viewMode === "personal" ? personalHeroText : content.SITE.tagline} ✦
          </motion.p>
        </div>

        {/* Right content: Large Image */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative aspect-square w-full max-w-[340px] md:max-w-[420px] overflow-hidden rounded-full border-4 border-white shadow-2xl bg-neutral-100 md:-mr-16 lg:-mr-32"
        >
          <Image
            src={heroImage}
            alt={content.SITE.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
