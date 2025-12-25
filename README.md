# School ERP System

Full-stack School ERP System with React (Vite) frontend and Spring Boot backend.

## Tech Stack

- **Frontend**: React, Vite, React Router, Axios, Tailwind CSS, Recharts
- **Backend**: Spring Boot, Spring Security, JWT, JPA/Hibernate, MySQL

## Prerequisites

- Node.js 18+
- Java 17+
- MySQL 8+
- Maven

## Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE school_erp_system;
```

2. Update `backend/src/main/resources/application.properties` if needed:
   - Default: `root` / `managerr`

## Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Server runs on `http://localhost:8080`

Default admin: `admin` / `admin123` (created on first run if no users exist)

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

## Roles

- **ADMIN**: Full access. Creates teachers and students. Manages classes, fees, certificates, gamification.
- **EMPLOYEE (Teacher)**: Manages attendance, assignments, announcements. Limited dashboard.
- **STUDENT**: Personal dashboard, own attendance, assignments, fees, certificates, class leaderboard, chat.

## API Overview

- `POST /api/auth/login` - Login (returns token + role)
- `POST /api/auth/register` - Create user (ADMIN only)
- `GET /api/classes` - List classes
- `GET /api/students`, `GET /api/students/class/{className}`, `GET /api/students/me`
- `GET /api/employees`
- `POST /api/attendance` - Bulk attendance
- `GET /api/attendance/class/{className}`, `GET /api/attendance/me`
- `GET /api/assignments/class/{className}`
- `GET /api/announcements/class/{className}`
- `GET /api/fees`, `GET /api/fees/me`
- `GET /api/certificates`, `GET /api/certificates/me`
- `GET /api/gamification/class/{className}`
- `GET /api/chat/conversations`, `POST /api/chat`

All protected APIs require: `Authorization: Bearer <token>`
