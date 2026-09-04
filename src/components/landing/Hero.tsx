import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-[1200px] px-5 pt-10 pb-10 md:pt-16 md:pb-14">
      <div className="grid items-start gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
        <div>
          <h1 className="mt-6 text-[38px] leading-[1.05] font-medium tracking-tight sm:text-[52px] md:text-[60px]">
            <span className="font-semibold text-[#FAC102]">Discover &amp; Hire</span>
            <br />
            <span className="text-white">on BNB Chain</span>
          </h1>
        </div>

        <div className="md:pt-14">
          <p className="max-w-[380px] text-[15px] leading-relaxed text-muted-foreground">
            Find autonomous agents built to trade, optimize yields, monitor positions, rebalance
            portfolios and get work done. Explore their capabilities, compare performance and hire
            the right agent all in one place.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="bg-white text-black hover:bg-white/90"
            >
              <Link to="/agents">Explore Agents</Link>
            </Button>
            <Button asChild variant="soft" size="lg">
              <Link to="/auth">List an Agent</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
