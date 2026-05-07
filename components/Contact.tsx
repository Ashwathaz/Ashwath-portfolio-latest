"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Phone, Send, User, X } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import { useContent } from "@/lib/content-context";

type ContactFormState = {
  name: string;
  email: string;
  message: string;
  company: string;
};

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  message: "",
  company: "",
};

export default function Contact() {
  const { content } = useContent();
  const { email, phone, linkedin, github } = content.SITE;
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (field: keyof ContactFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((current) => ({ ...current, [field]: e.target.value }));
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please email me directly.");
      }

      setSubmitted(true);
      setFormData(initialFormState);
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 3000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact">
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs font-medium uppercase tracking-widest text-primary"
        >
          Let&apos;s Connect
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-4xl font-bold text-text md:text-5xl"
        >
          Get In Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-lg text-text-secondary"
        >
          Whether you have a question, a project idea, or just want to say hi, I&apos;ll try my best to get back to you!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <a
            href={`mailto:${email}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-8 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Mail size={24} />
            </div>
            <h3 className="font-display font-semibold text-text">Email</h3>
            <p className="font-mono text-sm text-text-muted">{email}</p>
          </a>

          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-8 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Phone size={24} />
            </div>
            <h3 className="font-display font-semibold text-text">Phone</h3>
            <p className="font-mono text-sm text-text-muted">{phone}</p>
          </a>

          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-8 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Linkedin size={24} />
            </div>
            <h3 className="font-display font-semibold text-text">LinkedIn</h3>
            <p className="font-mono text-sm text-text-muted">Let&apos;s connect</p>
          </a>

          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-8 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Github size={24} />
            </div>
            <h3 className="font-display font-semibold text-text">GitHub</h3>
            <p className="font-mono text-sm text-text-muted">Check out my code</p>
          </a>
        </motion.div>

        {/* Tell me who you are button */}
        <div className="mt-8 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.button
                key="open-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-text px-10 py-5 font-display text-lg font-bold text-white shadow-2xl transition-all hover:bg-neutral-800"
              >
                <User size={20} className="transition-transform group-hover:scale-110" />
                Tell me who you are
                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.button>
            ) : (
              <motion.div
                key="form-container"
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                className="w-full overflow-hidden"
              >
                <div className="mt-4 rounded-3xl border border-border bg-neutral-50/50 p-8 text-left backdrop-blur-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h4 className="font-display text-xl font-bold text-text">Introduce Yourself</h4>
                    <button
                      onClick={() => setShowForm(false)}
                      className="rounded-full p-2 text-text-muted hover:bg-neutral-200 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center py-12 text-center"
                    >
                      <div className="mb-4 rounded-full bg-success/20 p-4 text-success">
                        <Send size={32} />
                      </div>
                      <h5 className="font-display text-xl font-bold text-text">Message Sent!</h5>
                      <p className="mt-2 text-text-secondary">Thanks for reaching out, Ashwath will get back to you soon.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange("company")}
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        aria-hidden="true"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-muted">Name</label>
                          <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={handleChange("name")}
                            placeholder="Your Name"
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-muted">Email</label>
                          <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={handleChange("email")}
                            placeholder="your@email.com"
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-muted">Why are you visiting me?</label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={handleChange("message")}
                          placeholder="I&apos;d like to talk about..."
                          className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                        />
                      </div>
                      {submitError && (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-700">
                          {submitError}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 font-display font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <Send size={18} />
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  );
}
