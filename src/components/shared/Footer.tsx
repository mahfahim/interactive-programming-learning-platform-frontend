"use client";

import { CheckCircle2, Code2, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// --- Inline Brand Icons for 100% Compatibility & Accessibility ---
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3v6Z" />
  </svg>
);

// --- Footer Navigation Links Data ---
const FOOTER_COLUMNS = [
  {
    id: "col-platform",
    title: "Platform",
    links: [
      { id: "link-courses", label: "Browse Courses", href: "/courses" },
      {
        id: "link-interactive-ide",
        label: "Browser IDE Sandbox",
        href: "/sandbox",
      },
      { id: "link-paths", label: "Learning Paths", href: "/paths" },
      { id: "link-challenges", label: "Code Challenges", href: "/challenges" },
      {
        id: "link-certifications",
        label: "Certifications",
        href: "/certifications",
      },
    ],
  },
  {
    id: "col-resources",
    title: "Resources",
    links: [
      { id: "link-documentation", label: "Documentation", href: "/docs" },
      { id: "link-tutorials", label: "Guides & Tutorials", href: "/tutorials" },
      {
        id: "link-cheat-sheets",
        label: "Syntax Cheatsheets",
        href: "/cheatsheets",
      },
      { id: "link-blog", label: "Engineering Blog", href: "/blog" },
      { id: "link-community", label: "Developer Forum", href: "/forum" },
    ],
  },
  {
    id: "col-company",
    title: "Company",
    links: [
      { id: "link-about", label: "About Us", href: "/about" },
      {
        id: "link-careers",
        label: "Careers",
        href: "/careers",
        badge: "Hiring",
      },
      { id: "link-mentors", label: "Become a Mentor", href: "/mentors" },
      { id: "link-press", label: "Press & Kit", href: "/press" },
      { id: "link-contact", label: "Contact Us", href: "/contact" },
    ],
  },
  {
    id: "col-legal",
    title: "Legal & Security",
    links: [
      { id: "link-privacy", label: "Privacy Policy", href: "/privacy" },
      { id: "link-terms", label: "Terms of Service", href: "/terms" },
      { id: "link-security", label: "Security & SOC2", href: "/security" },
      { id: "link-cookies", label: "Cookie Settings", href: "/cookies" },
      { id: "link-compliance", label: "Compliance", href: "/compliance" },
    ],
  },
];

// --- Social Links Data ---
const SOCIAL_LINKS = [
  {
    id: "social-github",
    label: "GitHub",
    href: "https://github.com",
    icon: GithubIcon,
  },
  {
    id: "social-twitter",
    label: "Twitter / X",
    href: "https://twitter.com",
    icon: TwitterIcon,
  },
  {
    id: "social-linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: LinkedinIcon,
  },
  {
    id: "social-youtube",
    label: "YouTube",
    href: "https://youtube.com",
    icon: YoutubeIcon,
  },
];

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="border-t border-border/60 bg-muted/30 text-foreground relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute bottom-0 right-1/4 w-125 h-65 bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Main Footer Container */}
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl pt-16 pb-12">
        {/* Top Grid: Brand & Newsletter + Link Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-border/60">
          {/* Brand, Mission & Newsletter Area */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-linear-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                Code BD Code
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Empowering the next generation of software engineers through
              interactive hands-on code execution, expert mentorship, and
              real-world project portfolios.
            </p>

            {/* Newsletter Subscription Card */}
            <div className="p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-bold">Subscribe to Code BD Code</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Get weekly interactive coding challenges, industry insights, and
                career tips directly in your inbox.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold animate-in fade-in duration-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    Thanks for joining! Check your inbox for your welcome
                    digest.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    required
                    className="flex-1 h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-10 px-4 font-semibold gap-1.5 shadow-sm"
                  >
                    <span>Join</span>
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Nav Link Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.id} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {column.title}
                </h3>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {link.label}
                        </span>
                        {link.badge && (
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-500">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: System Status, Copyright & Social Icons */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          {/* Left: Copyright & System Health Status */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <p>
              &copy; {new Date().getFullYear()} DevMastery Platform, Inc. All
              rights reserved.
            </p>

            <span className="hidden sm:inline text-border">•</span>

            {/* Live Status Indicator */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-medium text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Right: Social Media Icon Links */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-9 w-9 rounded-xl border border-border/60 bg-card hover:bg-muted hover:border-primary/40 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200 group shadow-xs"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
