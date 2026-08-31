# Message App

A full-stack messaging application built as part of The Odin Project's Node.js curriculum. Users can register, customize their profile, and send messages to other users in real-time-ish fashion (REST polling, no websockets).

## Features

- User authentication (register/login/logout) with hashed passwords
- Direct messages and group chats
- Image sharing in conversations
- Online status indicator
- Profile customization (bio, education, avatar)

## Tech Stack

**Backend:** Express, Prisma, PostgreSQL, express-session, bcrypt
**Frontend:** React, Vite, Tailwind CSS, React Router
**Testing:** Jest, SuperTest

## Live Demo

- Frontend: [link kon Vercel]
- Backend API: [link kon Render]

## Running Locally

### Backend
\`\`\`bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`