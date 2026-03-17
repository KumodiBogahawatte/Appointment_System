# 🚀 Quick Start Guide - Run All Services

## Option 1: Run All Services with One Click (EASIEST)

### Windows Batch Script (Recommended)
```bash
# Double-click this file:
start-all-services.bat
```

This will:
- ✅ Open 7 new terminal windows
- ✅ Start all backend services
- ✅ Start both frontends
- ✅ Display all access points and ports

### Windows PowerShell Script
```powershell
# Run from PowerShell in the project root:
.\start-all-services.ps1
```

---

## Option 2: Manual Start (If Scripts Don't Work)

Open **7 separate terminal windows** and run:

### Terminal 1: API Gateway
```bash
cd D:\gitgub\Appointment_System\api-gateway
npm start
```
✅ Runs on: `http://localhost:3000`

### Terminal 2: User Service
```bash
cd D:\gitgub\Appointment_System\user-service
npm start
```
✅ Runs on: `http://localhost:3001`

### Terminal 3: Doctor Service
```bash
cd D:\gitgub\Appointment_System\doctor-service
npm start
```
✅ Runs on: `http://localhost:3002`

### Terminal 4: Appointment Service
```bash
cd D:\gitgub\Appointment_System\appointment-service
npm start
```
✅ Runs on: `http://localhost:3003`

### Terminal 5: Feedback Service
```bash
cd D:\gitgub\Appointment_System\feedback-service
npm start
```
✅ Runs on: `http://localhost:3004`

### Terminal 6: Admin Dashboard
```bash
cd D:\gitgub\Appointment_System\admin
npm run dev
```
✅ Runs on: `http://localhost:5173`

### Terminal 7: User Frontend
```bash
cd D:\gitgub\Appointment_System\userFrontend\appointment
npm run dev
```
✅ Runs on: `http://localhost:5174`

---

## 📍 Access Points After Starting

### Frontends (User-facing)
- **Admin Panel:** http://localhost:5173
- **User App:** http://localhost:5174

### Backend Services (API)
- **API Gateway:** http://localhost:3000
- **User Service:** http://localhost:3001
- **Doctor Service:** http://localhost:3002
- **Appointment Service:** http://localhost:3003
- **Feedback Service:** http://localhost:3004

---

## ✅ Verify All Services Are Running

Test all endpoints with these commands:

```bash
# Health checks
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health

# Get doctors (via API Gateway)
curl http://localhost:3000/doctors

# Get users
curl http://localhost:3000/users/health
```

All should return `200 OK` with status message.

---

## 🔧 Troubleshooting

### Script doesn't execute in PowerShell
```powershell
# Run this first to allow script execution:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port already in use
If a port is already in use:
1. Find process using the port:
   ```bash
   netstat -ano | findstr :3000
   ```
2. Kill the process:
   ```bash
   taskkill /PID <PID> /F
   ```

### Dependencies missing
```bash
# Install all dependencies:
cd feedback-service && npm install
cd ../doctor-service && npm install
cd ../appointment-service && npm install
cd ../user-service && npm install
cd ../admin && npm install
cd ../userFrontend/appointment && npm install --legacy-peer-deps
```

---

## 📋 What Each Service Does

| Service | Port | Purpose |
|---------|------|---------|
| **API Gateway** | 3000 | Routes all frontend requests to backend services |
| **User Service** | 3001 | User registration, login, profile management |
| **Doctor Service** | 3002 | Doctor profiles, specialization, ratings |
| **Appointment Service** | 3003 | Booking, managing appointments |
| **Feedback Service** | 3004 | User feedback and doctor ratings |
| **Admin Frontend** | 5173 | Dashboard for managers to manage system |
| **User Frontend** | 5174 | App for patients to book appointments |

---

## 🔄 Complete Workflow

1. **User registers** on port 5174
2. **User logs in** with Firebase authentication
3. **User views doctors** from Doctor Service
4. **User books appointment** with a doctor
5. **Appointment Service verifies** user and doctor exist
6. **Appointment created** in database
7. **User completes appointment**
8. **Feedback Service notified** to enable feedback
9. **User submits feedback** and rating
10. **Doctor's average rating updates**

---

## 🛑 Stopping All Services

### Option 1: Close all terminal windows
Simply close each terminal window to stop that service.

### Option 2: Kill all Node processes
```bash
taskkill /F /IM node.exe
```

---

**All services should now be running! 🎉**

Start with the Admin Panel: http://localhost:5173
