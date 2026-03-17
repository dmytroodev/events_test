import { notFound } from "next/navigation";
import { getApiBaseUrl } from "@/lib/config";
import type { EventDetails } from "../types";
import RegisterDialog from "@/app/events/[id]/register-dialog";
import Link from "next/link";

async function fetchEvent(id: string) {
  const apiBase = getApiBaseUrl();
  const url = new URL(`/events/${id}`, apiBase);

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load event");
  }

  const data = (await response.json()) as EventDetails;
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

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const event = await fetchEvent(resolvedParams.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
        >
          Back to events
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                {event.title}
              </h2>
              <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
                <span>{event.location}</span>
                <span className="text-slate-300">•</span>
                <span>{formatDate(event.date)}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            {event.description}
          </p>
        </div>
        <div>
          <RegisterDialog eventId={event.id} />
        </div>
      </div>
    </div>
  );
}

