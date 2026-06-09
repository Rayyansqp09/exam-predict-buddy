
import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const publicLinks = [
  { label: "Features", href: "/#features" },
  { label: "Courses", href: "/#courses" },
  { label: "Articles", href: "/articles" },
  { label: "Join the community", href: "/#Channels" },
  { label: "How it works", href: "/#how" },
  { label: "FAQ", href: "/#faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const adminLinks = [
  { label: "Admin", href: "/admin" },
  { label: "Dashboard", href: "/admin-dashboard" },
  { label: "Articles", href: "/admin/articles" },
];

export function Header({
  admin = false,
}: {
  admin?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const navLinks = admin
    ? adminLinks
    : publicLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
            <GraduationCap className="h-5 w-5" />
          </span>

          <span className="font-display text-base font-bold tracking-tight">
            {admin ? "FYUGP HUB ADMIN" : "FYUGP HUB"}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          {admin ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                await fetch("/api/admin/logout", {
                  method: "POST",
                });

                window.location.href = "/";
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-gradient-primary shadow-soft hover:opacity-95"
            >
              <Link to="/select">
                Buy Now
              </Link>
            </Button>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open
            ? <X className="h-6 w-6" />
            : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}

            {admin ? (
              <Button
                className="mt-2 w-full"
                variant="destructive"
                onClick={async () => {
                  await fetch("/api/admin/logout", {
                    method: "POST",
                  });

                  window.location.href = "/";
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                asChild
                className="mt-2 w-full bg-gradient-primary"
              >
                <Link
                  to="/select"
                  onClick={() => setOpen(false)}
                >
                  Buy Now
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
