# ✒ Inkwell — MERN Notes App

A full-stack, production-ready notes application built with **MongoDB, Express, React, and Node.js**.

![Stack](https://img.shields.io/badge/stack-MERN-amber) ![Auth](https://img.shields.io/badge/auth-JWT-blue) ![Styling](https://img.shields.io/badge/styling-TailwindCSS-38bdf8)

---

## ✨ Features

### Auth
- Register / login with **JWT** (7-day expiry)
- **bcrypt** password hashing (12 salt rounds)
- Token stored in `localStorage`; auto-logout on 401
- Protected routes on both frontend and backend

### Notes
- **Full CRUD** — create, read, update, delete
- **Pin notes** — pinned notes always float to the top
- **6 colour themes** per note card
- **7 categories** — Work, Personal, Study, Health, Finance, Ideas, Other
- **Real-time search** — debounced 400 ms query on title + content
- **Category filter** with live per-category counts
- Pagination-ready backend (page + limit query params)

### UI / UX
- Responsive **3-column → 2-column → 1-column** grid
- Mobile **sidebar drawer**
- Loading skeletons, empty states, confirm-before-delete
- Toast notifications (success / error)
- Dark editorial theme — *Playfair Display* + *DM Sans*

---

## 🗂 Folder Structure

```
notes-app/
├── docker-compose.yml
├── backend/
│   ├── server.js              # Express entry point
│   ├── .env.example
│   ├── Dockerfile
│   ├── config/
│   │   └── db.js              # Mongoose connection
│   ├── models/
│   │   ├── User.js            # bcrypt pre-save hook
│   │   └── Note.js            # text-index for search
│   ├── controllers/
│   │   ├── authController.js  # register · login · getMe
│   │   └── noteController.js  # CRUD + togglePin
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect
│   └── routes/
│       ├── authRoutes.js
│       └── noteRoutes.js
└── frontend/
    ├── index.html
    ├── vite.config.js         # proxies /api → :5000
    ├── tailwind.config.js
    ├── Dockerfile
    └── src/
        ├── main.jsx
        ├── App.jsx            # Router + Toaster + AuthProvider
        ├── index.css          # Tailwind + component layer
        ├── context/
        │   └── AuthContext.jsx
        ├── hooks/
        │   ├── useNotes.js
        │   └── useDebounce.js
        ├── services/
        │   ├── api.js         # Axios + interceptors
        │   ├── authService.js
        │   └── noteService.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── NoteCard.jsx
        │   ├── NoteModal.jsx
        │   ├── CategoryFilter.jsx
        │   ├── SearchBar.jsx
        │   ├── EmptyState.jsx
        │   ├── ProtectedRoute.jsx
        │   └── constants.js
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            └── DashboardPage.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### 1 · Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your_very_long_random_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm install
npm run dev        # nodemon · hot reload
```

### 2 · Frontend

```bash
cd frontend
npm install
npm run dev        # Vite · http://localhost:5173
```

### 3 · Docker (full stack)

```bash
# from project root
docker-compose up --build
```

Brings up **MongoDB + backend + frontend** in one command.

---

## 🔌 REST API Reference

### Auth  `BASE /api/auth`

| Method | Route        | Auth | Body                              | Description        |
|--------|--------------|------|-----------------------------------|--------------------|
| POST   | `/register`  | —    | `{ name, email, password }`       | Create account     |
| POST   | `/login`     | —    | `{ email, password }`             | Login, get JWT     |
| GET    | `/me`        | ✅   | —                                 | Get current user   |

### Notes  `BASE /api/notes`  *(all protected)*

| Method | Route        | Query params                   | Body                                          | Description         |
|--------|--------------|--------------------------------|-----------------------------------------------|---------------------|
| GET    | `/`          | `category`, `search`, `page`, `limit` | —                                    | List user's notes   |
| POST   | `/`          | —                              | `{ title, content, category, color, isPinned }` | Create note       |
| GET    | `/:id`       | —                              | —                                             | Get single note     |
| PUT    | `/:id`       | —                              | same as POST body                             | Full update         |
| DELETE | `/:id`       | —                              | —                                             | Delete note         |
| PATCH  | `/:id/pin`   | —                              | —                                             | Toggle pin          |

### Response shapes

**Auth success:**
```json
{
  "_id": "664...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Note object:**
```json
{
  "_id": "665...",
  "user": "664...",
  "title": "Meeting prep",
  "content": "Agenda items for Thursday...",
  "category": "Work",
  "color": "sky",
  "isPinned": true,
  "createdAt": "2025-06-01T10:00:00.000Z",
  "updatedAt": "2025-06-01T12:30:00.000Z"
}
```

**Notes list:**
```json
{
  "notes": [...],
  "total": 42,
  "page": 1,
  "pages": 3
}
```

**Error:**
```json
{ "message": "Human-readable error description." }
```

---

## 🔐 Security

- Passwords hashed with **bcrypt** (12 rounds)
- JWTs signed with `HS256`; checked on every protected request
- Notes are scoped to `user` — users can only access their own data
- Input validated server-side via `express-validator`
- Request body size capped at `10kb`
- CORS restricted to `CLIENT_URL` env var

---

## 🛠 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Database   | MongoDB + Mongoose                              |
| Backend    | Node.js · Express · JWT · bcryptjs             |
| Validation | express-validator                               |
| Frontend   | React 18 · React Router v6 · Axios             |
| Styling    | Tailwind CSS v3                                 |
| Build tool | Vite 5                                          |
| Toasts     | react-hot-toast                                 |
| Dates      | date-fns                                        |
| Container  | Docker + docker-compose                         |

---

## 🗺 Roadmap / Extensions

- [ ] Rich text editor (Tiptap / Slate)
- [ ] Note tags / labels
- [ ] Note sharing via public link
- [ ] Dark / light theme toggle
- [ ] Export notes as PDF / Markdown
- [ ] OAuth (Google login)
- [ ] MongoDB Atlas full-text search
- [ ] Rate limiting (express-rate-limit)
- [ ] Refresh token rotation

---

## 📄 License

MIT
