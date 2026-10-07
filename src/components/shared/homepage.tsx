import {
  ArrowRight,
  BookOpen,
  Code2,
  GraduationCap,
  Laptop,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 bg-linear-to-b from-muted/50 to-background">
          <div className="container px-4 mx-auto text-center max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs md:text-sm font-medium shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              Interactive Programming & Learning Platform
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Master Coding with <br className="hidden sm:inline" />
              <span className="text-primary">Interactive Hands-On</span>{" "}
              Experience
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
              Learn programming, build real-world projects, and get instant
              feedback with our modern interactive learning platform.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild className="gap-2 font-semibold">
                <Link href="/courses">
                  Browse Courses <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Get Started Free</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t mt-12">
              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl font-bold">10k+</h3>
                <p className="text-xs text-muted-foreground">Active Learners</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl font-bold">50+</h3>
                <p className="text-xs text-muted-foreground">Expert Courses</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl font-bold">98%</h3>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl font-bold">24/7</h3>
                <p className="text-xs text-muted-foreground">
                  Support & Mentorship
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Key Features Section */}
        <section className="py-16 md:py-24 container px-4 mx-auto">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              Everything you need to step up your coding journey from beginner
              to advanced software developer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-card space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Interactive Coding</h3>
              <p className="text-sm text-muted-foreground">
                Practice directly in your browser with instant code compilation
                and execution feedback.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Expert Instructors</h3>
              <p className="text-sm text-muted-foreground">
                Learn directly from industry professionals with real-world
                software engineering experience.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Verified Certificates</h3>
              <p className="text-sm text-muted-foreground">
                Earn shareable certificates upon course completion to showcase
                on your resume and LinkedIn.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Call to Action (CTA) Section */}
        <section className="py-16 bg-muted/30 border-y">
          <div className="container px-4 mx-auto text-center max-w-3xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Join thousands of students and start building real-world software
              projects today.
            </p>
            <Button size="lg" asChild className="font-semibold">
              <Link href="/register">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
