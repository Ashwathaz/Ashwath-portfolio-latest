"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Camera, Gamepad2, Instagram, Mountain, Trophy } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { useContent } from "@/lib/content-context";

type NamedRank = {
  name: string;
  rank: string;
  desc?: string;
};

type Ambition = {
  name: string;
  desc: string;
};

type FoodItem = string | {
  name: string;
  type?: string;
};

type GalleryNote = {
  title: string;
  desc: string;
};

function getFoodName(food: FoodItem) {
  return typeof food === "string" ? food : food.name;
}

function getFoodType(food: FoodItem) {
  return typeof food === "string" ? "" : food.type;
}

export default function PersonalSections() {
  const { content } = useContent();
  const personal = content.PERSONAL;

  if (!personal) return null;

  return (
    <>
      {/* Gaming Section */}
      <SectionWrapper id="gaming" className="bg-neutral-50/50">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium uppercase tracking-widest text-primary"
          >
            Gamer Life
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold text-text md:text-4xl"
          >
            Gaming Milestones
          </motion.h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-text-secondary">
            Leveling up one game at a time, from tactical shooters to story-rich adventures.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {personal.gaming?.map((game: NamedRank, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              <Gamepad2 className="mb-4 text-primary" size={28} />
              <h3 className="font-display text-xl font-bold text-text">{game.name}</h3>
              <p className="mt-1 font-mono text-sm text-text-muted">{game.rank}</p>
              {game.desc && (
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">{game.desc}</p>
              )}
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Sports Section */}
      <SectionWrapper id="sports">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium uppercase tracking-widest text-primary"
          >
            Active Lifestyle
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold text-text md:text-4xl"
          >
            Sports & Recreation
          </motion.h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {personal.sports?.map((sport: NamedRank, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-6 rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Trophy size={28} />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-text">{sport.name}</h3>
                <p className="font-mono text-sm text-text-muted">{sport.rank}</p>
                {sport.desc && <p className="mt-2 text-sm italic text-text-secondary">{sport.desc}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Foodie Section */}
      <SectionWrapper id="foodie" className="bg-neutral-50/50 border-t border-border">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium uppercase tracking-widest text-primary"
          >
            Taste Buds
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold text-text md:text-4xl"
          >
            The Foodie Corner
          </motion.h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-text-secondary">
            What keeps me fueled and happy outside the terminal.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {personal.foodie?.map((food: FoodItem, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-white p-5 shadow-sm"
            >
              <h3 className="font-display text-lg font-bold text-text">{getFoodName(food)}</h3>
              {getFoodType(food) && (
                <p className="mt-1 font-mono text-xs text-text-muted">{getFoodType(food)}</p>
              )}
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Ambitions Section */}
      <SectionWrapper id="ambitions">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium uppercase tracking-widest text-primary"
          >
            Future Focus
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold text-text md:text-4xl"
          >
            Interests & Ambitions
          </motion.h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {personal.ambitions?.map((goal: Ambition, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Award size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold text-text">{goal.name}</h3>
              <p className="mt-2 text-text-secondary">{goal.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Gallery Section */}
      <SectionWrapper id="gallery" className="bg-neutral-50/50 border-t border-border">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium uppercase tracking-widest text-primary"
          >
            Moments
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold text-text md:text-4xl"
          >
            Life Captured
          </motion.h2>
          {personal.instagram && (
            <a
              href={personal.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary transition-colors hover:text-text"
            >
              <Instagram size={14} />
              Follow @ig._ashz
            </a>
          )}
        </div>
        {personal.galleryNotes && personal.galleryNotes.length > 0 && (
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {personal.galleryNotes.map((note: GalleryNote, i: number) => {
              const Icon = i === 0 ? Camera : i === 1 ? Mountain : Award;
              return (
                <motion.div
                  key={note.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm"
                >
                  <Icon className="mb-4 text-primary" size={24} />
                  <h3 className="font-display text-xl font-bold text-text">{note.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{note.desc}</p>
                </motion.div>
              );
            })}
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {personal.gallery?.map((img: string, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-transform hover:scale-[1.02]"
            >
              <Image
                src={img}
                alt={`Gallery image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
