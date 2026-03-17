import { HttpError } from '../../shared/error-handler';
import { enqueueRegistrationJob } from '../../queue/registration.queue';
import { EventsRepository } from './events.repository';
import { GetEventsQueryDto } from './dto/get-events-query.dto';
import { RegisterEventDto } from './dto/register-event.dto';

export class EventsService {
  private readonly repository = new EventsRepository();

  getEvents(query: GetEventsQueryDto) {
    const limit = Math.min(Math.max(query.limit, 1), 100);

    if (query.dateFrom && query.dateTo) {
      const from = new Date(query.dateFrom).getTime();
      const to = new Date(query.dateTo).getTime();

      if (from > to) {
        throw new HttpError(400, 'dateFrom must not be later than dateTo');
      }
    }

    const { data, total } = this.repository.findMany({
      page: query.page,
      limit,
      search: query.search,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      total,
      page: query.page,
      limit,
      totalPages,
    };
  }

  getEventById(id: string) {
    const event = this.repository.findById(id);

    if (!event) {
      throw new HttpError(404, 'Event not found');
    }

    return event;
  }

  async registerForEvent(id: string, payload: RegisterEventDto) {
    const event = this.repository.findById(id);

    if (!event) {
      throw new HttpError(404, 'Event not found');
    }

    if (this.repository.hasRegistration(id, payload.email)) {
      throw new HttpError(409, 'Registration already exists for this email');
    }

    this.repository.addRegistration({
      eventId: id,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
    });

    await enqueueRegistrationJob({
      eventId: id,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
    });

    return {
      success: true,
      message: 'Registration successful',
    };
  }
}

