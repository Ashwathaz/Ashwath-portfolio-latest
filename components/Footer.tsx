"use client";

import { Linkedin, Github, Mail, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useContent } from "@/lib/content-context";

export default function Footer() {
  const { content } = useContent();
  const SITE = content.SITE;
  return (
    <footer className="border-t border-border-light bg-bg-alt pb-24">
      <div className="mx-auto max-w-[1080px] px-8 py-16 md:px-16 lg:px-24">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
              Navigation
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={SITE.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary transition-colors duration-200 hover:text-primary"
                >
                  Resume
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
              Connect
            </h4>
            <ul className="space-y-2">
              {[
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  href: SITE.linkedin,
                },
                {
                  icon: Github,
                  label: "GitHub",
                  href: SITE.github,
                },
                {
                  icon: Mail,
                  label: "Email",
                  href: `mailto:${SITE.email}`,
                },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors duration-200 hover:text-primary"
                  >
                    <Icon size={14} />
                    {label}
                  </a>
                </li>
              ))}
              {SITE.location && (
                <li className="inline-flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin size={14} />
                  <span>{SITE.location}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
              Credits
            </h4>
            <p className="text-sm text-text-secondary">
              Created by Ashwath and Codex.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
