import Link from "next/link";
import { getApiBaseUrl } from "@/lib/config";
import type {
  EventsSearchParams,
  PaginatedEventsResponse,
} from "@/app/events/types";

async function fetchEvents(searchParams: EventsSearchParams) {
  const apiBase = getApiBaseUrl();
  const url = new URL("/events", apiBase);

  const page = searchParams.page ?? "1";
  const search = searchParams.search ?? "";
  const dateFrom = searchParams.dateFrom ?? "";
  const dateTo = searchParams.dateTo ?? "";

  url.searchParams.set("page", page);
  url.searchParams.set("limit", "5");

  if (search.trim()) {
    url.searchParams.set("search", search.trim());
  }

  if (dateFrom) {
    url.searchParams.set("dateFrom", dateFrom);
  }

  if (dateTo) {
    url.searchParams.set("dateTo", dateTo);
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load events");
  }

  const data = (await response.json()) as PaginatedEventsResponse;
  return data;
}

function formatDate(isoDate: string) {
  const date = new Date(isoDate);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface EventsListProps {
  searchParams: EventsSearchParams;
}

export async function EventsList({ searchParams }: EventsListProps) {
  const data = await fetchEvents(searchParams);

  if (data.data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        No events matched your filters.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ul className="grid gap-4 md:grid-cols-2">
        {data.data.map((event) => (
          <li
            key={event.id}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-400/70 hover:shadow-md"
          >
            <Link href={`/events/${event.id}`}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-base font-semibold text-slate-900 group-hover:text-sky-700">
                    {event.title}
                  </h2>
                  <span className="text-sm text-slate-500">
                    {formatDate(event.date)}
                  </span>
                </div>
                <div className="text-sm text-slate-500">{event.location}</div>
                <p className="mt-1 text-sm text-slate-600">
                  {event.shortDescription}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-600">
        <span>
          Page {data.page} of {data.totalPages}
        </span>
        <div className="flex gap-2">
          <PaginationLink
            label="Previous"
            page={data.page - 1}
            disabled={data.page <= 1}
            searchParams={searchParams}
          />
          <PaginationLink
            label="Next"
            page={data.page + 1}
            disabled={data.page >= data.totalPages}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
}

interface PaginationLinkProps {
  label: string;
  page: number;
  disabled: boolean;
  searchParams: EventsSearchParams;
}

function PaginationLink({
  label,
  page,
  disabled,
  searchParams,
}: PaginationLinkProps) {
  if (disabled) {
    return (
      <span className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-400">
        {label}
      </span>
    );
  }

  const params = new URLSearchParams();

  params.set("page", String(page));

  if (searchParams.search) {
    params.set("search", searchParams.search);
  }

  if (searchParams.dateFrom) {
    params.set("dateFrom", searchParams.dateFrom);
  }

  if (searchParams.dateTo) {
    params.set("dateTo", searchParams.dateTo);
  }

  const href = `/events?${params.toString()}`;

  return (
    <Link
      href={href}
      className="rounded-full border border-slate-200 px-3 py-1 text-sm hover:bg-slate-100"
    >
      {label}
    </Link>
  );
}

