import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Interactive Learning Platform. All
          rights reserved.
        </p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};
