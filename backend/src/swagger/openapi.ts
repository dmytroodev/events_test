export const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Events API',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  paths: {
    '/events': {
      get: {
        summary: 'List events',
        description: 'Returns a paginated list of upcoming events.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 10 },
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'dateFrom',
            in: 'query',
            schema: { type: 'string', format: 'date-time' },
          },
          {
            name: 'dateTo',
            in: 'query',
            schema: { type: 'string', format: 'date-time' },
          },
        ],
        responses: {
          200: {
            description: 'Paginated events list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          title: { type: 'string' },
                          date: { type: 'string', format: 'date-time' },
                          location: { type: 'string' },
                          shortDescription: { type: 'string' },
                        },
                        required: ['id', 'title', 'date', 'location', 'shortDescription'],
                      },
                    },
                    total: { type: 'integer', minimum: 0 },
                    page: { type: 'integer', minimum: 1 },
                    limit: { type: 'integer', minimum: 1 },
                    totalPages: { type: 'integer', minimum: 1 },
                  },
                  required: ['data', 'total', 'page', 'limit', 'totalPages'],
                },
                examples: {
                  default: {
                    summary: 'Example response',
                    value: {
                      data: [
                        {
                          id: '1',
                          title: 'Kyiv Tech Meetup',
                          date: '2026-04-10T18:00:00.000Z',
                          location: 'Kyiv',
                          shortDescription: 'Evening meetup for engineers and tech leads.',
                        },
                      ],
                      total: 10,
                      page: 1,
                      limit: 10,
                      totalPages: 1,
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid query parameters',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message:
                    '[{"property":"page","constraints":{"min":"page must not be less than 1"}}]',
                },
              },
            },
          },
        },
      },
    },
    '/events/{id}': {
      get: {
        summary: 'Get event by id',
        description: 'Returns full event information for a single event.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Event details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    date: { type: 'string', format: 'date-time' },
                    location: { type: 'string' },
                    shortDescription: { type: 'string' },
                    description: { type: 'string' },
                  },
                  required: ['id', 'title', 'date', 'location', 'shortDescription', 'description'],
                },
                example: {
                  id: '1',
                  title: 'Kyiv Tech Meetup',
                  date: '2026-04-10T18:00:00.000Z',
                  location: 'Kyiv',
                  shortDescription: 'Evening meetup for engineers and tech leads.',
                  description: 'Regular local meetup with short talks and open discussion.',
                },
              },
            },
          },
          404: {
            description: 'Event not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'Event not found',
                },
              },
            },
          },
        },
      },
    },
    '/events/{id}/register': {
      post: {
        summary: 'Register for event',
        description: 'Registers a participant for the selected event and enqueues a background job.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                },
                required: ['fullName', 'email', 'phone'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Registration successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                  required: ['success', 'message'],
                },
                example: {
                  success: true,
                  message: 'Registration successful',
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message:
                    '[{"property":"email","constraints":{"isEmail":"email must be an email"}}]',
                },
              },
            },
          },
          404: {
            description: 'Event not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'Event not found',
                },
              },
            },
          },
          409: {
            description: 'Duplicate registration',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                example: {
                  message: 'Registration already exists for this email',
                },
              },
            },
          },
        },
      },
    },
  },
};

