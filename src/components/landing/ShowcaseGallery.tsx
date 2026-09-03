import { AudioLines } from "lucide-react";
import { agents } from "@/data/agents";

export function ShowcaseGallery() {
  const tiles = [...agents, ...agents];
  const first = tiles.slice(0, 8);
  const second = tiles.slice(8, 16);

  return (
    <section className="group/gallery pb-8">
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-5">
        <div className="flex min-w-0 items-center gap-2">
          <AudioLines className="h-4 w-4 shrink-0 text-foreground" />
          <h2 className="truncate text-[13px] font-semibold">Active on AgentGrid</h2>
        </div>
      </div>

      <div id="showcase" className="mt-4 space-y-3 scroll-mt-28">
        <GalleryRow items={first} />
        <GalleryRow items={second} />
      </div>
    </section>
  );
}

function GalleryRow({ items }: { items: typeof agents }) {
  const rowItems = [...items, ...items];

  return (
    <div className="overflow-hidden px-5 pb-1">
      <div className="flex w-max will-change-transform animate-[marquee_60s_linear_infinite] group-hover/gallery:[animation-play-state:paused]">
        {rowItems.map((agent, index) => (
          <figure
            key={`${agent.id}-${index}`}
            className="group/tile relative mr-3 h-[110px] w-[150px] shrink-0 overflow-hidden rounded-[2px] bg-surface sm:h-[130px] sm:w-[180px]"
          >
            <img
              src={agent.thumbnail}
              alt={`${agent.name} output preview`}
              loading="lazy"
              width={768}
              height={768}
              className="h-full w-full object-cover transition-transform duration-500 group-hover/tile:scale-105"
            />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/85 to-transparent p-2 text-[11px] font-medium opacity-0 transition-opacity group-hover/tile:opacity-100">
              {agent.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
