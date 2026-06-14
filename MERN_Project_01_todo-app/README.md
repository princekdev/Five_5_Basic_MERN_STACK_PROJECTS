# Taskr — Production-Ready MERN Task Management Application

A modern full-stack task management platform built with the MERN stack, featuring secure JWT authentication, user-specific task management, advanced filtering, analytics, and a responsive user experience.

### Live Demo

🚀 https://five-5-basic-mern-stack-projects.vercel.app

---

## Overview

Taskr is a production-ready task management application designed to demonstrate full-stack development best practices, including authentication, RESTful API design, database modeling, state management, and responsive UI development.

The application enables users to securely manage their personal tasks with features such as task creation, editing, completion tracking, search, filtering, statistics, and protected routes.

---

## Key Highlights

* Secure JWT Authentication & Authorization
* User-Specific Task Isolation
* Complete CRUD Operations
* Advanced Search & Filtering
* Task Statistics Dashboard
* Responsive Mobile-First Design
* RESTful API Architecture
* MongoDB Atlas Integration
* Protected Routes & Middleware
* Production Deployment on Vercel & Render

---

## Live Application

Frontend:
https://five-5-basic-mern-stack-projects.vercel.app

Backend API:
https://todo-app-backend-x37x.onrender.com/api

---

## Core Features

### Authentication System

* User Registration
* Secure Login
* JWT-Based Authentication
* Password Hashing using bcrypt
* Persistent User Sessions

### Task Management

* Create Tasks
* Update Tasks
* Delete Tasks
* Toggle Task Status
* View Individual Tasks
* User-Specific Data Access

### Search & Filtering

* Search by Title or Description
* Filter by Status
* Filter by Priority
* Sort by Date or Title
* Pagination Support

### Analytics Dashboard

* Total Tasks Count
* Completed Tasks Count
* Pending Tasks Count
* Progress Tracking

### User Experience

* Responsive Design
* Loading States
* Toast Notifications
* Protected Navigation
* Clean Modern Interface

---

## Architecture

Frontend:

* React 18
* React Router v6
* Context API
* Axios
* Tailwind CSS

Backend:

* Node.js
* Express.js
* MongoDB
* Mongoose

Security:

* JWT Authentication
* bcrypt Password Hashing
* Protected API Routes
* Input Validation
* CORS Protection

Deployment:

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

---
## Project Structure  
## Project Structure

taskr/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        ├── utils/
        ├── App.jsx
        └── index.css

The project follows a scalable full-stack architecture with clear separation of concerns across frontend, backend, business logic, middleware, API routes, and database models.


## Production Features

* Centralized Error Handling
* Environment-Based Configuration
* REST API Architecture
* Database Indexing
* Authentication Middleware
* Request Validation
* Secure Password Storage
* Scalable Folder Structure
* Cloud Database Integration
* Production Deployment Ready

---

## Why This Project?

This project demonstrates practical experience with:

* Full-Stack MERN Development
* Authentication & Authorization
* API Development
* Database Design
* State Management
* Deployment & DevOps Fundamentals
* Production-Level Project Structure
* Real-World CRUD Application Development

---

## License

MIT License
