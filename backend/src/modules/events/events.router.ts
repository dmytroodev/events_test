import { Router, Request, Response, NextFunction } from 'express';
import { EventsService } from './events.service';
import { validateBody, validateParams, validateQuery } from '../../shared/validation';
import { GetEventsQueryDto } from './dto/get-events-query.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { EventIdParamDto } from './dto/event-id-param.dto';

export const eventsRouter = Router();

const service = new EventsService();

eventsRouter.get(
  '/',
  validateQuery(GetEventsQueryDto),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as GetEventsQueryDto;
      const result = service.getEvents(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

eventsRouter.get(
  '/:id',
  validateParams(EventIdParamDto),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params as unknown as EventIdParamDto;
      const event = service.getEventById(params.id);
      res.json(event);
    } catch (error) {
      next(error);
    }
  },
);

eventsRouter.post(
  '/:id/register',
  validateParams(EventIdParamDto),
  validateBody(RegisterEventDto),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params as unknown as EventIdParamDto;
      const body = req.body as RegisterEventDto;
      const result = await service.registerForEvent(params.id, body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
);

