# API Routing Fix Summary

## Problem
Registration and other API calls were failing with 404 errors due to routing inconsistencies between the API Gateway and backend services.

## Root Cause
The API Gateway had `pathRewrite` rules that were stripping service prefixes (e.g., removing `/users`), but this conflicted with:
1. Service-to-service calls that included the full path (e.g., `/doctors/{id}`)
2. Route definitions that varied between having and not having the prefix

## Solution
Implemented a **consistent routing pattern** without pathRewrite:

### API Gateway (Port 3000)
- Routes requests to service ports WITHOUT modifying paths
- Proxy configuration: No `pathRewrite` rules
- Routes to services:
  - `/users/*` → `http://localhost:3001`
  - `/doctors/*` → `http://localhost:3002`
  - `/appointments/*` → `http://localhost:3003`
  - `/feedback/*` → `http://localhost:3004`

### All Backend Services
**Mount Point:** All services mount routes at `/` (root)

**Route Structure:** All routes include the service prefix with full paths

#### User Service (Port 3001)
```
POST   /users/signup
POST   /users/login
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
GET    /users/:id/appointments
```

#### Doctor Service (Port 3002)
```
GET    /doctors
POST   /doctors
GET    /doctors/:id
PUT    /doctors/:id
DELETE /doctors/:id
GET    /doctors/:id/availability
GET    /doctors/:id/appointments
GET    /doctors/:id/feedback
```

#### Appointment Service (Port 3003)
```
POST   /appointments
GET    /appointments
GET    /appointments/:id
PUT    /appointments/:id
DELETE /appointments/:id
GET    /appointments/user/:userId
GET    /appointments/doctor/:doctorId
```

#### Feedback Service (Port 3004)
```
POST   /feedback
GET    /feedback
GET    /feedback/:id
PUT    /feedback/:id
DELETE /feedback/:id
GET    /feedback/doctor/:doctorId
GET    /feedback/doctor/:doctorId/average
GET    /feedback/user/:userId
POST   /feedback/notify-appointment
```

## Request Flow Examples

### Frontend → API Gateway → Service
**Example:** User Registration
1. Frontend: `POST http://localhost:3000/users/signup`
2. API Gateway: Routes to service (no path modification)
3. Service receives: `POST /users/signup`
4. Route matches: `POST /users/signup` ✓

### Service → Service Direct Call
**Example:** Appointment Service verifies doctor exists
1. Appointment Service: `GET http://localhost:3002/doctors/123`
2. Direct network call to Doctor Service
3. Doctor Service receives: `GET /doctors/123`
4. Route matches: `GET /doctors/:id` ✓

## Files Modified
1. `api-gateway/src/routes/proxyRoutes.js` - Removed pathRewrite rules
2. `user-service/src/routes/userRoutes.js` - Added /users prefix to all routes
3. `doctor-service/src/routes/doctorRoutes.js` - Added /doctors prefix to all routes
4. `appointment-service/src/routes/appointmentRoutes.js` - Added /appointments prefix to all routes
5. `feedback-service/src/routes/feedbackRoutes.js` - Added /feedback prefix to all routes

## Key Changes
- ✅ Removed API Gateway pathRewrite rules
- ✅ Added service prefixes to all route definitions
- ✅ Verified all services mount at "/" (root)
- ✅ Confirmed service-to-service calls use correct paths
- ✅ Consistent routing pattern across all services

## Testing
After restarting all services, verify:
1. User registration: `POST /users/signup` should return 201
2. Doctor listing: `GET /doctors` should return doctor list
3. Service-to-service: Appointment creation verifies both user and doctor exist
4. Feedback integration: Doctor service can fetch ratings from feedback service

## Command to Restart Services
All 5 microservices and the API Gateway need to be restarted for changes to take effect.

Using Node.js startup script:
```bash
node startup.js
```

Or manually in separate terminals:
```bash
# Terminal 1: API Gateway
cd api-gateway && npm start

# Terminal 2: User Service
cd user-service && npm start

# Terminal 3: Doctor Service
cd doctor-service && npm start

# Terminal 4: Appointment Service
cd appointment-service && npm start

# Terminal 5: Feedback Service
cd feedback-service && npm start
```
