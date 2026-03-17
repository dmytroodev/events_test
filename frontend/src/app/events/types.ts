export interface EventSummary {
  id: string;
  title: string;
  date: string;
  location: string;
  shortDescription: string;
}

export interface EventDetails extends EventSummary {
  description: string;
}

export interface PaginatedEventsResponse {
  data: EventSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventsSearchParams {
  page?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}


