import { Suspense } from "react";
import type { EventsSearchParams } from "@/app/events/types";
import { EventsList } from "@/app/events/_components/EventsList";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<EventsSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="space-y-5">
      <form className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <div className="flex min-w-[180px] flex-1 flex-col gap-1">
          <label htmlFor="search" className="text-slate-700">
            Search
          </label>
          <input
            id="search"
            name="search"
            defaultValue={resolvedSearchParams.search ?? ""}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-0 focus:border-sky-400 focus:ring-1 focus:ring-sky-300"
            placeholder="Search by title"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="dateFrom" className="text-slate-700">
            From
          </label>
          <input
            id="dateFrom"
            name="dateFrom"
            type="date"
            defaultValue={resolvedSearchParams.dateFrom ?? ""}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-0 focus:border-sky-400 focus:ring-1 focus:ring-sky-300"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="dateTo" className="text-slate-700">
            To
          </label>
          <input
            id="dateTo"
            name="dateTo"
            type="date"
            defaultValue={resolvedSearchParams.dateTo ?? ""}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-0 focus:border-sky-400 focus:ring-1 focus:ring-sky-300"
          />
        </div>
        <button
          type="submit"
          className="h-9 rounded-full bg-sky-500 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-sky-400"
        >
          Apply
        </button>
      </form>

      <Suspense
        key={JSON.stringify(resolvedSearchParams)}
        fallback={
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                >
                  <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                  <div className="mb-1 h-3 w-1/3 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-200" />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-400">
              <div className="h-6 w-32 rounded-full bg-slate-100" />
            </div>
          </div>
        }
      >
        <EventsList searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}

