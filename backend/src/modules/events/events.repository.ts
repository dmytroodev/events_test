import { events } from './events.data';
import { Event, EventRegistration, EventSummary } from './events.types';

const registrations: EventRegistration[] = [];

export interface FindEventsParams {
  page: number;
  limit: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedEvents {
  data: EventSummary[];
  total: number;
}

export class EventsRepository {
  findMany(params: FindEventsParams): PaginatedEvents {
    const { page, limit, search, dateFrom, dateTo } = params;

    let filtered = [...events];

    if (search) {
      const normalizedSearch = search.trim().toLowerCase();
      filtered = filtered.filter((event) => event.title.toLowerCase().includes(normalizedSearch));
    }

    if (dateFrom) {
      const fromTime = new Date(dateFrom).getTime();
      filtered = filtered.filter((event) => new Date(event.date).getTime() >= fromTime);
    }

    if (dateTo) {
      const toTime = new Date(dateTo).getTime();
      filtered = filtered.filter((event) => new Date(event.date).getTime() <= toTime);
    }

    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const pageItems = filtered.slice(startIndex, startIndex + limit);

    const summaries: EventSummary[] = pageItems.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      location: event.location,
      shortDescription: event.shortDescription,
    }));

    return { data: summaries, total };
  }

  findById(id: string): Event | undefined {
    return events.find((event) => event.id === id);
  }

  hasRegistration(eventId: string, email: string): boolean {
    return registrations.some(
      (registration) => registration.eventId === eventId && registration.email === email,
    );
  }

  addRegistration(payload: Omit<EventRegistration, 'createdAt'>): EventRegistration {
    const record: EventRegistration = {
      ...payload,
      createdAt: new Date().toISOString(),
    };

    registrations.push(record);
    return record;
  }
}

