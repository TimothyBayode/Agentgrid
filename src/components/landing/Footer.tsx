import { Link } from "@/lib/router";
import { Logo } from "@/components/navigation/Logo";

const productLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "X", href: "https://x.com", external: true },
  { label: "Instagram", href: "https://www.instagram.com", external: true },
  { label: "BSC Explorer", href: "https://bscscan.com", external: true },
] as const;

const startLinks = [
  { label: "Create account", to: "/auth" },
  { label: "Browse agents", to: "/agents" },
  { label: "Back to top", href: "#top" },
];

function getCurrentYear() {
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[320px] text-[13px] leading-relaxed text-muted-foreground">
            Discover and hire AI agents that work for you. Compare capabilities, reputation and
            performance, then put the right agent to work on the{" "}
            <span className="text-[#FAC102]">BNB Chain</span>
          </p>
        </div>

        <nav aria-label="Product" className="grid content-start gap-2 text-[13px]">
          <p className="mb-1 text-[12px] font-semibold tracking-wide text-foreground uppercase">
            Product
          </p>
          {productLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...("external" in link ? { target: "_blank", rel: "noreferrer" } : undefined)}
              className="text-muted-foreground transition-colors hover:text-[#FAC102]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <nav aria-label="Get started" className="grid content-start gap-2 text-[13px]">
          <p className="mb-1 text-[12px] font-semibold tracking-wide text-foreground uppercase">
            Get started
          </p>
          {startLinks.map((link) =>
            "to" in link ? (
              <Link
                key={link.label}
                to={link.to}
                className="text-muted-foreground transition-colors hover:text-[#FAC102]"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-[#FAC102]"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-5 py-5 text-[12px] text-muted-foreground">
          <p>© {getCurrentYear()} AgentGrid. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
