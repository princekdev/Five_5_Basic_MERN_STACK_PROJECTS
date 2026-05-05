# Taskr — MERN Todo App

A full-stack todo application built with MongoDB, Express, React, and Node.js. Features JWT authentication, per-user task management, search/filter, and a clean, responsive UI.

---

## Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React 18, Tailwind CSS, React Router v6, Axios, Context API |
| Backend   | Node.js, Express 4, MongoDB, Mongoose 8     |
| Auth      | JWT (jsonwebtoken), bcryptjs                |
| UX        | react-hot-toast, date-fns                   |

---

## Project Structure

```
taskr/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, getMe
│   │   └── taskController.js  # CRUD + stats + toggle
│   ├── middleware/
│   │   ├── auth.js            # JWT protect middleware
│   │   ├── errorHandler.js    # Global error handler
│   │   └── validation.js      # express-validator rules
│   ├── models/
│   │   ├── User.js            # User schema + bcrypt hook
│   │   └── Task.js            # Task schema with indexes
│   ├── routes/
│   │   ├── auth.js            # /api/auth/*
│   │   └── tasks.js           # /api/tasks/*
│   ├── .env.example
│   └── server.js              # Express app entry
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── FilterBar.jsx   # Search + filter chips
        │   ├── Navbar.jsx      # Top bar + user menu
        │   ├── ProtectedRoute.jsx
        │   ├── StatsBar.jsx    # Progress + counts
        │   ├── TaskCard.jsx    # Individual task row
        │   └── TaskModal.jsx   # Create/edit modal
        ├── context/
        │   ├── AuthContext.jsx # Auth state + actions
        │   └── TaskContext.jsx # Task state + actions
        ├── hooks/
        │   └── useDebounce.js  # Debounced search
        ├── pages/
        │   ├── Dashboard.jsx   # Main app view
        │   ├── Login.jsx
        │   └── Register.jsx
        ├── utils/
        │   └── api.js          # Axios instance + interceptors
        ├── App.jsx             # Routes
        └── index.css           # Tailwind + fonts
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone & Install

```bash
git clone https://github.com/yourname/taskr.git
cd taskr
npm run install:all
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskr
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Configure Frontend

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run in Development

From the root folder:
```bash
npm run dev
```

Or separately:
```bash
# Terminal 1
cd backend && npm run dev
and 
# Terminal 2
cd frontend && npm start
```

Frontend → http://localhost:3000  
Backend → http://localhost:5000

---

## API Reference

### Auth Routes (`/api/auth`)

| Method | Endpoint    | Access  | Description          |
|--------|-------------|---------|----------------------|
| POST   | `/register` | Public  | Create new user      |
| POST   | `/login`    | Public  | Login & get token    |
| GET    | `/me`       | Private | Get current user     |

### Task Routes (`/api/tasks`) — All Private

| Method | Endpoint        | Description                    |
|--------|-----------------|--------------------------------|
| GET    | `/`             | Get all tasks (filterable)     |
| GET    | `/stats`        | Get task count statistics      |
| GET    | `/:id`          | Get single task                |
| POST   | `/`             | Create new task                |
| PUT    | `/:id`          | Update task                    |
| PATCH  | `/:id/toggle`   | Toggle pending ↔ completed     |
| DELETE | `/:id`          | Delete task                    |

#### Query Parameters for `GET /api/tasks`

| Param    | Values                           | Description            |
|----------|----------------------------------|------------------------|
| status   | `pending`, `completed`           | Filter by status       |
| priority | `low`, `medium`, `high`          | Filter by priority     |
| search   | any string                       | Search title/description|
| sort     | `-createdAt`, `createdAt`, `title`, `-title` | Sort order |
| page     | number (default: 1)              | Pagination             |
| limit    | number (default: 20, max: 100)   | Items per page         |

---

## Deployment

### Backend → Railway / Render

1. Push to GitHub
2. Connect repo to [Railway](https://railway.app) or [Render](https://render.com)
3. Set environment variables from `.env.example`
4. Set `NODE_ENV=production`

### Frontend → Vercel / Netlify

1. Push frontend to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set `REACT_APP_API_URL` to your deployed backend URL
4. Deploy

### MongoDB → Atlas

1. Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Whitelist `0.0.0.0/0` for cloud deployment
3. Use the connection string as `MONGODB_URI`

---

## Features

- **JWT Authentication** — Secure register/login with token stored in localStorage
- **Per-user tasks** — Each user only sees their own tasks (enforced server-side)
- **CRUD operations** — Create, read, update, delete tasks
- **One-click toggle** — Instantly mark tasks complete/pending
- **Search** — Debounced full-text search across title and description
- **Filters** — Filter by status, priority; sort by date or name
- **Stats dashboard** — Progress bar + counts for total/pending/done
- **Loading skeletons** — Smooth loading states throughout
- **Error handling** — Global error boundary + toast notifications
- **Responsive** — Works on mobile, tablet, desktop
- **Protected routes** — Unauthorized users redirected to login

---

## Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT verified on every protected request
- Tokens expire after 7 days
- User can only access their own tasks
- Request body size limited to 10kb
- Input validation on both frontend and backend
- CORS configured per environment

---

## License

MIT
