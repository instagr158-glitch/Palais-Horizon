/** Loading placeholders shown while the live listings are being fetched
 * (streamed in via Suspense), so the page shell paints instantly instead of
 * staying blank for the several seconds the scrape can take. */

export function HeroSkeleton() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-ink sm:items-center">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-ink-panel to-ink" />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-24 sm:px-8 sm:pb-24">
        <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
        <div className="mt-5 h-12 w-full max-w-xl animate-pulse rounded-lg bg-white/10 sm:h-16" />
        <div className="mt-3 h-8 w-2/3 max-w-sm animate-pulse rounded-lg bg-white/10" />
        <div className="mt-9 h-12 w-44 animate-pulse rounded-full bg-white/10" />
      </div>
    </section>
  );
}

export function CatalogSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div>
      <div className="-mx-4 border-y border-white/5 bg-ink/80 px-4 py-3 sm:-mx-6 sm:px-6">
        <div className="mx-auto h-8 max-w-6xl animate-pulse rounded-full bg-white/5" />
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="aspect-[4/5] w-full animate-pulse rounded-3xl bg-ink-panel" />
        ))}
      </div>
    </div>
  );
}
