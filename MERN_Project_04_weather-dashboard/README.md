# 🌤️ Nimbus — MERN Weather Dashboard

A full-stack weather dashboard built with MongoDB, Express, React, and Node.js. Search cities worldwide, view real-time weather conditions, 5-day forecasts, and save your search history.

## ✨ Features

- 🔍 **City search** with autocomplete (OpenWeather Geo API)
- 📍 **Geolocation** — detect your current location
- 🌡️ **Real-time weather** — temp, humidity, wind, pressure, visibility
- 📅 **5-day forecast** with precipitation chance
- 📈 **Temperature trend chart** (SVG, no dependencies)
- 🧭 **Wind compass** with live direction
- ☀️ **Sun arc** showing daylight progress
- 🗺️ **Interactive weather map** (OpenWeatherMap tiles)
- 🕒 **Search history** (MongoDB, per-user, auto-dedup)
- 🔐 **JWT authentication** — register/login
- 🌗 **Dynamic backgrounds** — change with weather conditions
- ℃/℉ **Unit toggle** — metric and imperial
- 📱 **Fully responsive** — mobile-first design

## 🛠️ Tech Stack
 
| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Tailwind CSS, Axios, React Router |
| Backend   | Node.js, Express 4, Mongoose            |
| Database  | MongoDB                                 |
| Auth      | JWT + bcryptjs                          |
| API       | OpenWeatherMap (Current + Forecast + Geo + Air Quality) |
| Design    | Google Fonts (Syne + DM Sans + DM Mono) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenWeatherMap API key (free at openweathermap.org)

### 1. Clone & install
```bash
git clone <repo>
cd weather-dashboard

# Backend
cd backend && npm install
cp .env.example .env   # fill in your values

# Frontend
cd ../frontend && npm install
cp .env.example .env
```

### 2. Configure environment

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weather_dashboard
JWT_SECRET=your_long_random_secret_here
OPENWEATHER_API_KEY=your_openweather_api_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**frontend/.env**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run
```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm start
```

Open http://localhost:3000

## 📁 Folder Structure

```
weather-dashboard/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login, getMe
│   │   └── weatherController.js  # Weather + history CRUD
│   ├── middleware/
│   │   ├── auth.js               # JWT protect + optionalAuth
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── User.js               # User schema + bcrypt
│   │   └── SearchHistory.js      # History + smart dedup
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── weatherRoutes.js
│   └── server.js
│
└── frontend/src/
    ├── components/
    │   ├── AuthModal.jsx         # Login/register modal
    │   ├── BackgroundScene.jsx   # Dynamic weather backgrounds
    │   ├── CurrentWeather.jsx    # Main weather card + stats
    │   ├── Dashboard.jsx         # Layout + WindCompass + SunArc
    │   ├── EmptyState.jsx        # Welcome / no data state
    │   ├── ForecastCard.jsx      # 5-day forecast grid
    │   ├── HourlyChart.jsx       # SVG temperature trend
    │   ├── Navbar.jsx            # Top navigation + auth controls
    │   ├── SearchBar.jsx         # Search + autocomplete + geo
    │   ├── SearchHistory.jsx     # History list with delete
    │   ├── WeatherMap.jsx        # OWM interactive map
    │   └── UnitToggle.jsx        # °C / °F toggle
    ├── context/
    │   ├── AuthContext.js        # User auth state
    │   └── WeatherContext.js     # Weather + history state
    ├── hooks/
    │   ├── useDebounce.js
    │   └── useGeolocation.js
    ├── services/api.js           # Axios instance + interceptors
    └── utils/weatherUtils.js    # Formatters, gradients, helpers
```

## 🌐 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Get current user (protected) |

### Weather
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/weather/current?city= | Current weather |
| GET | /api/weather/forecast?city= | 5-day forecast |
| GET | /api/weather/search?q= | City autocomplete |
| GET | /api/weather/history | Search history (protected) |
| DELETE | /api/weather/history/:id | Delete one item (protected) |
| DELETE | /api/weather/history | Clear all history (protected) |

## 🐳 Docker (optional)

```bash
docker-compose up --build
```

## 📝 License
MIT
