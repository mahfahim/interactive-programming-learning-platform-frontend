"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Flame,
  Globe,
  GraduationCap,
  Laptop,
  
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/shared/Footer";
import { HomeNavbar } from "@/components/shared/HomeNavbar";
import { Button } from "@/components/ui/button";

// --- Interactive Snippets for IDE Demo ---
const CODE_SNIPPETS = {
  python: {
    language: "Python",
    filename: "algorithm.py",
    code: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return f"Found {target} at index {mid}!"
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return "Element not found"

print(binary_search([10, 20, 30, 40, 50], 30))`,
    output:
      "✓ Output: Found 30 at index 2!\n⚡ Executed in 0.002ms • Passed 12/12 test cases",
  },
  javascript: {
    language: "JavaScript",
    filename: "app.jsx",
    code: `async function fetchCourseProgress(userId) {
  const response = await fetch(\`/api/users/\${userId}/stats\`);
  const data = await response.json();
  
  return {
    user: data.name,
    level: "Senior Architect",
    streak: "🔥 28 Days Active"
  };
}

console.log(await fetchCourseProgress("user_99"));`,
    output: `✓ Output: { user: "Alex Chen", level: "Senior Architect", streak: "🔥 28 Days Active" }\n⚡ Executed in 1.12ms`,
  },
  rust: {
    language: "Rust",
    filename: "main.rs",
    code: `fn main() {
    let modules = vec!["Async IO", "WebAssembly", "Memory Safety"];
    println!("Mastering modern backend systems...");
    
    for (idx, name) in modules.iter().enumerate() {
        println!("{}: Unlocked skill module: {}", idx + 1, name);
    }
}`,
    output: `✓ Output: Mastering modern backend systems...\n1: Unlocked skill module: Async IO\n2: Unlocked skill module: WebAssembly\n⚡ Compiled cleanly in 0.08s`,
  },
};

// --- Platform Stats Bar Data ---
const STATS = [
  {
    id: "stat-active-learners",
    label: "Active Learners",
    value: "25,000+",
    note: "Global Tech Community",
    icon: Users,
  },
  {
    id: "stat-interactive-courses",
    label: "Interactive Courses",
    value: "60+",
    note: "Web, Cloud & AI Tracks",
    icon: BookOpen,
  },
  {
    id: "stat-completion-rate",
    label: "Completion Rate",
    value: "96.4%",
    note: "4x Higher Than Average",
    icon: GraduationCap,
  },
  {
    id: "stat-mentorship-support",
    label: "Mentorship Support",
    value: "24/7",
    note: "Real Engineer Assistance",
    icon: ShieldCheck,
  },
];

// --- Feature Cards Data ---
const FEATURES = [
  {
    id: "feat-in-browser-ide",
    icon: Code2,
    title: "Interactive In-Browser IDE",
    description:
      "Write, compile, and execute real production code right in your browser with zero environment configuration.",
    badge: "AI Feedback",
    glowColor: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500 bg-blue-500/10",
  },
  {
    id: "feat-expert-mentorship",
    icon: Users,
    title: "1-on-1 Expert Mentorship",
    description:
      "Receive personalized code reviews, career roadmap planning, and instant support from senior industry developers.",
    badge: "24/7 Support",
    glowColor: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500 bg-emerald-500/10",
  },
  {
    id: "feat-verified-certifications",
    icon: GraduationCap,
    title: "Verified Certifications",
    description:
      "Earn industry-recognized certificates with verifiable credentials you can directly showcase on LinkedIn & resumes.",
    badge: "Career Ready",
    glowColor: "from-purple-500/20 to-indigo-500/20",
    iconColor: "text-purple-500 bg-purple-500/10",
  },
  {
    id: "feat-real-world-projects",
    icon: ShieldCheck,
    title: "Real-World Projects",
    description:
      "Build production-grade applications with modern databases, automated CI/CD pipelines, and secure API architectures.",
    badge: "Portfolio Ready",
    glowColor: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500 bg-amber-500/10",
  },
  {
    id: "feat-algorithmic-challenges",
    icon: Terminal,
    title: "Algorithmic Challenges",
    description:
      "Master data structures and practice real interview technical challenges with automated unit test suites.",
    badge: "Interview Prep",
    glowColor: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-500 bg-rose-500/10",
  },
  {
    id: "feat-gamified-learning",
    icon: Zap,
    title: "Gamified Learning Paths",
    description:
      "Stay motivated with daily coding streaks, dynamic skill leaderboards, earning badges, and unlocking accomplishments.",
    badge: "High Engagement",
    glowColor: "from-violet-500/20 to-fuchsia-500/20",
    iconColor: "text-violet-500 bg-violet-500/10",
  },
];

// --- Featured Courses Data ---
const FEATURED_COURSES = [
  {
    id: "course-web-engineering",
    title: "Full-Stack Web Engineering Bootcamp",
    category: "Web Development",
    level: "Beginner to Advanced",
    rating: 4.9,
    reviews: "2.4k",
    students: "14,200+",
    lessons: "96 Interactive Lessons",
    badge: "Bestseller",
    icon: Globe,
    gradient: "from-blue-600/20 via-indigo-600/20 to-background",
  },
  {
    id: "course-dsa-mastery",
    title: "Data Structures & Algorithms Mastery",
    category: "Computer Science",
    level: "Intermediate",
    rating: 4.95,
    reviews: "1.8k",
    students: "9,800+",
    lessons: "64 Interactive Lessons",
    badge: "Most Popular",
    icon: Database,
    gradient: "from-purple-600/20 via-pink-600/20 to-background",
  },
  {
    id: "course-backend-rust",
    title: "High-Performance Backend Systems with Rust",
    category: "System Design",
    level: "Advanced",
    rating: 4.88,
    reviews: "950",
    students: "5,400+",
    lessons: "52 Interactive Lessons",
    badge: "Trending",
    icon: Cpu,
    gradient: "from-emerald-600/20 via-teal-600/20 to-background",
  },
];

// --- How It Works Steps ---
const STEPS = [
  {
    id: "step-choose-path",
    step: "01",
    title: "Choose Your Learning Path",
    description:
      "Select from full-stack development, algorithms, system design, or AI engineering based on your career goals.",
  },
  {
    id: "step-learn-by-building",
    step: "02",
    title: "Learn by Building Code",
    description:
      "Solve bite-sized interactive challenges directly inside our cloud-based IDE with real-time feedback.",
  },
  {
    id: "step-get-mentorship",
    step: "03",
    title: "Get Mentorship & Code Reviews",
    description:
      "Receive constructive feedback on your code syntax, architecture, and performance from senior engineers.",
  },
  {
    id: "step-get-certified",
    step: "04",
    title: "Get Hired & Certified",
    description:
      "Earn shareable certificates, build a portfolio of live projects, and access our employer partner network.",
  },
];

// --- Testimonials Data ---
const TESTIMONIALS = [
  {
    id: "testimonial-alex-rivera",
    name: "Alex Rivera",
    role: "Frontend Engineer @ Vercel",
    content:
      "The instant code compiler and step-by-step feedback loop changed everything for me. I transitioned from retail to full-time engineering in 6 months!",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "testimonial-david-park",
    name: "David Park",
    role: "Full-Stack Dev @ Stripe",
    content:
      "The real-world microservices projects gave me actual experience, not just theoretical syntax. The mentorship during code reviews was invaluable.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "testimonial-sophia-martinez",
    name: "Sophia Martinez",
    role: "Backend Engineer @ Uber",
    content:
      "Hands-down the cleanest interactive learning platform available. The algorithmic test suites prepared me perfectly for high-bar technical interviews.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] =
    useState<keyof typeof CODE_SNIPPETS>("python");
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(true);

  const handleRunCode = () => {
    setIsRunning(true);
    setShowOutput(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowOutput(true);
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* HomeNavbar */}
      <HomeNavbar />

      <main className="flex-1">
        {/* ================= 1. HERO SECTION WITH AMBIENT GLOW & IDE DEMO ================= */}
        <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-b from-muted/60 via-background to-background border-b border-border/40">
          {/* Ambient Glow Effects */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/15 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="container px-4 sm:px-6 mx-auto max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline & Action Calls */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-primary shadow-sm hover:border-primary/50 transition-colors cursor-default">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>Next-Gen Interactive Coding Platform</span>
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                </div>

                {/* Hero Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15]">
                  Master Modern Coding with{" "}
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                    Hands-On Interactive
                  </span>{" "}
                  Experience
                </h1>

                {/* Subtitle */}
                <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Learn software development by building real-world projects.
                  Practice in your browser with instant automated feedback,
                  1-on-1 expert code reviews, and structured career paths.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Button
                    size="lg"
                    asChild
                    className="w-full sm:w-auto h-12 px-8 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <Link
                      href="/courses"
                      className="flex items-center justify-center gap-2"
                    >
                      Explore All Courses{" "}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto h-12 px-8 font-semibold border-border/80 hover:bg-muted/80 hover:border-primary/40 transition-all duration-200"
                  >
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2"
                    >
                      <Play className="h-4 w-4 fill-current text-primary" /> Try
                      Free Sandbox
                    </Link>
                  </Button>
                </div>

                {/* Quick Trust Checklist */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>No installation needed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Free starter tier</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Code Playground Demo */}
              <div className="lg:col-span-5 w-full">
                <div className="relative rounded-2xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-primary/40 transition-all duration-300">
                  {/* Decorative Glass Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Window Header */}
                  <div className="flex items-center justify-between border-b border-border/60 bg-muted/50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                      <span className="ml-2 text-xs font-mono text-muted-foreground">
                        {CODE_SNIPPETS[activeTab].filename}
                      </span>
                    </div>

                    {/* Code Language Switcher Tabs */}
                    <div className="flex items-center gap-1 bg-background/80 p-1 rounded-lg border border-border/50">
                      {(
                        Object.keys(CODE_SNIPPETS) as Array<
                          keyof typeof CODE_SNIPPETS
                        >
                      ).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveTab(key)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                            activeTab === key
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {CODE_SNIPPETS[key].language}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Snippet Display Area */}
                  <div className="p-4 bg-slate-950 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto min-h-[200px] leading-relaxed">
                    <pre>
                      <code>{CODE_SNIPPETS[activeTab].code}</code>
                    </pre>
                  </div>

                  {/* Action Bar & Output Window */}
                  <div className="border-t border-slate-800 bg-slate-900 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Interactive Output Console</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md transition-all active:scale-95 disabled:opacity-50"
                      >
                        <Play
                          className={`h-3 w-3 ${isRunning ? "animate-spin" : "fill-current"}`}
                        />
                        {isRunning ? "Executing..." : "Run Code"}
                      </button>
                    </div>

                    {/* Execution Output Box */}
                    <div className="p-2.5 rounded bg-slate-950/80 text-emerald-400 font-mono text-xs border border-slate-800/80">
                      {isRunning ? (
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                          <span>Compiling snippet in real-time sandbox...</span>
                        </div>
                      ) : showOutput ? (
                        <p className="whitespace-pre-line leading-relaxed">
                          {CODE_SNIPPETS[activeTab].output}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Metric Counter Stats Bar */}
            <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-border/60 mt-16">
              {STATS.map((stat) => (
                <div
                  key={stat.id}
                  className="p-4 sm:p-5 rounded-xl bg-card/60 border border-border/50 hover:border-primary/40 hover:bg-card hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      Verified
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-foreground/90 mt-0.5">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 2. KEY FEATURES SECTION WITH HOVER GLOW ================= */}
        <section className="py-20 md:py-28 container px-4 sm:px-6 mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Powerful
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Built for Accelerating Software Engineers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
              Everything you need to step up your coding journey from beginner
              to senior engineer with hands-on learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="relative group p-8 rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Hover Backdrop Gradient Accent */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`h-12 w-12 rounded-xl flex items-center justify-center ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-border bg-background text-muted-foreground group-hover:border-primary/40 group-hover:text-foreground transition-colors">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="relative z-10 pt-6 mt-6 border-t border-border/40 flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                    <span>Learn more feature details</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 3. POPULAR COURSES SHOWCASE ================= */}
        <section className="py-20 bg-muted/40 border-y border-border/60">
          <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-primary">
                  <Flame className="h-3.5 w-3.5 text-amber-500" /> Curated
                  Learning Paths
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Explore Top Rated Courses
                </h2>
                <p className="text-muted-foreground text-base max-w-xl">
                  Step-by-step interactive curricula designed alongside industry
                  leaders.
                </p>
              </div>
              <Button
                variant="outline"
                asChild
                className="self-start md:self-auto gap-2"
              >
                <Link href="/courses">
                  View All 60+ Courses <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURED_COURSES.map((course) => {
                const Icon = course.icon;
                return (
                  <div
                    key={course.id}
                    className="group rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Top Visual Card Banner */}
                    <div
                      className={`p-8 bg-gradient-to-br ${course.gradient} border-b border-border/40 relative overflow-hidden`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-background/90 backdrop-blur text-foreground border shadow-xs">
                          {course.badge}
                        </span>
                        <div className="h-10 w-10 rounded-xl bg-background/80 backdrop-blur flex items-center justify-center text-primary shadow-xs group-hover:scale-110 transition-transform">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {course.category}
                      </span>
                      <h3 className="text-xl font-bold mt-1 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </div>

                    {/* Card Content & Metadata */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 text-amber-500 font-semibold">
                            <Star className="h-4 w-4 fill-amber-500" />{" "}
                            {course.rating} ({course.reviews})
                          </span>
                          <span>{course.level}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" />{" "}
                            {course.lessons}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" /> {course.students}
                          </span>
                        </div>
                      </div>

                      <Button
                        asChild
                        className="w-full mt-4 font-semibold group-hover:bg-primary"
                      >
                        <Link
                          href={`/courses/${course.id}`}
                          className="flex items-center justify-center gap-2"
                        >
                          Start Learning Now{" "}
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 4. HOW IT WORKS / STEP PROCESS ================= */}
        <section className="py-20 md:py-28 container px-4 sm:px-6 mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Rocket className="h-3.5 w-3.5 text-primary" /> Simplified
              Learning
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How You Master Skills on Our Platform
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              A structured 4-step framework engineered for fast, lasting
              comprehension.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 relative group"
              >
                <div className="text-4xl font-black text-primary/20 group-hover:text-primary/40 transition-colors mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 5. TESTIMONIALS / SOCIAL PROOF ================= */}
        <section className="py-20 bg-muted/30 border-t border-border/60">
          <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-primary">
                <Trophy className="h-3.5 w-3.5 text-amber-500" /> Student
                Success Stories
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Loved by Engineers Worldwide
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-base">
                Here is what developers who transformed their careers have to
                say.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-8 rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <h4 className="text-sm font-bold">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 6. HIGH IMPACT CALL TO ACTION (CTA) ================= */}
        <section className="py-20 md:py-28 container px-4 sm:px-6 mx-auto max-w-7xl">
          <div className="relative rounded-3xl overflow-hidden border border-primary/30 bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 p-8 sm:p-12 md:p-16 text-center shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/20 blur-[100px] pointer-events-none rounded-full" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/80 px-4 py-1.5 text-xs font-bold text-primary shadow-xs">
                <Laptop className="h-3.5 w-3.5" /> Start Learning Free Today
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Ready to Level Up Your Coding Career?
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Join thousands of developers building real projects, acing
                technical interviews, and securing high-paying software jobs.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  asChild
                  className="w-full sm:w-auto h-12 px-8 font-semibold shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    Create Free Account <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto h-12 px-8 font-semibold hover:bg-background transition-all"
                >
                  <Link href="/courses">Explore Curriculum</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
