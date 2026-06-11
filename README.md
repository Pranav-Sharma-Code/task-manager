# 📋 Task Manager — MERN Stack

A full-stack Task Management Web Application built with the MERN stack.

## 🚀 Features

- ✅ User Registration & Login with JWT Authentication
- ✅ Create, Read, Update, Delete Tasks
- ✅ Mark tasks as Pending / Completed
- ✅ Protected Routes (Frontend + Backend)
- ✅ Responsive UI with Tailwind CSS
- ✅ Secure password hashing with bcryptjs

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |

## 📁 Project Structure

```
task-manager/
├── backend/
│   └── src/
│       ├── controllers/    # Business logic
│       ├── models/         # MongoDB schemas
│       ├── routes/         # API endpoints
│       ├── middleware/     # JWT middleware
│       ├── db.js           # Database connection
│       └── index.js        # Entry point
└── frontend/
    └── src/
        ├── context/        # Auth context
        ├── pages/          # Login, Register, Dashboard
        └── App.jsx         # Routes
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Backend Setup
```bash
cd backend
npm install
```

`.env` file banao `backend/` mein:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

```bash
npm run dev
```
Server `http://localhost:5000` pe chalega.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App `http://localhost:5173` pe chalegi.

## 🔗 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Naya user banao |
| POST | `/api/auth/login` | Login karo |
| GET | `/api/auth/profile` | Profile dekho |

### Task Routes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Saari tasks lo |
| POST | `/api/tasks` | Task banao |
| PUT | `/api/tasks/:id` | Task update karo |
| PATCH | `/api/tasks/:id/toggle` | Status toggle karo |
| DELETE | `/api/tasks/:id` | Task delete karo |

## 📸 Screenshots



## 👨‍💻 Author

**Pranav Sharma**
