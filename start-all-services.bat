@echo off
REM Batch script to start all Appointment System services
REM Run from: D:\gitgub\Appointment_System directory
REM Usage: start-all-services.bat

setlocal enabledelayedexpansion

echo.
echo ===============================================
echo Starting ALL Services - Appointment System
echo ===============================================
echo.

REM Colors and formatting
color 0A

echo [1/7] Starting API Gateway on port 3000...
start "API Gateway - Port 3000" cmd /k "cd D:\gitgub\Appointment_System\api-gateway && npm start"
timeout /t 2 /nobreak

echo [2/7] Starting User Service on port 3001...
start "User Service - Port 3001" cmd /k "cd D:\gitgub\Appointment_System\user-service && npm start"
timeout /t 2 /nobreak

echo [3/7] Starting Doctor Service on port 3002...
start "Doctor Service - Port 3002" cmd /k "cd D:\gitgub\Appointment_System\doctor-service && npm start"
timeout /t 2 /nobreak

echo [4/7] Starting Appointment Service on port 3003...
start "Appointment Service - Port 3003" cmd /k "cd D:\gitgub\Appointment_System\appointment-service && npm start"
timeout /t 2 /nobreak

echo [5/7] Starting Feedback Service on port 3004...
start "Feedback Service - Port 3004" cmd /k "cd D:\gitgub\Appointment_System\feedback-service && npm start"
timeout /t 2 /nobreak

echo [6/7] Starting Admin Dashboard on port 5173...
start "Admin Dashboard - Port 5173" cmd /k "cd D:\gitgub\Appointment_System\admin && npm run dev"
timeout /t 2 /nobreak

echo [7/7] Starting User Frontend on port 5174...
start "User Frontend - Port 5174" cmd /k "cd D:\gitgub\Appointment_System\userFrontend\appointment && npm run dev"
timeout /t 2 /nobreak

echo.
echo ===============================================
echo All Services Started Successfully!
echo ===============================================
echo.
echo ACCESS POINTS:
echo   Admin Dashboard: http://localhost:5173
echo   User Frontend: http://localhost:5174
echo.
echo SERVICES:
echo   API Gateway: http://localhost:3000
echo   User Service: http://localhost:3001
echo   Doctor Service: http://localhost:3002
echo   Appointment Service: http://localhost:3003
echo   Feedback Service: http://localhost:3004
echo.
echo Services are running in separate windows.
echo Close any window to stop that service.
echo.
pause
