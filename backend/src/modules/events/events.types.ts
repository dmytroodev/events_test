export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  shortDescription: string;
  description: string;
}

export interface EventSummary {
  id: string;
  title: string;
  date: string;
  location: string;
  shortDescription: string;
}

export interface EventRegistration {
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

