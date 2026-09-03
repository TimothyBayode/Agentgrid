import { useEffect, useState, type MouseEvent } from "react";
import { Link } from "@/lib/router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "Enterprise", href: "#enterprise" },
  { label: "Resources", href: "#resources" },
] as const;

const sectionIds = links.map((link) => link.href.slice(1));

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string, close = false) => {
    event.preventDefault();
    if (close) setOpen(false);
    setActiveSection(id);

    const section = document.getElementById(id);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const updateActiveSection = () => {
      const offset = 140;
      let current: string | null = null;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= offset) {
          current = section.id;
        }
      }

      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (isAtBottom) {
        current = sections[sections.length - 1]?.id ?? current;
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur-sm">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:py-5">
        <Logo />

        <nav className="hidden items-center gap-8 justify-self-center text-[13px] text-muted-foreground md:flex">
          {links.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) => scrollToSection(event, link.href.slice(1))}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group relative py-1 transition-colors",
                  isActive ? "text-[#FAC102]" : "hover:text-foreground",
                )}
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-[#FAC102] transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <Button
            asChild
            variant="pill"
            size="sm"
            className="hidden bg-[#FAC102] text-black hover:bg-[#FAC102]/90 sm:inline-flex"
          >
            <Link to="/auth">Get Started</Link>
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center border border-border text-foreground md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mx-5 mb-3 rounded-2xl border border-border bg-surface p-2 md:hidden">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(event) => scrollToSection(event, link.href.slice(1), true)}
              className={cn(
                "block rounded-[2px] px-4 py-3 text-sm transition-colors",
                activeSection === link.href.slice(1)
                  ? "text-[#FAC102]"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-[2px] bg-[#FAC102] px-4 py-3 text-center text-sm font-medium text-black"
          >
            Get Started
          </Link>
        </div>
      ) : null}
    </header>
  );
}
