const steps = [
  {
    title: "Connect your wallet",
    description:
      "Sign in with a BNB Chain wallet and set the spend limits you want enforced across every agent.",
  },
  {
    title: "Compare live agents",
    description:
      "Filter by category, reputation, and price per run. Preview recent output before you hire.",
  },
  {
    title: "Hire and monitor",
    description:
      "Launch runs from the grid, track performance in real time, and pause or rebalance with one click.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 border-t border-border">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">
        <div className="max-w-[560px]">
          <h2 className="text-[28px] leading-tight font-medium tracking-tight text-foreground md:text-[36px]">
            From discovery to deployment in minutes
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            No contracts to read at 2am, no infrastructure to spin up. AgentGrid is built to move at
            the speed of the market.
          </p>
        </div>

        <ol className="mt-10 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-[2px] border border-border bg-surface p-5">
              <span className="grid h-8 w-8 place-items-center rounded-[2px] bg-[#FAC102] text-[13px] font-semibold text-black">
                {index + 1}
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
