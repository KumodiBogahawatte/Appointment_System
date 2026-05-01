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

## 🚀 Cloud Run Deployment with GitHub Secrets

Deploy to Google Cloud Run with secure secret management:

**Quick Start:**
1. Follow [SETUP_SUMMARY.md](SETUP_SUMMARY.md) for overview
2. Set up GCP: [GCP_CLOUD_RUN_DEPLOYMENT.md](GCP_CLOUD_RUN_DEPLOYMENT.md)
3. Configure secrets: [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
4. Quick reference: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
5. Verification: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

**Key Points:**
- ✅ No secrets in Git (all in GitHub Secrets)
- ✅ Automatic deployment on every push to `main`
- ✅ Workload Identity Federation (no credentials stored)
- ✅ Build-time and runtime environment variables
- ✅ Production-ready architecture

**How It Works:**
1. You push code to GitHub
2. GitHub Actions builds Docker images
3. Images are pushed to Google Container Registry
4. Services deploy to Cloud Run with secrets injected
5. Everything is live at public HTTPS URLs

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [SETUP_SUMMARY.md](SETUP_SUMMARY.md) | Overview of what was configured |
| [GCP_CLOUD_RUN_DEPLOYMENT.md](GCP_CLOUD_RUN_DEPLOYMENT.md) | Complete GCP setup guide |
| [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md) | GitHub Secrets configuration |
| [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) | Step-by-step migration guide |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Pre-deployment verification |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Commands and templates |

**Start here:** [SETUP_SUMMARY.md](SETUP_SUMMARY.md)

---

## � Cloud Run Deployment

Deploy to Google Cloud Run with GitHub Secrets:

1. **Setup GCP**: Follow [GCP_CLOUD_RUN_DEPLOYMENT.md](GCP_CLOUD_RUN_DEPLOYMENT.md)
2. **Configure Secrets**: Follow [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
3. **Push to GitHub**: 
   ```bash
   git push origin main
   ```
4. **GitHub Actions** will automatically build, push to GCR, and deploy to Cloud Run

All sensitive environment variables (MongoDB URIs, JWT secrets, Firebase keys) are stored securely in GitHub Secrets.

---

## 📅 Last Updated

April 2026
