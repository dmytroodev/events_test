## Events

### Backend

### Requirements

- Node.js 18
- Redis running locally on port `6379` (for BullMQ queue)

Example Redis:

```bash
docker run --name redis -p 6379:6379 redis:7
```

### Install dependencies

```bash
cd backend
npm install
```

### Run in development

```bash
cd backend
npm run dev
```

API will be available at `http://localhost:3000`.

### Main endpoints

- `GET /events`
  - Query: `page`, `limit`, `search`, `dateFrom`, `dateTo`
  - Returns paginated list of events:
    - `data[]`: `id`, `title`, `date`, `location`, `shortDescription`
    - `total`, `page`, `limit`, `totalPages`

- `GET /events/:id`
  - Returns single event:
    - `id`, `title`, `date`, `location`, `shortDescription`, `description`
  - `404` if event not found.

- `POST /events/:id/register`
  - Body:
    - `fullName` (string, required)
    - `email` (valid email, required)
    - `phone` (string, required)
  - `201` on success:
    - `{ "success": true, "message": "Registration successful" }`
  - Also enqueues BullMQ job with registration data.

### Swagger / OpenAPI

OpenAPI docs are available at:
- `http://localhost:3000/docs`


### Frontend

### Requirements

- Node.js 18+
- Backend API running on `http://localhost:3000` (from the root `npm run dev`)

### Install dependencies

```bash
cd frontend
npm install
```

### Run in development

```bash
cd frontend
npm run dev
```

The app will be available on `http://localhost:3001`, or `3000` if free.



