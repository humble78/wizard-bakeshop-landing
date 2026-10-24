import { cn, createRandom, round } from "@/lib/utils";

interface StarfieldProps {
  count?: number;
  seed?: number;
  className?: string;
}

/** Twinkling stars. Pure CSS, so it can render on the server. */
export function Starfield({ count = 80, seed = 101, className }: StarfieldProps) {
  const rand = createRandom(seed);
  const stars = Array.from({ length: count }, (_, id) => ({
    id,
    left: round(rand() * 100),
    top: round(rand() * 100),
    size: round(0.8 + rand() * 2),
    delay: round(rand() * 5),
    duration: round(2.5 + rand() * 4),
  }));

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute animate-twinkle rounded-full bg-parchment-50 motion-reduce:animate-none"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: star.size > 2.2 ? "0 0 6px 1px rgba(251,245,230,0.7)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
