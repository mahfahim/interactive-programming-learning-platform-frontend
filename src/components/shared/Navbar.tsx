import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl">
          LMS Platform
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/courses" className="text-sm font-medium hover:underline">
            Courses
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
