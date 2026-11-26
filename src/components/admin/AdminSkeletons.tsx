export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" role="status" aria-label="Loading dashboard">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-44 bg-stone-200 rounded-lg" />
          <div className="h-4 w-64 bg-stone-200/70 rounded-lg" />
        </div>
        <div className="h-11 w-36 bg-stone-200 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-white border border-stone-200 p-5 space-y-3">
            <div className="h-3.5 w-24 bg-stone-200 rounded" />
            <div className="h-8 w-20 bg-stone-200 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 rounded-2xl bg-white border border-stone-200" />
        <div className="h-64 rounded-2xl bg-white border border-stone-200" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" role="status" aria-label="Loading products">
      <div className="flex items-center justify-between gap-4">
        <div className="h-8 w-40 bg-stone-200 rounded-lg" />
        <div className="h-11 w-36 bg-stone-200 rounded-xl" />
      </div>
      <div className="h-12 w-full bg-white border border-stone-200 rounded-xl" />
      <div className="rounded-2xl bg-white border border-stone-200 divide-y divide-stone-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-stone-200 rounded" />
              <div className="h-3 w-32 bg-stone-100 rounded" />
            </div>
            <div className="h-8 w-16 bg-stone-200 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrdersSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" role="status" aria-label="Loading orders">
      <div className="h-8 w-36 bg-stone-200 rounded-lg" />
      <div className="h-12 w-full bg-white border border-stone-200 rounded-xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-white border border-stone-200 p-5 space-y-3">
            <div className="flex justify-between">
              <div className="h-5 w-32 bg-stone-200 rounded" />
              <div className="h-6 w-20 bg-stone-200 rounded-full" />
            </div>
            <div className="h-4 w-64 bg-stone-100 rounded" />
            <div className="h-12 w-full bg-stone-50 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-2xl" role="status" aria-label="Loading form">
      <div className="h-8 w-52 bg-stone-200 rounded-lg" />
      <div className="rounded-2xl bg-white border border-stone-200 p-6 space-y-5">
        <div className="h-12 w-full bg-stone-100 rounded-xl" />
        <div className="h-12 w-full bg-stone-100 rounded-xl" />
        <div className="h-28 w-full bg-stone-100 rounded-xl" />
        <div className="h-12 w-40 bg-stone-200 rounded-xl" />
      </div>
    </div>
  );
}
