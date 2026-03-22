# 🏥 Microservice-Based Healthcare Appointment System

A **microservice-based healthcare appointment platform** built with modern cloud-native practices. The system consists of four independent services:

- **User Service**
- **Doctor Service**
- **Appointment Service**
- **Feedback Service**

Each service has its own **MongoDB database** (database-per-service pattern) and communicates via a centralized **API Gateway**.

---

## 🛠 Tech Stack

**Backend**
- Node.js
- Express.js
- Mongoose

**Frontend**
- React (Vite)
- Tailwind CSS

**Database**
- MongoDB (Atlas or local)

**DevOps**
- Docker
- GitHub Actions (CI/CD)

---

## 🏗 Architecture

All clients (Admin UI & User App) communicate through a **single entry point**:

👉 **API Gateway (http://localhost:3000)**

### Routing

| Route | Service | Port |
|------|--------|------|
| `/users` | User Service | 3001 |
| `/doctors` | Doctor Service | 3002 |
| `/appointments` | Appointment Service | 3003 |
| `/feedback` | Feedback Service | 3004 |

✔️ All **internal service communication** also goes through the gateway using:

http://localhost:3000

⚠️ **Important:** Always start the API Gateway **before** other services.

---

## 📋 Prerequisites

- Node.js (v18+)
- npm
- MongoDB (Atlas recommended)
- Git

---

## 🚀 Quick Start

### 1. Install Dependencies

cd api-gateway && npm install && cd ..
cd user-service && npm install && cd ..
cd doctor-service && npm install && cd ..
cd appointment-service && npm install && cd ..
cd feedback-service && npm install && cd ..
cd admin && npm install && cd ..
cd userFrontend/appointment && npm install && cd ../..

---

### 2. Setup Environment Variables

- Copy `.env.example` → `.env`
- Do NOT commit `.env` files

---

### 3. Start All Services

#### Option 1: Script

- Windows: start-all-services.bat
- PowerShell: .\start-all-services.ps1
- Node:
node start-all-services.js

#### Option 2: Manual Start

cd api-gateway && npm start

cd user-service && npm start
cd doctor-service && npm start
cd appointment-service && npm start
cd feedback-service && npm start

cd admin && npm run dev
cd userFrontend/appointment && npm run dev

---

## 🌐 Ports and URLs

| Component | Port | URL |
|----------|------|-----|
| API Gateway | 3000 | http://localhost:3000 |
| User Service | 3001 | http://localhost:3001 |
| Doctor Service | 3002 | http://localhost:3002 |
| Appointment Service | 3003 | http://localhost:3003 |
| Feedback Service | 3004 | http://localhost:3004 |
| Admin Dashboard | 5173 | http://localhost:5173 |
| User Web App | 5174 | http://localhost:5174 |

---

## 🔐 Environment Variables

API Gateway:
PORT=3000
USER_SERVICE_URL=http://localhost:3001
DOCTOR_SERVICE_URL=http://localhost:3002
APPOINTMENT_SERVICE_URL=http://localhost:3003
FEEDBACK_SERVICE_URL=http://localhost:3004

User Service:
PORT=3001
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret

Other Services:
PORT=300X
MONGO_URI=your_mongo_uri
API_GATEWAY_URL=http://localhost:3000

Frontend:
VITE_API_URL=http://localhost:3000

---

## 🧪 Troubleshooting

- Run npm install if modules missing
- Ensure MongoDB is running
- Start API Gateway first
- Use valid ObjectIds

---

## 📅 Last Updated

March 2026
