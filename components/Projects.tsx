"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, ExternalLink, FolderGit2, ArrowLeft, ArrowRight } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { useContent } from "@/lib/content-context";
import type { PortfolioProject } from "@/lib/content-context";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

export default function Projects() {
  const { content } = useContent();
  const PROJECTS = content.PROJECTS || [];
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
    loop: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (PROJECTS.length === 0) return null;

  return (
    <SectionWrapper id="projects" className="bg-neutral-50/50 border-y border-border">
      <div className="mb-14 flex items-end justify-between">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium uppercase tracking-widest text-primary"
          >
            Portfolio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold text-text md:text-4xl"
          >
            Selected Projects
          </motion.h2>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={scrollPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text-muted transition-colors hover:border-primary hover:text-primary hover:shadow-sm"
            aria-label="Previous projects"
          >
            <ArrowLeft size={18} />
          </button>
          <button 
            onClick={scrollNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text-muted transition-colors hover:border-primary hover:text-primary hover:shadow-sm"
            aria-label="Next projects"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-6 cursor-grab active:cursor-grabbing">
          {PROJECTS.map((project: PortfolioProject, i: number) => (
            <div 
              key={project.id || i} 
              className="pl-6 min-w-0 shrink-0 basis-full md:basis-1/2 lg:basis-1/3 pb-6 pt-2"
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
              >
                {project.image && (
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-neutral-100">
                    <Image
                      src={project.image}
                      alt={`${project.title} preview`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FolderGit2 size={24} />
                    </div>
                    {project.date && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-neutral-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase text-text-muted">
                        <Calendar size={12} />
                        {project.date}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="mb-3 font-display text-xl font-bold text-text transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                  
                  <p className="mb-8 flex-1 text-sm leading-relaxed text-text-secondary">
                    {project.description}
                  </p>

                  {project.points && project.points.length > 0 && (
                    <ul className="mb-8 space-y-2 border-t border-border pt-5">
                      {project.points.map((point) => (
                        <li key={point} className="flex gap-2 text-xs leading-relaxed text-text-secondary">
                          <ChevronRight size={14} className="mt-0.5 shrink-0 text-primary" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="mt-auto pt-6 border-t border-border">
                    <div className="flex flex-wrap gap-2">
                      {project.tech?.split(",").map((tech: string, i: number) => (
                        <span 
                          key={i} 
                          className="rounded-md bg-neutral-100 px-2.5 py-1 font-mono text-[10px] uppercase font-semibold text-text-muted"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary transition-colors hover:text-text"
                      >
                        View Project
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
