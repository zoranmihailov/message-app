# Message App

A full-stack real-time messaging application with user authentication, direct messages, group chats, and image sharing.

## Live Demo

- **App:** [https://message-app-five-mu.vercel.app](https://message-app-five-mu.vercel.app)
- **Backend API:** [https://message-app-backend-ix41.onrender.com](https://message-app-backend-ix41.onrender.com)

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 10-30 seconds to respond while the server wakes up.

## Features

- User registration and login with JWT-based authentication
- One-on-one and group chats
- Real-time-style messaging with text and image support
- Editable user profiles (name, bio, education, profile picture)
- Persistent sessions across page refreshes (via stored JWT)

## Tech Stack

**Frontend**
- React 19
- React Router 7
- Vite
- Tailwind CSS 4

**Backend**
- Node.js / Express 5
- Prisma ORM 7
- PostgreSQL
- JSON Web Tokens (jsonwebtoken) for authentication
- bcrypt for password hashing

**Infrastructure**
- [Neon](https://neon.com) — managed PostgreSQL database
- [Render](https://render.com) — backend hosting
- [Vercel](https://vercel.com) — frontend hosting

**Testing**
- Jest
- Supertest

## Architecture

The frontend and backend are deployed separately as independent services and communicate over a REST API. Authentication is handled with stateless JWTs (sent via the `Authorization: Bearer <token>` header) rather than session cookies, since the frontend and backend live on different domains.

```
client/   → React app (Vite), deployed to Vercel
server/   → Express API, deployed to Render
```

## Getting Started Locally

### Prerequisites

- Node.js
- A PostgreSQL database (local or hosted, e.g. Neon)

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/zoranmihailov/message-app.git
   cd message-app
   ```

2. Install dependencies for both apps
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. Configure environment variables

   In `server/.env`:
   ```
   DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>
   SESSION_SECRET=<any random string>
   JWT_SECRET=<any random string>
   FRONTEND_URL=http://localhost:5173
   ```

   In `client/.env` (optional — defaults to `http://localhost:5000/api` if omitted):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Run database migrations
   ```bash
   cd server
   npx prisma migrate deploy
   ```

5. Start both apps (in separate terminals)
   ```bash
   # Terminal 1 — backend
   cd server
   npm run dev

   # Terminal 2 — frontend
   cd client
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173)

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Get the current user's profile |
| GET | `/api/profiles` | List all profiles |
| GET | `/api/profiles/:id` | Get a single profile |
| PATCH | `/api/profiles/:id` | Update your own profile |
| GET | `/api/chats` | List the current user's chats |
| POST | `/api/chats` | Create a new chat (1-on-1 or group) |
| GET | `/api/chats/:chatId` | Get a chat and its messages |
| POST | `/api/chats/:chatId/messages` | Send a message in a chat |

All routes except register/login require an `Authorization: Bearer <token>` header.

## Deployment

- **Database:** Neon (PostgreSQL)
- **Backend:** Render — auto-deploys from the `server` directory on push to `main`
- **Frontend:** Vercel — auto-deploys from the `client` directory on push to `main`

## Author

[zoranmihailov](https://github.com/zoranmihailov)