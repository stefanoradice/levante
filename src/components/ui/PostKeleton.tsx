export function PostsSkeleton() {
  return (
    <section>
      <div className="h-8 w-48 bg-background-secondary rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-card-border bg-card overflow-hidden"
          >
            <div className="aspect-video bg-background-secondary animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-20 bg-background-secondary rounded animate-pulse" />
              <div className="h-5 bg-background-secondary rounded animate-pulse" />
              <div className="h-4 bg-background-secondary rounded animate-pulse w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
