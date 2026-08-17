# AI StudyMate

<div align="center">

**Premium AI-powered learning platform for college students**

Upload notes · Ask AI · Generate quizzes · Track progress

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT-412991?logo=openai&logoColor=white)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## Overview

**AI StudyMate** is a production-ready full-stack SaaS application that helps college students learn smarter. Upload lecture notes, chat with an AI tutor, generate quizzes and flashcards, summarize documents, and receive personalized study recommendations — all in a polished, responsive interface.

### Why AI StudyMate?

| Challenge | Solution |
|-----------|----------|
| Information overload | AI-powered document summarization |
| Passive reading | Interactive quizzes with scoring |
| Forgotten concepts | Auto-generated flashcards |
| No study direction | Personalized AI recommendations |
| Scattered tools | All-in-one learning dashboard |

---

## Screenshots

> Dashboard with analytics charts, stat cards, and study recommendations.

---

## Features

### Core Learning
- **AI Chat** — Context-aware tutor with document reference support
- **Quiz Generator** — Multiple-choice quizzes with instant scoring
- **Flashcards** — Auto-generated from notes and PDFs
- **Document Summarizer** — Concise AI summaries of uploaded content
- **Study Recommendations** — Personalized tips based on your materials

### Platform
- **JWT Authentication** — Secure login and registration
- **Admin Panel** — User management and role control
- **Dark Mode** — System-wide theme toggle
- **Analytics Dashboard** — Charts, stat cards, and performance tracking

### Premium UX
- Skeleton loaders and animated loading states
- Toast notifications for all user actions
- Error boundaries with graceful recovery
- Custom 404 page
- SEO-optimized with Open Graph and Twitter cards
- WCAG accessibility (skip links, ARIA labels, focus states)
- Mobile bottom navigation and responsive layout
- Page transitions and micro-animations

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, Material UI 6, Framer Motion, Recharts |
| **Backend** | Node.js, Express.js, JWT, Multer |
| **Database** | MongoDB with Mongoose |
| **AI** | OpenAI GPT-4o-mini (with mock fallback) |
| **Deployment** | AWS App Runner (API) · Vercel (Frontend) |

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Client  │────▶│  Express API    │────▶│    MongoDB      │
│   (Vite + MUI)  │     │  (JWT + REST)   │     │   (Mongoose)    │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   OpenAI API    │
                        └─────────────────┘
```

---

## Project Structure

```
AI StudyMate/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/                # Axios client & interceptors
│   │   ├── components/
│   │   │   ├── charts/         # Recharts visualizations
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Layout.jsx      # Sidebar + mobile nav
│   │   │   ├── PageHeader.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── SEO.jsx
│   │   ├── context/            # Auth, Theme, Toast providers
│   │   ├── pages/              # Route pages
│   │   └── theme/              # MUI theme config
│   └── vercel.json
├── server/                     # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/           # OpenAI integration
│   └── apprunner.yaml
├── .env.example
└── README.md
```

---

## Quick Start

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **OpenAI API key** (optional — mock mode available)

### 1. Clone & Install

```bash
git clone <repository-url>
cd AI-StudyMate

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Environment Variables

```bash
cp .env.example server/.env
cp client/.env.example client/.env
```

**server/.env**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/aistudymate
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=sk-your-openai-key
CLIENT_URL=http://localhost:5173
```

**client/.env**
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Start MongoDB

```bash
mongod --dbpath /path/to/data
```

### 4. Run Development Servers

```bash
# Terminal 1 — API
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open **http://localhost:5173**

> **Note:** Port `5001` is used by default because macOS reserves port `5000` for AirPlay.

---

## API Reference

<details>
<summary><strong>Authentication</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Sign in |
| `GET` | `/api/auth/profile` | Get profile |
| `PUT` | `/api/auth/profile` | Update profile |
| `GET` | `/api/auth/dashboard` | Dashboard stats |

</details>

<details>
<summary><strong>Documents</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/documents` | List documents |
| `POST` | `/api/documents/note` | Create text note |
| `POST` | `/api/documents/upload` | Upload PDF/TXT |
| `POST` | `/api/documents/:id/summarize` | AI summary |
| `GET` | `/api/documents/recommendations` | Study tips |

</details>

<details>
<summary><strong>Quizzes · Chat · Flashcards</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/quizzes/generate` | Generate quiz |
| `POST` | `/api/quizzes/:id/submit` | Submit answers |
| `POST` | `/api/chat` | Send AI message |
| `POST` | `/api/flashcards/generate` | Generate flashcards |

</details>

---

## Deployment

### Backend — AWS App Runner

1. Push `server/` to your repository
2. Create App Runner service using `apprunner.yaml`
3. Set environment variables in the console

### Frontend — Vercel

1. Import `client/` directory
2. Set `VITE_API_URL` to your production API URL
3. Deploy

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | API port (default: 5001) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `OPENAI_API_KEY` | OpenAI API key | No |
| `CLIENT_URL` | Frontend URL for CORS | Yes |
| `VITE_API_URL` | Backend URL (client) | Yes |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Built with care for students everywhere.

**AI StudyMate** · © 2026

</div>
