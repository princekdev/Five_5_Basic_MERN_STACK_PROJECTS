# 🎬 CineVerse – MERN Stack Movie App

A full-stack movie discovery application built with MongoDB, Express, React, and Node.js, powered by the [TMDB API](https://www.themoviedb.org/documentation/api).

## ✨ Features

- **Search** movies by name with debounced input
- **Trending & Popular** movies on the homepage with a cinematic hero banner
- **Discover** movies filtered by genre, year, and sort order
- **Pagination** on all movie lists
- **Movie Detail Page** — poster, cast, trailer link, ratings, runtime, similar movies
- **Favourites** — save/remove movies per user, stored in MongoDB
- **JWT Authentication** — register, login, protected routes
- **Responsive UI** built with Tailwind CSS

## 📁 Project Structure 

```
movie-app/
├── backend/
│   ├── config/          # DB + TMDB client
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth + error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── auth/    # LoginForm, RegisterForm, ProtectedRoute
        │   ├── common/  # Spinner, Badge, Pagination, EmptyState
        │   ├── layout/  # Navbar, Layout
        │   └── movie/   # MovieCard, MovieGrid, SearchBar, FilterBar, HeroBanner
        ├── context/     # AuthContext, FavoritesContext
        ├── hooks/       # useMovies, useDebounce
        ├── pages/       # HomePage, SearchPage, DiscoverPage, MovieDetailPage, Favorites, Auth
        └── utils/       # api.js, constants.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- TMDB API key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### 1. Clone & Install

```bash
# Install all dependencies
npm run install:all
```

### 2. Configure Environment

**Backend** — copy and edit `backend/.env.example` → `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movieapp
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=7d
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Frontend** — copy and edit `frontend/.env.example` → `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

### 3. Run Development Servers

```bash
# Run both backend + frontend together
npm run dev

# Or separately:
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:3000
```

## 🌐 API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login + get JWT |
| GET | `/api/auth/me` | Private | Get current user |

### Movies (TMDB proxy)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/movies/trending` | Public | Trending this week |
| GET | `/api/movies/popular?page=1` | Public | Popular movies |
| GET | `/api/movies/search?query=batman&page=1` | Public | Search movies |
| GET | `/api/movies/discover?genre=28&year=2023` | Public | Filtered discover |
| GET | `/api/movies/genres` | Public | Genre list |
| GET | `/api/movies/:id` | Public | Full movie details |

### Favourites
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/favorites` | Private | Get user favourites |
| POST | `/api/favorites` | Private | Add to favourites |
| DELETE | `/api/favorites/:movieId` | Private | Remove favourite |
| GET | `/api/favorites/check/:movieId` | Private | Check if saved |

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Styling | Tailwind CSS, DM Sans font |
| State | React Context API + custom hooks |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| External API | TMDB (The Movie Database) |

## 📝 Notes

- TMDB image CDN is used directly from the frontend via `REACT_APP_TMDB_IMAGE_BASE`
- Rate limiting is applied to all `/api/*` routes (200 req / 15 min)
- All favourites operations require a valid JWT
- The frontend uses `proxy` in `package.json` for local development so no CORS issues
