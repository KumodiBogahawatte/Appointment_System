# PowerShell Script to Start All Services
# Run from: D:\gitgub\Appointment_System directory
# Usage: .\start-all-services.ps1

Write-Host "Starting all Appointment System services..." -ForegroundColor Green
Write-Host ""

# Function to start a service in a new window
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ServicePath
    )
    
    Write-Host "Starting $ServiceName..." -ForegroundColor Cyan
    
    $fullPath = "D:\gitgub\Appointment_System\$ServicePath"
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; npm start" -WindowStyle Normal
    
    Start-Sleep -Seconds 2
}

# Start all services
Start-Service "API Gateway" "api-gateway"
Start-Service "User Service" "user-service"
Start-Service "Doctor Service" "doctor-service"
Start-Service "Appointment Service" "appointment-service"
Start-Service "Feedback Service" "feedback-service"
Start-Service "Admin Frontend" "admin"
Start-Service "User Frontend" "userFrontend/appointment"

Write-Host ""
Write-Host "All services started in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Access points:" -ForegroundColor Yellow
Write-Host "  Admin Dashboard: http://localhost:5173" -ForegroundColor White
Write-Host "  User Frontend: http://localhost:5174" -ForegroundColor White
Write-Host "  API Gateway: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Services running on:" -ForegroundColor Yellow
Write-Host "  User Service: http://localhost:3001" -ForegroundColor White
Write-Host "  Doctor Service: http://localhost:3002" -ForegroundColor White
Write-Host "  Appointment Service: http://localhost:3003" -ForegroundColor White
Write-Host "  Feedback Service: http://localhost:3004" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in any window to stop that service" -ForegroundColor Cyan
