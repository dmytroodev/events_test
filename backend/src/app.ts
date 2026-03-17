import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { eventsRouter } from './modules/events/events.router';
import { errorHandler } from './shared/error-handler';
import { openApiDocument } from './swagger/openapi';

export const app = express();

app.use(cors());
app.use(json());

app.use('/events', eventsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(errorHandler);

