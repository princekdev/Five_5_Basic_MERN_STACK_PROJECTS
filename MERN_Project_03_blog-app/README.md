# Inkwell — MERN Stack Blog Platform

A full-stack blog application built with MongoDB, Express, React, and Node.js featuring JWT authentication, full CRUD operations, and a clean editorial design.

---

## Project Structure 

```
blog-app/
├── backend/               # Express + MongoDB API
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js        # JWT protect middleware
│   ├── models/
│   │   ├── User.js        # User schema + bcrypt hashing
│   │   └── Post.js        # Post schema
│   ├── routes/
│   │   ├── auth.js        # /api/auth — register, login, me
│   │   └── posts.js       # /api/posts — CRUD
│   ├── .env.example
│   ├── package.json
│   └── server.js          # Express app entry
│
└── frontend/              # React SPA
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Alert.js
    │   │   ├── ConfirmDialog.js
    │   │   ├── Footer.js
    │   │   ├── LoadingSpinner.js
    │   │   ├── Navbar.js
    │   │   ├── Pagination.js
    │   │   ├── PostCard.js
    │   │   └── PostForm.js
    │   ├── context/
    │   │   └── AuthContext.js  # Global auth state + JWT helpers
    │   ├── pages/
    │   │   ├── Home.js         # Public post listing + search
    │   │   ├── PostDetail.js   # Single post view
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js    # User's own posts + stats
    │   │   ├── CreatePost.js
    │   │   ├── EditPost.js
    │   │   └── NotFound.js
    │   ├── utils/
    │   │   └── api.js          # Axios instance + interceptors
    │   ├── App.js
    │   ├── index.css           # Tailwind + custom styles
    │   └── index.js
    ├── package.json
    └── tailwind.config.js
```

---

## Quick Start

### Prerequisites

- Node.js v16+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1. Backend Setup

```bash
cd blog-app/backend
npm install

# Copy and configure environment variables
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogapp
JWT_SECRET=change_this_to_a_long_random_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Start the server:

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

The API will be running at `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd blog-app/frontend
npm install
npm start
```

The app will open at `http://localhost:3000`. The `"proxy": "http://localhost:5000"` in `package.json` forwards API calls automatically.

---

## API Reference

### Auth Routes (`/api/auth`)

| Method | Endpoint         | Access  | Description              |
|--------|-----------------|---------|--------------------------|
| POST   | `/register`     | Public  | Register new user        |
| POST   | `/login`        | Public  | Login + receive JWT      |
| GET    | `/me`           | Private | Get current user profile |

### Post Routes (`/api/posts`)

| Method | Endpoint         | Access  | Description                          |
|--------|-----------------|---------|--------------------------------------|
| GET    | `/`             | Public  | List all posts (paginated + search)  |
| GET    | `/my`           | Private | List authenticated user's posts      |
| GET    | `/:id`          | Public  | Get single post                      |
| POST   | `/`             | Private | Create new post                      |
| PUT    | `/:id`          | Private | Update post (owner only)             |
| DELETE | `/:id`          | Private | Delete post (owner only)             |

**Query parameters for GET `/api/posts`:**
- `page` — page number (default: 1)
- `limit` — posts per page (default: 10)
- `search` — full-text search query

---

## Features

- **JWT Authentication** — tokens stored in localStorage, attached via Axios interceptors
- **Protected Routes** — frontend guards redirect unauthenticated users; backend middleware validates tokens
- **Ownership Enforcement** — users can only edit/delete their own posts on both client and server
- **Auto Excerpt** — Mongoose pre-save hook auto-generates excerpts from content
- **Reading Time** — estimated read time calculated from word count
- **Pagination** — server-side pagination with smart ellipsis navigation
- **Full-text Search** — MongoDB text index on title + content
- **Password Strength** — visual indicator on registration
- **Responsive UI** — Tailwind CSS, works on all screen sizes

---

## Production Deployment

### Build the frontend

```bash
cd frontend
npm run build
```

Then serve the `build/` folder as static files from Express:

```js
// Add to server.js for production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}
```

### Environment

Set `NODE_ENV=production` and use a strong `JWT_SECRET` (32+ random characters). Use [MongoDB Atlas](https://www.mongodb.com/atlas) for a managed database.

---

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Database  | MongoDB + Mongoose ODM        |
| Backend   | Node.js, Express.js           |
| Auth      | JWT (jsonwebtoken) + bcryptjs |
| Frontend  | React 18, React Router v6     |
| HTTP      | Axios                         |
| Styling   | Tailwind CSS                  |
| Fonts     | Playfair Display, DM Sans     |
