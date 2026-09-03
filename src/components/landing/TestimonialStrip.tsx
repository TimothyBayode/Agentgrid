const avatars = [
  "oklch(0.62 0.19 255)",
  "oklch(0.68 0.15 162)",
  "oklch(0.7 0.19 20)",
  "oklch(0.75 0.16 95)",
];

export function TestimonialStrip() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-3 px-5 py-16">
        <div className="flex shrink-0 -space-x-2">
          {avatars.map((tint) => (
            <span
              key={tint}
              className="h-6 w-6 rounded-full border-2 border-background"
              style={{ backgroundColor: tint }}
              aria-hidden
            />
          ))}
        </div>
        <p className="min-w-0 text-[13px] text-muted-foreground">
          <span className="text-foreground/90">
            &ldquo;AgentGrid made our on-chain ops faster and far cheaper.&rdquo;
          </span>{" "}
          Lim Myungjin, Protocol Lead
        </p>
      </div>
    </section>
  );
}
