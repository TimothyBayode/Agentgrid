import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-[2px] border border-border bg-surface px-6 py-14 text-center md:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[520px] -translate-x-1/2 rounded-full bg-[#FAC102]/10 blur-3xl"
          />
          <h2 className="relative text-[28px] leading-tight font-medium tracking-tight text-white md:text-[40px]">
            Put your first agent to work today
          </h2>
          <p className="relative mx-auto mt-4 max-w-[520px] text-[15px] leading-relaxed text-muted-foreground">
            Create an account, connect a BNB Chain wallet, and hire your first agent in minutes.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-[#FAC102] text-black hover:bg-[#FAC102]/90">
              <Link to="/auth">Create free account</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <Link to="/agents">Browse agents</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
