# Frontend Setup (Microservices Project)

This README contains setup instructions only for the frontend app in this microservices project.

## Services Used by Frontend

- Shop Service
- Product Service
- Review Service
- Cart Service

## Prerequisites

- Node.js 20+
- npm 10+
- All required backend services running and reachable

## 1) Clone and move to frontend

```bash
cd web
```

## 2) Install dependencies

```bash
npm install
```

## 3) Configure environment

Create a local env file from the example:

```bash
cp .env.example .env
```

Update `.env`:

```env
VITE_SERVER=http://localhost:<PORT>
```

`VITE_SERVER` must point to the API base URL used by the frontend (gateway or backend host) that exposes routes for:

- `/shops`
- `/products`
- `/reviews`
- `/cart`

## 4) Start required backend services

Before running the frontend, start these services:

1. Shop Service
2. Product Service
3. Review Service
4. Cart Service

Run each service using its own README/setup steps and ensure they are healthy.

## 5) Run frontend in development

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## 6) Build for production

```bash
npm run build
```

## 7) Preview production build

```bash
npm run preview
```
