"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Calendar,
  Camera,
  FolderDot,
  Gamepad2,
  ImageIcon,
  Info,
  Layout,
  LinkIcon,
  Loader2,
  Lock,
  Plus,
  Save,
  Trash2,
  Trophy,
  Upload,
  Utensils,
  X,
} from "lucide-react";
import { useContent } from "@/lib/content-context";
import type { PortfolioContent, PortfolioProject } from "@/lib/content-context";
import type { TimelineItem } from "@/types";
import { cn } from "@/lib/utils";

type AdminTab = "site" | "about" | "timeline" | "projects" | "personal" | "media";
type Message = { type: "success" | "error"; text: string };
type PersonalContent = NonNullable<PortfolioContent["PERSONAL"]>;
type NamedRank = { name: string; rank: string; desc?: string };
type FoodItem = { name: string; type?: string };
type Ambition = { name: string; desc: string };
type GalleryNote = { title: string; desc: string };

const EMPTY_TIMELINE_ITEM: TimelineItem = {
  role: "",
  organization: "",
  period: "",
  points: [],
  color: "#6366F1",
};

const EMPTY_PROJECT: PortfolioProject = {
  title: "",
  tech: "",
  description: "",
  points: [],
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-border/40 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </Field>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <Field label={label}>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-lg border border-border/40 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </Field>
  );
}

function UploadInput({
  accept,
  onFile,
}: {
  accept: string;
  onFile: (file: File) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-violet-700 transition hover:bg-violet-100">
      <Upload size={14} />
      Upload
      <input
        type="file"
        accept={accept}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = "";
        }}
        className="hidden"
      />
    </label>
  );
}

export default function AdminPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { content, previewContent, updateContent } = useContent();
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState<PortfolioContent>(content);
  const [activeTab, setActiveTab] = useState<AdminTab>("site");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const lastSavedContent = useRef<PortfolioContent>(content);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      setFormData(content);
      lastSavedContent.current = content;
      setMessage(null);
    }
    wasOpen.current = isOpen;
  }, [isOpen, content]);

  useEffect(() => {
    if (isOpen && isAuthorized) {
      previewContent(formData);
    }
  }, [formData, isAuthorized, isOpen, previewContent]);

  const showMessage = (nextMessage: Message) => {
    setMessage(nextMessage);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleClose = () => {
    if (isAuthorized) {
      previewContent(lastSavedContent.current);
    }
    onClose();
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!password) {
      showMessage({ type: "error", text: "Enter the admin password." });
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Incorrect password.");
      }

      setIsAuthorized(true);
      showMessage({ type: "success", text: "Secret door unlocked." });
    } catch (error) {
      showMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Login failed.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    const dataToSave: PortfolioContent = {
      ...formData,
      PROJECTS: formData.PROJECTS || [],
      PERSONAL: formData.PERSONAL || {},
    };

    const success = await updateContent(dataToSave, password);
    setIsSaving(false);

    if (success) {
      lastSavedContent.current = dataToSave;
      showMessage({ type: "success", text: "Content updated live." });
    } else {
      showMessage({ type: "error", text: "Save failed. Check the password or server logs." });
    }
  };

  const uploadFile = async (file: File, applyUrl: (url: string) => void) => {
    const body = new FormData();
    body.append("file", file);
    setMessage({ type: "success", text: "Uploading media..." });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "X-Admin-Password": password },
        body,
      });
      const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Upload failed.");
      }

      applyUrl(data.url);
      showMessage({ type: "success", text: "Uploaded. Save changes to publish it." });
    } catch (error) {
      showMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Upload failed.",
      });
    }
  };

  const updateSite = (field: keyof PortfolioContent["SITE"], value: string) => {
    setFormData((current) => ({
      ...current,
      SITE: { ...current.SITE, [field]: value },
    }));
  };

  const updatePersonal = (patch: Partial<PersonalContent>) => {
    setFormData((current) => ({
      ...current,
      PERSONAL: { ...current.PERSONAL, ...patch },
    }));
  };

  function updatePersonalList<K extends keyof PersonalContent>(key: K, value: NonNullable<PersonalContent[K]>) {
    updatePersonal({ [key]: value } as Partial<PersonalContent>);
  }

  const updateTimelineItem = (index: number, patch: Partial<TimelineItem>) => {
    setFormData((current) => ({
      ...current,
      TIMELINE: current.TIMELINE.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  };

  const updateProject = (index: number, patch: Partial<PortfolioProject>) => {
    setFormData((current) => ({
      ...current,
      PROJECTS: (current.PROJECTS || []).map((project, projectIndex) =>
        projectIndex === index ? { ...project, ...patch } : project
      ),
    }));
  };

  if (!isOpen) return null;

  const personal = formData.PERSONAL || {};
  const gaming = (personal.gaming || []) as NamedRank[];
  const sports = (personal.sports || []) as NamedRank[];
  const foodie = (personal.foodie || []).map((item) =>
    typeof item === "string" ? { name: item, type: "" } : item
  ) as FoodItem[];
  const ambitions = (personal.ambitions || []) as Ambition[];
  const galleryNotes = (personal.galleryNotes || []) as GalleryNote[];
  const gallery = personal.gallery || [];

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ size?: number }> }> = [
    { id: "site", label: "Site Info", icon: Layout },
    { id: "about", label: "About", icon: Info },
    { id: "timeline", label: "Experience", icon: Calendar },
    { id: "projects", label: "Projects", icon: FolderDot },
    { id: "personal", label: "Personal", icon: Gamepad2 },
    { id: "media", label: "Media", icon: Upload },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-border/10 bg-white/70 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
                <Lock size={16} />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-text">Secret Door: Admin Control</h2>
                <p className="font-mono text-[10px] text-text-muted">Edit work, personal, links, media, and AI context</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-2 text-text-muted transition-colors hover:bg-violet-100 hover:text-text"
              aria-label="Close admin panel"
            >
              <X size={20} />
            </button>
          </div>

          {!isAuthorized ? (
            <div className="flex flex-col items-center justify-center px-6 py-12">
              {message && (
                <div
                  className={cn(
                    "mb-5 w-full max-w-sm rounded-xl border p-3 text-center text-sm font-medium",
                    message.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                  {message.text}
                </div>
              )}
              <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
                <div className="space-y-2 text-center">
                  <h3 className="font-display text-xl font-bold">Admin Login</h3>
                  <p className="text-sm text-text-muted">Enter the secret password to unlock editing.</p>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Secret Password"
                  autoFocus
                  className="w-full rounded-xl border border-border/50 bg-white px-4 py-3 text-center text-sm outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4"
                />
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-display font-bold text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700 active:scale-95 disabled:opacity-60"
                >
                  {isLoggingIn && <Loader2 size={16} className="animate-spin" />}
                  Enter the Room
                </button>
              </form>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="flex min-h-0 flex-1 overflow-hidden">
                <div className="w-52 shrink-0 space-y-2 overflow-y-auto border-r border-border/10 bg-white/40 p-4">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        activeTab === id
                          ? "bg-violet-100 text-violet-700 shadow-sm"
                          : "text-text-muted hover:bg-violet-50 hover:text-text"
                      )}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="min-w-0 flex-1 overflow-y-auto p-6">
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "mb-6 rounded-xl border p-3 text-center text-sm font-medium",
                        message.type === "success"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      )}
                    >
                      {message.text}
                    </motion.div>
                  )}

                  {activeTab === "site" && (
                    <div className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextInput label="Name" value={formData.SITE.name} onChange={(value) => updateSite("name", value)} />
                        <TextInput label="Title" value={formData.SITE.title} onChange={(value) => updateSite("title", value)} />
                        <TextInput label="Email" value={formData.SITE.email} onChange={(value) => updateSite("email", value)} />
                        <TextInput label="Phone" value={formData.SITE.phone} onChange={(value) => updateSite("phone", value)} />
                        <TextInput label="LinkedIn" value={formData.SITE.linkedin} onChange={(value) => updateSite("linkedin", value)} />
                        <TextInput label="GitHub" value={formData.SITE.github} onChange={(value) => updateSite("github", value)} />
                        <TextInput label="Portfolio Link" value={formData.SITE.portfolio} onChange={(value) => updateSite("portfolio", value)} />
                        <TextInput label="Location" value={formData.SITE.location} onChange={(value) => updateSite("location", value)} />
                      </div>
                      <TextArea label="Tagline" value={formData.SITE.tagline} onChange={(value) => updateSite("tagline", value)} />
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <TextInput label="Profile Photo URL" value={formData.SITE.photoUrl || ""} onChange={(value) => updateSite("photoUrl", value)} />
                          <UploadInput accept="image/*" onFile={(file) => uploadFile(file, (url) => updateSite("photoUrl", url))} />
                        </div>
                        <div className="space-y-2">
                          <TextInput label="Resume URL" value={formData.SITE.resumeUrl} onChange={(value) => updateSite("resumeUrl", value)} />
                          <UploadInput accept=".pdf" onFile={(file) => uploadFile(file, (url) => updateSite("resumeUrl", url))} />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "about" && (
                    <div className="space-y-4">
                      {formData.ABOUT_TEXT.map((text, index) => (
                        <div key={index} className="flex gap-2">
                          <TextArea
                            label={`Paragraph ${index + 1}`}
                            value={text}
                            onChange={(value) => {
                              const next = [...formData.ABOUT_TEXT];
                              next[index] = value;
                              setFormData({ ...formData, ABOUT_TEXT: next });
                            }}
                          />
                          <button
                            onClick={() => setFormData({ ...formData, ABOUT_TEXT: formData.ABOUT_TEXT.filter((_, itemIndex) => itemIndex !== index) })}
                            className="mt-5 h-10 rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                            aria-label="Remove paragraph"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setFormData({ ...formData, ABOUT_TEXT: [...formData.ABOUT_TEXT, ""] })}
                        className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
                      >
                        <Plus size={16} />
                        Add Paragraph
                      </button>
                    </div>
                  )}

                  {activeTab === "timeline" && (
                    <div className="space-y-5">
                      {formData.TIMELINE.map((item, index) => (
                        <div key={index} className="space-y-3 rounded-xl border border-border/20 bg-white/60 p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <h4 className="font-display font-bold">Experience {index + 1}</h4>
                            <button
                              onClick={() => setFormData({ ...formData, TIMELINE: formData.TIMELINE.filter((_, itemIndex) => itemIndex !== index) })}
                              className="rounded-lg bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100"
                              aria-label="Remove experience"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <TextInput label="Role" value={item.role} onChange={(value) => updateTimelineItem(index, { role: value })} />
                            <TextInput label="Organization" value={item.organization} onChange={(value) => updateTimelineItem(index, { organization: value })} />
                            <TextInput label="Period" value={item.period} onChange={(value) => updateTimelineItem(index, { period: value })} />
                            <TextInput label="Color" value={item.color} onChange={(value) => updateTimelineItem(index, { color: value })} />
                          </div>
                          <div className="space-y-2">
                            {(item.points || []).map((point, pointIndex) => (
                              <div key={pointIndex} className="flex gap-2">
                                <input
                                  value={point}
                                  placeholder="Bullet point"
                                  onChange={(event) => {
                                    const points = [...(item.points || [])];
                                    points[pointIndex] = event.target.value;
                                    updateTimelineItem(index, { points });
                                  }}
                                  className="flex-1 rounded-lg border border-border/40 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                                <button
                                  onClick={() => updateTimelineItem(index, { points: item.points.filter((_, itemIndex) => itemIndex !== pointIndex) })}
                                  className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                                  aria-label="Remove point"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => updateTimelineItem(index, { points: [...(item.points || []), ""] })}
                              className="inline-flex items-center gap-2 text-xs font-medium text-violet-600 hover:text-violet-700"
                            >
                              <Plus size={14} />
                              Add Point
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setFormData({ ...formData, TIMELINE: [...formData.TIMELINE, { ...EMPTY_TIMELINE_ITEM }] })}
                        className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
                      >
                        <Plus size={16} />
                        Add Experience
                      </button>
                    </div>
                  )}

                  {activeTab === "projects" && (
                    <div className="space-y-5">
                      {(formData.PROJECTS || []).map((project, index) => (
                        <div key={project.id || index} className="space-y-3 rounded-xl border border-border/20 bg-white/60 p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <h4 className="font-display font-bold">Project {index + 1}</h4>
                            <button
                              onClick={() => setFormData({ ...formData, PROJECTS: (formData.PROJECTS || []).filter((_, itemIndex) => itemIndex !== index) })}
                              className="rounded-lg bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100"
                              aria-label="Remove project"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <TextInput label="Title" value={project.title || ""} onChange={(value) => updateProject(index, { title: value })} />
                            <TextInput label="Date" value={project.date || ""} onChange={(value) => updateProject(index, { date: value })} />
                            <TextInput label="Tech Stack" value={project.tech || ""} onChange={(value) => updateProject(index, { tech: value })} />
                            <TextInput label="Project Link" value={project.link || ""} onChange={(value) => updateProject(index, { link: value })} />
                          </div>
                          <TextArea label="Description" value={project.description || ""} onChange={(value) => updateProject(index, { description: value })} />
                          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                            <TextInput label="Image URL" value={project.image || ""} onChange={(value) => updateProject(index, { image: value })} />
                            <UploadInput accept="image/*" onFile={(file) => uploadFile(file, (url) => updateProject(index, { image: url }))} />
                          </div>
                          <div className="space-y-2">
                            {(project.points || []).map((point, pointIndex) => (
                              <div key={pointIndex} className="flex gap-2">
                                <input
                                  value={point}
                                  placeholder="Project detail"
                                  onChange={(event) => {
                                    const points = [...(project.points || [])];
                                    points[pointIndex] = event.target.value;
                                    updateProject(index, { points });
                                  }}
                                  className="flex-1 rounded-lg border border-border/40 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                                <button
                                  onClick={() => updateProject(index, { points: (project.points || []).filter((_, itemIndex) => itemIndex !== pointIndex) })}
                                  className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                                  aria-label="Remove project detail"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => updateProject(index, { points: [...(project.points || []), ""] })}
                              className="inline-flex items-center gap-2 text-xs font-medium text-violet-600 hover:text-violet-700"
                            >
                              <Plus size={14} />
                              Add Detail
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            PROJECTS: [...(formData.PROJECTS || []), { ...EMPTY_PROJECT, id: String(Date.now()) }],
                          })
                        }
                        className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
                      >
                        <Plus size={16} />
                        Add Project
                      </button>
                    </div>
                  )}

                  {activeTab === "personal" && (
                    <div className="space-y-7">
                      <div className="space-y-4 rounded-xl border border-border/20 bg-white/60 p-4">
                        <h4 className="flex items-center gap-2 font-display font-bold"><ImageIcon size={18} /> Personal Hero</h4>
                        <TextInput label="Hero Label" value={personal.heroTitle || ""} onChange={(value) => updatePersonal({ heroTitle: value })} />
                        <div className="grid gap-3 md:grid-cols-3">
                          <TextInput label="Heading Before Accent" value={personal.heroHeadingBefore || ""} onChange={(value) => updatePersonal({ heroHeadingBefore: value })} />
                          <TextInput label="Accent Word" value={personal.heroHeadingAccent || ""} onChange={(value) => updatePersonal({ heroHeadingAccent: value })} />
                          <TextInput label="Heading After Accent" value={personal.heroHeadingAfter || ""} onChange={(value) => updatePersonal({ heroHeadingAfter: value })} />
                        </div>
                        <TextArea label="Hero Intro" value={personal.heroText || ""} onChange={(value) => updatePersonal({ heroText: value })} />
                        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                          <TextInput label="Hero Image URL" value={personal.heroImage || ""} onChange={(value) => updatePersonal({ heroImage: value })} />
                          <UploadInput accept="image/*" onFile={(file) => uploadFile(file, (url) => updatePersonal({ heroImage: url }))} />
                        </div>
                      </div>

                      <TextInput label="Instagram Link" value={personal.instagram || ""} onChange={(value) => updatePersonal({ instagram: value })} />

                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 font-display font-bold"><Gamepad2 size={18} /> Gaming</h4>
                        {gaming.map((item, index) => (
                          <div key={index} className="grid gap-2 rounded-xl border border-border/20 bg-white/60 p-3 md:grid-cols-[1fr_1fr_1.4fr_auto]">
                            <input value={item.name} placeholder="Game" onChange={(event) => {
                              const next = [...gaming];
                              next[index] = { ...item, name: event.target.value };
                              updatePersonalList("gaming", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <input value={item.rank} placeholder="Rank" onChange={(event) => {
                              const next = [...gaming];
                              next[index] = { ...item, rank: event.target.value };
                              updatePersonalList("gaming", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <input value={item.desc || ""} placeholder="Description" onChange={(event) => {
                              const next = [...gaming];
                              next[index] = { ...item, desc: event.target.value };
                              updatePersonalList("gaming", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <button onClick={() => updatePersonalList("gaming", gaming.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg bg-red-50 p-2 text-red-500"><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <button onClick={() => updatePersonalList("gaming", [...gaming, { name: "", rank: "", desc: "" }])} className="inline-flex items-center gap-2 text-sm font-medium text-violet-600"><Plus size={16} /> Add Game</button>
                      </div>

                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 font-display font-bold"><Trophy size={18} /> Sports</h4>
                        {sports.map((item, index) => (
                          <div key={index} className="grid gap-2 rounded-xl border border-border/20 bg-white/60 p-3 md:grid-cols-[1fr_1fr_1.4fr_auto]">
                            <input value={item.name} placeholder="Sport" onChange={(event) => {
                              const next = [...sports];
                              next[index] = { ...item, name: event.target.value };
                              updatePersonalList("sports", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <input value={item.rank} placeholder="Level" onChange={(event) => {
                              const next = [...sports];
                              next[index] = { ...item, rank: event.target.value };
                              updatePersonalList("sports", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <input value={item.desc || ""} placeholder="Description" onChange={(event) => {
                              const next = [...sports];
                              next[index] = { ...item, desc: event.target.value };
                              updatePersonalList("sports", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <button onClick={() => updatePersonalList("sports", sports.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg bg-red-50 p-2 text-red-500"><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <button onClick={() => updatePersonalList("sports", [...sports, { name: "", rank: "", desc: "" }])} className="inline-flex items-center gap-2 text-sm font-medium text-violet-600"><Plus size={16} /> Add Sport</button>
                      </div>

                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 font-display font-bold"><Utensils size={18} /> Food</h4>
                        {foodie.map((item, index) => (
                          <div key={index} className="grid gap-2 rounded-xl border border-border/20 bg-white/60 p-3 md:grid-cols-[1fr_1fr_auto]">
                            <input value={item.name} placeholder="Food" onChange={(event) => {
                              const next = [...foodie];
                              next[index] = { ...item, name: event.target.value };
                              updatePersonalList("foodie", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <input value={item.type || ""} placeholder="Type" onChange={(event) => {
                              const next = [...foodie];
                              next[index] = { ...item, type: event.target.value };
                              updatePersonalList("foodie", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <button onClick={() => updatePersonalList("foodie", foodie.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg bg-red-50 p-2 text-red-500"><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <button onClick={() => updatePersonalList("foodie", [...foodie, { name: "", type: "" }])} className="inline-flex items-center gap-2 text-sm font-medium text-violet-600"><Plus size={16} /> Add Food</button>
                      </div>

                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 font-display font-bold"><Award size={18} /> Ambitions</h4>
                        {ambitions.map((item, index) => (
                          <div key={index} className="grid gap-2 rounded-xl border border-border/20 bg-white/60 p-3 md:grid-cols-[1fr_1.5fr_auto]">
                            <input value={item.name} placeholder="Ambition" onChange={(event) => {
                              const next = [...ambitions];
                              next[index] = { ...item, name: event.target.value };
                              updatePersonalList("ambitions", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <input value={item.desc} placeholder="Description" onChange={(event) => {
                              const next = [...ambitions];
                              next[index] = { ...item, desc: event.target.value };
                              updatePersonalList("ambitions", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <button onClick={() => updatePersonalList("ambitions", ambitions.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg bg-red-50 p-2 text-red-500"><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <button onClick={() => updatePersonalList("ambitions", [...ambitions, { name: "", desc: "" }])} className="inline-flex items-center gap-2 text-sm font-medium text-violet-600"><Plus size={16} /> Add Ambition</button>
                      </div>
                    </div>
                  )}

                  {activeTab === "media" && (
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3 rounded-xl border border-border/20 bg-white/60 p-4">
                          <h4 className="flex items-center gap-2 font-display font-bold text-sm"><ImageIcon size={18} /> Profile Photo</h4>
                          <p className="truncate font-mono text-xs text-text-muted">{formData.SITE.photoUrl || "No profile photo set"}</p>
                          <UploadInput accept="image/*" onFile={(file) => uploadFile(file, (url) => updateSite("photoUrl", url))} />
                        </div>
                        <div className="space-y-3 rounded-xl border border-border/20 bg-white/60 p-4">
                          <h4 className="flex items-center gap-2 font-display font-bold text-sm"><LinkIcon size={18} /> Resume</h4>
                          <p className="truncate font-mono text-xs text-text-muted">{formData.SITE.resumeUrl}</p>
                          <UploadInput accept=".pdf" onFile={(file) => uploadFile(file, (url) => updateSite("resumeUrl", url))} />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="flex items-center gap-2 font-display font-bold"><Camera size={18} /> Personal Gallery</h4>
                          <UploadInput accept="image/*" onFile={(file) => uploadFile(file, (url) => updatePersonalList("gallery", [...gallery, url]))} />
                        </div>
                        <div className="space-y-2">
                          {gallery.map((image, index) => (
                            <div key={`${image}-${index}`} className="grid gap-2 rounded-xl border border-border/20 bg-white/60 p-3 md:grid-cols-[1fr_auto]">
                              <input
                                value={image}
                                onChange={(event) => {
                                  const next = [...gallery];
                                  next[index] = event.target.value;
                                  updatePersonalList("gallery", next);
                                }}
                                className="rounded-lg border border-border/40 bg-white px-3 py-2 font-mono text-xs"
                              />
                              <button onClick={() => updatePersonalList("gallery", gallery.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg bg-red-50 p-2 text-red-500"><Trash2 size={16} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-display font-bold">Gallery Notes</h4>
                        {galleryNotes.map((note, index) => (
                          <div key={index} className="grid gap-2 rounded-xl border border-border/20 bg-white/60 p-3 md:grid-cols-[1fr_1.5fr_auto]">
                            <input value={note.title} placeholder="Title" onChange={(event) => {
                              const next = [...galleryNotes];
                              next[index] = { ...note, title: event.target.value };
                              updatePersonalList("galleryNotes", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <input value={note.desc} placeholder="Description" onChange={(event) => {
                              const next = [...galleryNotes];
                              next[index] = { ...note, desc: event.target.value };
                              updatePersonalList("galleryNotes", next);
                            }} className="rounded-lg border border-border/40 bg-white px-3 py-2 text-sm" />
                            <button onClick={() => updatePersonalList("galleryNotes", galleryNotes.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg bg-red-50 p-2 text-red-500"><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <button onClick={() => updatePersonalList("galleryNotes", [...galleryNotes, { title: "", desc: "" }])} className="inline-flex items-center gap-2 text-sm font-medium text-violet-600"><Plus size={16} /> Add Note</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/10 bg-white/70 px-6 py-4 backdrop-blur-sm">
                <p className="text-[10px] text-text-muted">Uploads are saved to the site and content changes publish after Save Changes.</p>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 font-display font-bold text-white shadow-lg shadow-violet-100 transition-all hover:bg-violet-700 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
