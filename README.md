# SupportIQ - Premium AI-Powered Support Dashboard

SupportIQ is a high-end, visual-first AI chat application engineered for professional support environments. It combines a **Liquidmorphic/Glassmorphism UI** with a robust **NestJS/PostgreSQL** backend, leveraging **Google Gemini AI** for intelligent, context-aware conversations.

---

## 🚀 Quick Start (Fresh Clone)


## 🌀 Clone the Repository

Clone the SupportIQ repository from GitHub:

```bash
git clone https://github.com/mdimamhosen/SupportIQ.git
cd SupportIQ
```

---

Get the full stack running in minutes with these four steps:

### 1. Prerequisites
- **Node.js** (v18+)
- **Docker** (for the database)

### 2. Installation
From the root directory, install all dependencies (Root, Server, and Client) in one command:
```bash
npm run setup
```

### 3. Configuration
Create a `.env` file in the root directory and copy the template from `.env.example`:
```bash
cp .env.example .env
```
Ensure your **GEMINI_API_KEY** is provided in the `.env` file.

### 4. Run the Project
```bash
# 1. Start the PostgreSQL database
docker-compose up -d db

# 2. Start both Frontend and Backend concurrently
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Database**: Port 5435 (External)

---

## 🏗️ System Architecture

SupportIQ follows a modern distributed architecture, ensuring clear separation of concerns between the reactive frontend, the structured backend, and external intelligence services.

```mermaid
graph TD
    subgraph "Frontend (Vite + React)"
        UI[Glassmorphic UI / components]
        Store[Zustand State Management]
        GCheck[LanguageTool API / Grammar]
    end

    subgraph "Backend (NestJS)"
        Auth[JWT Authentication]
        Chat[Chat Logic & Multi-turn History]
        Sentiment[Real-time Sentiment Analysis]
        Summary[Auto-Thread Summarization]
        Cache[In-Memory Caching]
    end

    subgraph "External Services"
        Gemini[Google Gemini 1.5 Flash]
        LT[LanguageTool API]
    end

    subgraph "Persistence"
        DB[(PostgreSQL)]
    end

    UI <--> Store
    UI -- Debounced --> GCheck
    Store <-->|HTTPS + JWT| Auth
    Store <-->|HTTPS + JWT| Chat
    Chat <--> Cache
    Chat <--> Gemini
    Chat <--> DB
    Auth <--> DB
```

---

## 📊 Database Schema (ERD)

Data in SupportIQ is strictly relational, ensuring conversation integrity and multi-user isolation.

```mermaid
erDiagram
    USER ||--o{ CHAT_CONTEXT : "manages"
    CHAT_CONTEXT ||--o{ CONVERSATION : "contains"
    USER ||--o{ CONVERSATION : "owns"

    USER {
        int id PK
        string email UK
        string password "Bcrypt Hash"
        string firstName
        string lastName
    }
    CHAT_CONTEXT {
        int id PK
        int userId FK
        string summary "AI Generated"
        datetime createdAt
    }
    CONVERSATION {
        int id PK
        int userId FK
        int contextId FK
        text message "User Prompt"
        text response "AI Result"
        string sentiment "AI Analyzed"
        datetime createdAt
    }
```

---

## 🔒 Security Workflow (Auth & Authz)

SupportIQ implements a two-tier security model combining state-of-the-art authentication (Identity) and authorization (Access Control).

### 1. Authentication Handshake
```mermaid
sequenceDiagram
    participant U as Frontend (Zustand)
    participant A as Auth Controller
    participant D as PostgreSQL
    participant J as JWT Service

    U->>A: POST /auth/login (Email, Password)
    A->>D: Find User by Email
    D-->>A: User Record (Hashed Pwd)
    A->>A: Bcrypt Compare
    A->>J: Generate Token (Payload: sub, email)
    J-->>A: JWT Access Token
    A-->>U: 200 OK + JWT + User Profile
    U->>U: Store JWT in LocalStorage
```

### 2. Authorization (Guarded Access)
Every request to the `/api/chat` endpoints is intercepted by a logic-gate:

-   **Guard**: `JwtAuthGuard` checks for a valid Bearer token.
-   **Strategy**: `JwtStrategy` validates the token signature and secret.
-   **Context**: Upon success, a `User` entity is injected into the request, ensuring users only see their own threads (`id` mapping).

---

## 🧠 Core Logic & Caching Strategy

### Deterministic Caching (Performance)
To reduce latency and Gemini API costs, SupportIQ implements a **Deterministic Cache Key Generation** system in the `ChatService`:

```mermaid
graph LR
    Input[User Message + Context] --> Hash[SHA-256 Hashing]
    Hash --> Key[Cache Key]
    Key --> Check{Exists in Cache?}
    Check -- Yes --> Return[Immediate Response]
    Check -- No --> AI[Call Gemini AI]
    AI --> Store[Store in Cache Manager]
    Store --> Return
```

*   **Logic**: Every AI response, sentiment analysis, and thread summary is hashed against its unique payload.
*   **Result**: Identical prompts return instantaneous results with **zero API consumption**.

---

## 📡 API Reference

### Authentication
| Endpoint | Method | Role |
| :--- | :--- | :--- |
| `/api/auth/signup` | POST | User onboarding |
| `/api/auth/login` | POST | Identity verification |

### Chat & Intelligence (Guarded)
| Endpoint | Method | Feature |
| :--- | :--- | :--- |
| `/api/chat` | POST | Mult-turn AI Chat |
| `/api/chat/contexts` | GET | List Conversation Threads |
| `/api/chat/context/:id/messages` | GET | Thread History Retrieval |
| `/api/chat/refine` | POST | AI Prompt Engineering |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS (Modern Glassmorphism)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Grammar API**: LanguageTool

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **AI**: Google GenAI SDK (Gemini 1.5 Flash)
- **Caching**: NestJS Cache Manager

---

## ⚙️ Environment Variables (Root `.env`)

Create a `.env` file in the root directory. Below are the critical configuration keys:

| Key | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Backend server port. |
| `DB_HOST` | `localhost` | Database host (use `db` within Docker). |
| `DB_PORT` | `5435` | Database port (mapped from 5432). |
| `DB_USER` | `postgres` | Database user. |
| `DB_PASS` | `postgres_password` | Database password. |
| `GEMINI_API_KEY` | `Required` | Your Google Gemini AI API key. |
| `VITE_API_URL` | `http://localhost:5000/api` | Backend endpoint for the frontend. |

---

## 🧪 API Testing (Postman)

A pre-configured Postman collection is available for rapid backend testing and integration verification.

### 1. Import Collection
Import the `SupportIQ.postman_collection.json` directly into Postman.

### 2. Features Included
- **Automated Token Management**: The `Login` request includes a post-response script that automatically updates the `{{token}}` variable.
- **Environment Variables**: Uses `{{base_url}}` (default: `http://localhost:5000`) for seamless switching.

---

## 🐳 Docker Architecture

SupportIQ leverages Docker for consistent environments and simplified deployment. The architecture consists of three orchestrated services:

### Service Breakdown
1.  **`db`**: A `postgres:16-alpine` database service with health-check monitoring and persistent volume mapping (`pgdata`).
2.  **`server`**: The NestJS backend. Waits for the database to be ready before initiating its connection pool.
3.  **`client`**: The React/Vite frontend. Built using a custom `Dockerfile` with the `VITE_API_URL` injected at build-time.

### Deployment (Full Stack)
```bash
docker compose up --build -d
```
- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:5050/api](http://localhost:5050/api)

---

## 🏗️ Engineering Standards & Credits

SupportIQ is built with a focus on visual excellence, security, and scalable AI logic.

- **Logic Design**: SOLID Principles, DRY Architecture, and Type-safe interfaces throughout.
- **Premium UX**: Liquid Gradients, Glassmorphism, and distraction-free layout.
- **Security**: JWT-based Authentication, Bcrypt encryption, and Guard-based Authorization.
- **AI Engine**: Multi-turn history building with Google Gemini 1.5 Flash and deterministic SHA-256 caching.