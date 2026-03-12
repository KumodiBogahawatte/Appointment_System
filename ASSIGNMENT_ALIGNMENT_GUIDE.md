# Cloud Computing Assignment - Implementation Guide
## Appointment System Microservices Project

---

## 📋 Table of Contents
1. [Current Project Assessment](#current-project-assessment)
2. [Assignment Requirements Mapping](#assignment-requirements-mapping)
3. [Implementation Roadmap](#implementation-roadmap)
4. [Architecture Design](#architecture-design)
5. [Service-to-Service Integration](#service-to-service-integration)
6. [DevOps Implementation](#devops-implementation)
7. [Security Measures](#security-measures)
8. [Cloud Deployment Guide](#cloud-deployment-guide)
9. [Project Report Structure](#project-report-structure)
10. [Demonstration Plan](#demonstration-plan)
11. [Checklist & Timeline](#checklist--timeline)

---

## 📊 Current Project Assessment

### ✅ What You Already Have

Your project at `D:\gitgub\Appointment_System` currently includes:

**Microservices:**
- ✅ `user-service/` (Port 3001) - User authentication & management
- ✅ `doctor-service/` (Port 3002) - Doctor profile management  
- ✅ `appointment-service/` (Port 3003) - Appointment booking
- ✅ `feedback-service/` (Port 3004) - Feedback collection

**Infrastructure:**
- ✅ `api-gateway/` (Port 3000) - API Gateway with proxy routing
- ✅ `admin/` - React frontend with Firebase authentication
- ✅ Docker support (`docker-compose.yml`, `Dockerfile` in services)
- ✅ MongoDB databases (using MongoDB Atlas)
- ✅ CORS configured
- ✅ Basic Express.js setup

### ⚠️ What Needs Completion

**Critical Gaps:**
1. **Services are incomplete** - Only doctor-service is fully functional
2. **No inter-service communication** - Services don't call each other yet
3. **No CI/CD pipelines** - Missing GitHub Actions workflows
4. **No API documentation** - Missing OpenAPI/Swagger specs
5. **No security measures** - Missing authentication, rate limiting, input validation
6. **Not deployed to cloud** - Running only locally
7. **No SAST tools** - Missing SonarCloud/Snyk integration
8. **No proper version control** - Need separate public repositories per service

---

## 🎯 Assignment Requirements Mapping

### Requirement 1: Design Microservices (LO1, LO3)

**What's Required:**
- 4 microservices, one per student
- Clear functionality and endpoints
- Each service must communicate with at least one other service

**Your Current Status:**
- ✅ 4 microservices exist
- ⚠️ Only doctor-service has complete CRUD operations
- ❌ No inter-service communication implemented
- ❌ Missing API documentation

**Action Items:**
1. Complete all CRUD operations for each service
2. Design and implement 3 integration points minimum
3. Create OpenAPI/Swagger documentation for each service
4. Define clear API contracts between services

---

### Requirement 2: DevOps Practices (LO1, LO2)

**What's Required:**
- Public repositories with version control
- CI/CD pipelines for automated build & deployment

**Your Current Status:**
- ⚠️ Code exists but not in proper repository structure
- ❌ No GitHub Actions workflows
- ❌ No automated testing
- ❌ No build/deployment automation

**Action Items:**
1. Create 4 separate public GitHub repositories (one per service)
2. Set up GitHub Actions workflows with:
   - Automated testing on push/PR
   - Docker image building
   - Deployment automation
3. Implement proper Git branching strategy
4. Add comprehensive README files

---

### Requirement 3: Containerization (LO3, LO4)

**What's Required:**
- Services containerized with Docker
- Images hosted in container registry
- Deployment uses images from registry

**Your Current Status:**
- ✅ Dockerfiles exist for some services
- ⚠️ docker-compose.yml needs updates
- ❌ Images not pushed to registry
- ❌ Not using registry in deployment

**Action Items:**
1. Create/update Dockerfile for each service
2. Create Docker Hub account and repositories
3. Configure CI/CD to push images to Docker Hub
4. Update deployment to pull from registry

---

### Requirement 4: Cloud Deployment (LO2, LO4)

**What's Required:**
- Deploy using managed container orchestration (ECS/Azure Container Apps/GKE)
- Services accessible over internet
- Demonstrate security measures

**Your Current Status:**
- ❌ Not deployed to any cloud provider
- ❌ No cloud infrastructure setup
- ❌ No public endpoints

**Action Items:**
1. Choose cloud provider (AWS/Azure/GCP)
2. Set up container orchestration service
3. Deploy all 4 microservices
4. Configure load balancer and networking
5. Obtain public URLs for demonstration

---

### Requirement 5: Security Measures (LO2, LO4)

**What's Required:**
- IAM roles, security groups
- Secure data handling
- Least privilege principle
- SAST tools (SonarCloud/Snyk)

**Your Current Status:**
- ⚠️ Firebase authentication in frontend only
- ❌ No JWT implementation in services
- ❌ No input validation
- ❌ No SAST tools integrated
- ❌ No security best practices

**Action Items:**
1. Implement JWT authentication across services
2. Add input validation (Joi/express-validator)
3. Set up SonarCloud and Snyk
4. Implement rate limiting and security headers
5. Configure cloud security (IAM, security groups)

---

## 🗺️ Implementation Roadmap

### Phase 1: Complete Microservices (Week 1)

#### Student 1: User Service Enhancement

**Current Location:** `D:\gitgub\Appointment_System\user-service`

**Required Endpoints:**
```
POST   /users/register          - Register new user
POST   /users/login             - Login and get JWT token
GET    /users/:id               - Get user by ID (for other services)
PUT    /users/:id               - Update user profile
DELETE /users/:id               - Delete user
GET    /users/:id/appointments  - Get user's appointments
```

**Key Features to Add:**
- JWT token generation on login
- Password hashing with bcrypt
- Email validation
- Role-based access (admin/user)
- Input validation middleware

**Integration Points:**
- **Called by Appointment Service:** To verify user exists before booking
- **Called by Feedback Service:** To get user details for feedback

---

#### Student 2: Doctor Service Enhancement

**Current Location:** `D:\gitgub\Appointment_System\doctor-service`

**Current Status:** ✅ Basic CRUD working

**Required Enhancements:**
```
GET    /doctors                 - List all doctors (with filters)
GET    /doctors/:id             - Get doctor details
POST   /doctors                 - Add new doctor (admin only)
PUT    /doctors/:id             - Update doctor
DELETE /doctors/:id             - Remove doctor
GET    /doctors/:id/availability - Get doctor's schedule
GET    /doctors/:id/appointments - Get doctor's appointments
GET    /doctors/:id/feedback    - Get doctor's ratings
```

**Key Features to Add:**
- Specialization filtering
- Availability scheduling
- Average rating calculation
- Input validation for phone/email
- Search by name or specialization

**Integration Points:**
- **Called by Appointment Service:** To verify doctor exists and check availability
- **Called by Feedback Service:** To link feedback to doctor
- **Calls Feedback Service:** To get average rating when listing doctors

---

#### Student 3: Appointment Service Enhancement

**Current Location:** `D:\gitgub\Appointment_System\appointment-service`

**Required Endpoints:**
```
POST   /appointments            - Create appointment (verifies user & doctor)
GET    /appointments            - List appointments (with filters)
GET    /appointments/:id        - Get appointment details
PUT    /appointments/:id/status - Update status (pending/confirmed/cancelled/completed)
DELETE /appointments/:id        - Cancel appointment
GET    /appointments/user/:userId    - Get user's appointments
GET    /appointments/doctor/:doctorId - Get doctor's appointments
```

**Key Features to Add:**
- Conflict checking (same doctor, same time)
- Status workflow validation
- Date validation (no past dates)
- Automatic status updates
- Email notifications (optional)

**Integration Points:** (MOST CRITICAL FOR DEMONSTRATION)
- **Calls User Service:** `GET /users/:id` to verify user exists
- **Calls Doctor Service:** `GET /doctors/:id` to verify doctor exists
- **Calls Feedback Service:** `POST /feedback/notify` when appointment completes

---

#### Student 4: Feedback Service Enhancement

**Current Location:** `D:\gitgub\Appointment_System\feedback-service`

**Required Endpoints:**
```
POST   /feedback                - Submit feedback
GET    /feedback                - List all feedback
GET    /feedback/:id            - Get feedback by ID
PUT    /feedback/:id            - Update feedback
DELETE /feedback/:id            - Delete feedback
GET    /feedback/doctor/:doctorId - Get doctor's feedback
GET    /feedback/user/:userId   - Get user's feedback
GET    /feedback/doctor/:doctorId/average - Get average rating
POST   /feedback/notify-appointment - Notification from appointment service
```

**Key Features to Add:**
- Rating validation (1-5 stars)
- Comment length validation
- Calculate average ratings
- Prevent duplicate feedback per appointment
- Link to appointment ID

**Integration Points:**
- **Calls Doctor Service:** `GET /doctors/:id` to verify doctor exists
- **Called by Appointment Service:** When appointment is completed
- **Called by Doctor Service:** To get average rating

---

### Phase 2: Implement Service Integration (Week 1-2)

#### Integration Pattern 1: Appointment Creation Flow

**Scenario:** User books an appointment with a doctor

```
Frontend (Admin Panel)
    ↓ POST /appointments {userId, doctorId, date}
API Gateway (Port 3000)
    ↓ Forward to Appointment Service
Appointment Service (Port 3003)
    ↓ GET /users/:userId
User Service (Port 3001)
    ↑ Returns user data or 404
    ↓ GET /doctors/:doctorId
Doctor Service (Port 3002)
    ↑ Returns doctor data or 404
    ↓ Check time slot conflicts
    ↓ Create appointment in MongoDB
    ↑ Return appointment details to frontend
```

**Implementation Steps:**
1. Install axios in appointment-service: `npm install axios`
2. Add environment variables for service URLs
3. Create helper functions to call other services
4. Add error handling for service failures
5. Add timeout configuration (5 seconds max)
6. Log all cross-service calls for debugging

**Code Location:**
- `appointment-service/src/controllers/appointmentController.js`
- Add functions: `verifyUser()`, `verifyDoctor()`, `createAppointment()`

---

#### Integration Pattern 2: Feedback After Completion

**Scenario:** Appointment is marked as completed, feedback is enabled

```
Admin marks appointment as "completed"
    ↓ PUT /appointments/:id/status {status: "completed"}
Appointment Service
    ↓ Update status in database
    ↓ POST /feedback/notify-appointment
Feedback Service (Port 3004)
    ↓ Create feedback placeholder
    ↓ Send notification (optional)
    ↑ Return success
```

**Implementation Steps:**
1. Add status update validation in appointment service
2. Create notification endpoint in feedback service
3. Make notification call asynchronous (don't block response)
4. Handle failures gracefully (log, don't crash)

---

#### Integration Pattern 3: Doctor Listings with Ratings

**Scenario:** Display doctors with their average ratings

```
Frontend requests doctors list
    ↓ GET /doctors
Doctor Service
    ↓ Fetch all doctors from MongoDB
    ↓ For each doctor: GET /feedback/doctor/:id/average
Feedback Service
    ↑ Calculate and return average rating
    ↓ Merge rating into doctor data
    ↑ Return enriched doctor list
```

**Implementation Steps:**
1. Add average rating calculation in feedback service
2. Modify doctors controller to fetch ratings
3. Cache ratings to avoid slow responses (optional)
4. Handle cases where doctor has no ratings

---

### Phase 3: Version Control Setup (Week 2)

#### Step 3.1: Create GitHub Repositories

**Create 4 Public Repositories:**
```
https://github.com/[yourgroup]/appointment-user-service
https://github.com/[yourgroup]/appointment-doctor-service
https://github.com/[yourgroup]/appointment-appointment-service
https://github.com/[yourgroup]/appointment-feedback-service
```

**Repository Structure (each service):**
```
/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # CI/CD pipeline
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
├── tests/
│   ├── unit/
│   └── integration/
├── Dockerfile
├── .dockerignore
├── .env.example              # Environment template (no secrets!)
├── .gitignore
├── package.json
├── package-lock.json
├── openapi.yaml              # API documentation
├── sonar-project.properties  # SonarCloud config
├── task-definition.json      # AWS ECS task definition
└── README.md                 # Service documentation
```

#### Step 3.2: Push Code to Repositories

**For Each Service:**
```bash
# Navigate to service directory
cd user-service

# Initialize Git (if not already)
git init

# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
*.log
coverage/
.DS_Store
dist/
EOF

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: User Service microservice"

# Add remote
git remote add origin https://github.com/yourgroup/appointment-user-service.git

# Push to main branch
git branch -M main
git push -u origin main
```

**Repeat for all 4 services**

---

### Phase 4: API Documentation (Week 2)

#### Step 4.1: Create OpenAPI Specification

**For Each Service, Create:** `openapi.yaml`

**Example Structure for Doctor Service:**
```yaml
openapi: 3.0.0
info:
  title: Doctor Service API
  description: |
    Manages doctor profiles and availability.
    
    **Integration Points:**
    - Called by Appointment Service to verify doctors
    - Calls Feedback Service to get average ratings
  version: 1.0.0
  contact:
    name: Student 2
    email: student2@myuniversity.edu

servers:
  - url: http://localhost:3002
    description: Local development
  - url: https://doctor-service.yourdomain.com
    description: Production (AWS ECS)

paths:
  /health:
    get:
      summary: Health check
      responses:
        '200':
          description: Service is healthy

  /doctors:
    get:
      summary: List all doctors
      parameters:
        - name: specialization
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Doctor'
    
    post:
      summary: Create doctor
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DoctorInput'
      responses:
        '201':
          description: Created
        '400':
          description: Invalid input
        '401':
          description: Unauthorized

  /doctors/{id}:
    get:
      summary: Get doctor by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
        '404':
          description: Not found

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Doctor:
      type: object
      properties:
        _id:
          type: string
        name:
          type: string
        specialization:
          type: string
        contact:
          type: string
        email:
          type: string
        createdAt:
          type: string
          format: date-time
    
    DoctorInput:
      type: object
      required:
        - name
        - specialization
      properties:
        name:
          type: string
          minLength: 3
          example: "Dr. Sarah Johnson"
        specialization:
          type: string
          example: "Cardiologist"
        contact:
          type: string
          example: "+1234567890"
```

**Create similar files for all 4 services**

#### Step 4.2: Add Swagger UI to Services

**Install Dependencies:**
```bash
npm install swagger-ui-express yamljs
```

**Add to each service's `index.js`:**
```javascript
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

// After other middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log('API Documentation: http://localhost:3002/api-docs');
```

**Access Documentation:**
- User Service: http://localhost:3001/api-docs
- Doctor Service: http://localhost:3002/api-docs
- Appointment Service: http://localhost:3003/api-docs
- Feedback Service: http://localhost:3004/api-docs

---

### Phase 5: CI/CD Pipeline Setup (Week 2)

#### Step 5.1: GitHub Actions Workflow

**Create for Each Service:** `.github/workflows/ci-cd.yml`

**Workflow Structure:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # Job 1: Test
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  # Job 2: Security Scan (Snyk)
  security-snyk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  # Job 3: Code Quality (SonarCloud)
  sonarcloud:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: SonarSource/sonarcloud-github-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  # Job 4: Build & Push Docker Image
  build:
    needs: [test, security-snyk, sonarcloud]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/appointment-doctor-service:latest
            ${{ secrets.DOCKER_USERNAME }}/appointment-doctor-service:${{ github.sha }}

  # Job 5: Deploy to Cloud
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: |
          aws ecs update-service \
            --cluster appointment-cluster \
            --service doctor-service \
            --force-new-deployment
```

#### Step 5.2: GitHub Secrets Configuration

**Required Secrets (Settings → Secrets and variables → Actions):**
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub access token
- `AWS_ACCESS_KEY_ID` - AWS IAM access key
- `AWS_SECRET_ACCESS_KEY` - AWS IAM secret key
- `SNYK_TOKEN` - Snyk API token
- `SONAR_TOKEN` - SonarCloud token

---

### Phase 6: Containerization (Week 2)

#### Step 6.1: Create Optimized Dockerfiles

**For Each Service, Create/Update:** `Dockerfile`

**Multi-stage Build Example:**
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Stage 2: Production
FROM node:18-alpine

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy source code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Environment
ENV NODE_ENV=production

# Start application
CMD ["node", "src/index.js"]
```

**Create `.dockerignore`:**
```
node_modules/
npm-debug.log
.env
.env.*
!.env.example
.git/
.gitignore
README.md
Dockerfile
.dockerignore
tests/
coverage/
.vscode/
*.log
```

#### Step 6.2: Docker Compose for Local Testing

**Update:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    environment:
      - USER_SERVICE_URL=http://user-service:3001
      - DOCTOR_SERVICE_URL=http://doctor-service:3002
      - APPOINTMENT_SERVICE_URL=http://appointment-service:3003
      - FEEDBACK_SERVICE_URL=http://feedback-service:3004
      - NODE_ENV=production
    depends_on:
      - user-service
      - doctor-service
      - appointment-service
      - feedback-service
    networks:
      - appointment-network

  user-service:
    build: ./user-service
    ports:
      - "3001:3001"
    environment:
      - MONGO_URI=${USER_MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - PORT=3001
      - NODE_ENV=production
    networks:
      - appointment-network

  doctor-service:
    build: ./doctor-service
    ports:
      - "3002:3002"
    environment:
      - MONGO_URI=${DOCTOR_MONGO_URI}
      - PORT=3002
      - NODE_ENV=production
    networks:
      - appointment-network

  appointment-service:
    build: ./appointment-service
    ports:
      - "3003:3003"
    environment:
      - MONGO_URI=${APPOINTMENT_MONGO_URI}
      - USER_SERVICE_URL=http://user-service:3001
      - DOCTOR_SERVICE_URL=http://doctor-service:3002
      - FEEDBACK_SERVICE_URL=http://feedback-service:3004
      - PORT=3003
      - NODE_ENV=production
    depends_on:
      - user-service
      - doctor-service
    networks:
      - appointment-network

  feedback-service:
    build: ./feedback-service
    ports:
      - "3004:3004"
    environment:
      - MONGO_URI=${FEEDBACK_MONGO_URI}
      - DOCTOR_SERVICE_URL=http://doctor-service:3002
      - PORT=3004
      - NODE_ENV=production
    depends_on:
      - doctor-service
    networks:
      - appointment-network

  admin-frontend:
    build: ./admin
    ports:
      - "5173:5173"
    environment:
      - VITE_API_GATEWAY_URL=http://localhost:3000
    depends_on:
      - api-gateway
    networks:
      - appointment-network

networks:
  appointment-network:
    driver: bridge
```

**Test Locally:**
```bash
# Build and start all services
docker-compose up --build

# Test in another terminal
curl http://localhost:3000/doctors/health
curl http://localhost:3001/users/health
curl http://localhost:3002/doctors/health
curl http://localhost:3003/appointments/health
curl http://localhost:3004/feedback/health

# Stop all services
docker-compose down
```

#### Step 6.3: Push to Docker Hub

**Manual Push (Initial Setup):**
```bash
# Login to Docker Hub
docker login

# Build image
docker build -t yourusername/appointment-doctor-service:v1.0 ./doctor-service

# Push image
docker push yourusername/appointment-doctor-service:v1.0

# Tag as latest
docker tag yourusername/appointment-doctor-service:v1.0 yourusername/appointment-doctor-service:latest
docker push yourusername/appointment-doctor-service:latest
```

**After CI/CD setup, this happens automatically on every push to main branch**

---

### Phase 7: Security Implementation (Week 3)

#### Step 7.1: Application-Level Security

**7.1.1 JWT Authentication**

**Install Dependencies:**
```bash
npm install jsonwebtoken bcryptjs
```

**User Service - Generate JWT on Login:**
```javascript
// In user-service/src/controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Generate JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};
```

**All Services - Verify JWT:**
```javascript
// Create middleware/authMiddleware.js in each service
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

**Apply to Protected Routes:**
```javascript
const authMiddleware = require('./middleware/authMiddleware');

// Protected routes
app.post('/doctors', authMiddleware, doctorController.createDoctor);
app.put('/doctors/:id', authMiddleware, doctorController.updateDoctor);
app.delete('/doctors/:id', authMiddleware, doctorController.deleteDoctor);

// Public routes (no auth needed)
app.get('/doctors', doctorController.getDoctors);
app.get('/doctors/:id', doctorController.getDoctorById);
```

**7.1.2 Input Validation**

**Install Joi:**
```bash
npm install joi
```

**Create Validation Schemas:**
```javascript
// utils/validation.js
const Joi = require('joi');

const doctorSchema = Joi.object({
  name: Joi.string().min(3).max(100).required()
    .messages({
      'string.min': 'Name must be at least 3 characters',
      'any.required': 'Name is required'
    }),
  specialization: Joi.string().min(3).max(50).required(),
  contact: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/)
    .messages({
      'string.pattern.base': 'Invalid phone number format'
    }),
  email: Joi.string().email()
});

module.exports = { doctorSchema };
```

**Use in Controllers:**
```javascript
const { doctorSchema } = require('../utils/validation');

exports.createDoctor = async (req, res) => {
  // Validate input
  const { error, value } = doctorSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }
  
  // Proceed with validated data
  const doctor = new Doctor(value);
  await doctor.save();
  res.status(201).json(doctor);
};
```

**7.1.3 Security Middleware**

**Install Security Packages:**
```bash
npm install helmet express-rate-limit cors
```

**Add to index.js:**
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Specific rate limit for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
});
app.use('/users/login', authLimiter);
app.use('/users/register', authLimiter);
```

**7.1.4 Environment Variables Security**

**Never commit `.env` files! Create `.env.example`:**
```bash
# .env.example (safe to commit)
PORT=3002
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-key-here
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Service URLs
USER_SERVICE_URL=http://localhost:3001
DOCTOR_SERVICE_URL=http://localhost:3002
APPOINTMENT_SERVICE_URL=http://localhost:3003
FEEDBACK_SERVICE_URL=http://localhost:3004
```

**Add to .gitignore:**
```
.env
.env.local
.env.*.local
```

#### Step 7.2: SAST Tools Integration

**7.2.1 SonarCloud Setup**

1. Go to https://sonarcloud.io
2. Sign up with GitHub
3. Click "+" → "Analyze new project"
4. Import your GitHub repositories
5. Get organization key and project keys

**Create `sonar-project.properties` in each service:**
```properties
sonar.projectKey=yourgroup_appointment-doctor-service
sonar.organization=yourgroup

# Project metadata
sonar.projectName=Appointment System - Doctor Service
sonar.projectVersion=1.0

# Source and test directories
sonar.sources=src
sonar.tests=tests
sonar.sourceEncoding=UTF-8

# JavaScript/Node.js specific
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=test-report.xml

# Exclusions
sonar.exclusions=**/node_modules/**,**/*.spec.js,**/*.test.js
```

**Add test coverage to package.json:**
```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/index.js"
    ]
  }
}
```

**7.2.2 Snyk Setup**

1. Go to https://snyk.io
2. Sign up with GitHub
3. Click "Add project" → Import from GitHub
4. Select your repositories
5. Get API token from Settings → General → Auth Token

**Add to package.json:**
```json
{
  "scripts": {
    "test:security": "snyk test",
    "monitor": "snyk monitor"
  }
}
```

**Create `.snyk` policy file (optional):**
```yaml
# Snyk (https://snyk.io) policy file
version: v1.25.0
ignore: {}
patch: {}
```

**Both tools will run automatically in GitHub Actions (configured in Phase 5)**

---

### Phase 8: Cloud Deployment (Week 3-4)

#### Option A: AWS ECS Deployment (Recommended - Free Tier Available)

**8.1 Prerequisites**

1. **AWS Account:** Create at https://aws.amazon.com/free
2. **AWS CLI:** Install from https://aws.amazon.com/cli
3. **Configure AWS CLI:**
```bash
aws configure
# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Output format (json)
```

**8.2 Setup Infrastructure**

**Step 1: Create ECR Repositories (Optional - can use Docker Hub)**
```bash
aws ecr create-repository --repository-name appointment/user-service --region us-east-1
aws ecr create-repository --repository-name appointment/doctor-service --region us-east-1
aws ecr create-repository --repository-name appointment/appointment-service --region us-east-1
aws ecr create-repository --repository-name appointment/feedback-service --region us-east-1
aws ecr create-repository --repository-name appointment/api-gateway --region us-east-1
```

**Step 2: Create ECS Cluster**
```bash
aws ecs create-cluster \
  --cluster-name appointment-cluster \
  --region us-east-1
```

**Step 3: Create VPC and Subnets (if not using default)**
```bash
# Using default VPC is fine for free tier
# Get default VPC ID
aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text

# Get subnet IDs
aws ec2 describe-subnets --filters "Name=vpc-id,Values=YOUR_VPC_ID" --query "Subnets[*].SubnetId" --output text
```

**Step 4: Create Security Groups**
```bash
# Security group for services
aws ec2 create-security-group \
  --group-name appointment-services-sg \
  --description "Security group for appointment services" \
  --vpc-id YOUR_VPC_ID

# Allow inbound from ALB only
aws ec2 authorize-security-group-ingress \
  --group-id YOUR_SG_ID \
  --protocol tcp \
  --port 3001-3004 \
  --source-group YOUR_ALB_SG_ID
```

**Step 5: Create Application Load Balancer**
```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name appointment-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxxxxxx

# Create target groups (one per service)
aws elbv2 create-target-group \
  --name doctor-service-tg \
  --protocol HTTP \
  --port 3002 \
  --vpc-id YOUR_VPC_ID \
  --target-type ip \
  --health-check-path /health

# Create listener with path-based routing
aws elbv2 create-listener \
  --load-balancer-arn YOUR_ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=YOUR_TG_ARN

# Add routing rules
aws elbv2 create-rule \
  --listener-arn YOUR_LISTENER_ARN \
  --priority 1 \
  --conditions Field=path-pattern,Values='/doctors/*' \
  --actions Type=forward,TargetGroupArn=YOUR_DOCTOR_TG_ARN
```

**Step 6: Create IAM Roles**
```bash
# Create execution role (for ECS to pull images, write logs)
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://trust-policy.json

# Attach managed policies
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

**8.3 Create Task Definitions**

**Create:** `task-definition-doctor-service.json`
```json
{
  "family": "doctor-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "doctor-service",
      "image": "yourdockerhub/appointment-doctor-service:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3002,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PORT",
          "value": "3002"
        },
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "MONGO_URI",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT:secret:doctor-mongo-uri"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/doctor-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs",
          "awslogs-create-group": "true"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3002/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

**Register Task Definition:**
```bash
aws ecs register-task-definition --cli-input-json file://task-definition-doctor-service.json
```

**Create similar task definitions for all 4 services**

**8.4 Create ECS Services**
```bash
aws ecs create-service \
  --cluster appointment-cluster \
  --service-name doctor-service \
  --task-definition doctor-service:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --platform-version LATEST \
  --network-configuration "awsvpcConfiguration={
    subnets=[subnet-xxxxx,subnet-yyyyy],
    securityGroups=[sg-xxxxxxxxx],
    assignPublicIp=ENABLED
  }" \
  --load-balancers "targetGroupArn=YOUR_TG_ARN,containerName=doctor-service,containerPort=3002" \
  --health-check-grace-period-seconds 60
```

**8.5 Store Secrets in AWS Secrets Manager**
```bash
# Store MongoDB URI
aws secretsmanager create-secret \
  --name doctor-mongo-uri \
  --secret-string "mongodb+srv://username:password@cluster.mongodb.net/doctors" \
  --region us-east-1

# Store JWT secret
aws secretsmanager create-secret \
  --name jwt-secret \
  --secret-string "your-super-secret-jwt-key" \
  --region us-east-1
```

**8.6 Deployment Commands**
```bash
# Deploy/update service
aws ecs update-service \
  --cluster appointment-cluster \
  --service doctor-service \
  --force-new-deployment

# Check service status
aws ecs describe-services \
  --cluster appointment-cluster \
  --services doctor-service

# View logs
aws logs tail /ecs/doctor-service --follow
```

**8.7 Get Public URL**
```bash
# Get ALB DNS name
aws elbv2 describe-load-balancers \
  --names appointment-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text

# Your services will be accessible at:
# http://YOUR-ALB-DNS-NAME/doctors
# http://YOUR-ALB-DNS-NAME/users
# http://YOUR-ALB-DNS-NAME/appointments
# http://YOUR-ALB-DNS-NAME/feedback
```

---

#### Option B: Azure Container Apps (Alternative)

**Prerequisites:**
```bash
# Install Azure CLI
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login
az login

# Create resource group
az group create --name appointment-rg --location eastus
```

**Deploy Services:**
```bash
# Create Container Apps environment
az containerapp env create \
  --name appointment-env \
  --resource-group appointment-rg \
  --location eastus

# Deploy doctor service
az containerapp create \
  --name doctor-service \
  --resource-group appointment-rg \
  --environment appointment-env \
  --image yourdockerhub/appointment-doctor-service:latest \
  --target-port 3002 \
  --ingress external \
  --env-vars MONGO_URI=secretref:mongo-uri \
  --cpu 0.25 --memory 0.5Gi

# Get URL
az containerapp show \
  --name doctor-service \
  --resource-group appointment-rg \
  --query properties.configuration.ingress.fqdn \
  --output tsv
```

---

### Phase 9: Testing & Validation (Week 4)

#### 9.1 Unit Testing

**Install Jest:**
```bash
npm install --save-dev jest supertest
```

**Create Tests:** `tests/unit/doctorController.test.js`
```javascript
const request = require('supertest');
const app = require('../../src/index');
const Doctor = require('../../src/models/doctorModel');

describe('Doctor Controller', () => {
  describe('POST /doctors', () => {
    it('should create a new doctor', async () => {
      const doctorData = {
        name: 'Dr. Test',
        specialization: 'Testing',
        contact: '+1234567890'
      };
      
      const response = await request(app)
        .post('/doctors')
        .send(doctorData)
        .expect(201);
      
      expect(response.body.name).toBe('Dr. Test');
    });
    
    it('should return 400 for invalid data', async () => {
      await request(app)
        .post('/doctors')
        .send({ name: 'Dr' })
        .expect(400);
    });
  });
});
```

#### 9.2 Integration Testing

**Create:** `tests/integration/appointment-creation.test.js`
```javascript
const axios = require('axios');

describe('Appointment Creation Integration', () => {
  const BASE_URL = process.env.API_URL || 'http://localhost:3000';
  
  it('should create appointment with valid user and doctor', async () => {
    // 1. Create user
    const userRes = await axios.post(`${BASE_URL}/users/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    const userId = userRes.data.user.id;
    
    // 2. Create doctor
    const doctorRes = await axios.post(`${BASE_URL}/doctors`, {
      name: 'Dr. Test',
      specialization: 'Cardiologist'
    });
    const doctorId = doctorRes.data._id;
    
    // 3. Create appointment (tests integration)
    const appointmentRes = await axios.post(`${BASE_URL}/appointments`, {
      userId,
      doctorId,
      appointmentDate: '2026-04-01T10:00:00Z',
      reason: 'Checkup'
    });
    
    expect(appointmentRes.status).toBe(201);
    expect(appointmentRes.data.appointment.userId).toBe(userId);
    expect(appointmentRes.data.appointment.doctorId).toBe(doctorId);
  });
  
  it('should return 400 for invalid user', async () => {
    try {
      await axios.post(`${BASE_URL}/appointments`, {
        userId: '000000000000000000000000',
        doctorId: 'valid-doctor-id',
        appointmentDate: '2026-04-01T10:00:00Z'
      });
      fail('Should have thrown error');
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toContain('User not found');
    }
  });
});
```

**Run Tests:**
```bash
npm test
npm run test:coverage
npm run test:integration
```

---

## 📐 Architecture Design

### System Architecture Diagram

**Create using draw.io, Lucidchart, or similar tools**

**Key Components to Show:**
1. **Frontend Layer:**
   - React Admin Panel
   - Firebase Authentication

2. **API Gateway Layer:**
   - API Gateway (Port 3000)
   - Load Balancer (AWS ALB)

3. **Microservices Layer:**
   - User Service (Port 3001)
   - Doctor Service (Port 3002)
   - Appointment Service (Port 3003)
   - Feedback Service (Port 3004)

4. **Data Layer:**
   - MongoDB Atlas Clusters (one per service)

5. **Cloud Infrastructure:**
   - AWS ECS Fargate
   - VPC with subnets
   - Security Groups
   - IAM Roles
   - CloudWatch Logs

6. **CI/CD Pipeline:**
   - GitHub
   - GitHub Actions
   - Docker Hub
   - SonarCloud
   - Snyk

**Communication Flows to Illustrate:**
```
User → Admin Panel → API Gateway → Services
Appointment Service → User Service (verify user)
Appointment Service → Doctor Service (verify doctor)
Appointment Service → Feedback Service (notify completion)
Doctor Service → Feedback Service (get ratings)
```

---

## 🔗 Service-to-Service Integration Details

### Integration Example 1: Appointment Creation

**Sequence Diagram:**
```
Admin Panel              API Gateway         Appointment Service    User Service    Doctor Service
    |                        |                       |                    |                |
    |--POST /appointments--->|                       |                    |                |
    |                        |----Forward----------->|                    |                |
    |                        |                       |                    |                |
    |                        |                       |--GET /users/:id--->|                |
    |                        |                       |<---User Data-------|                |
    |                        |                       |                    |                |
    |                        |                       |--GET /doctors/:id----------------->|
    |                        |                       |<---Doctor Data---------------------|
    |                        |                       |                    |                |
    |                        |                       |---Save to MongoDB  |                |
    |                        |<---Appointment--------|                    |                |
    |<---Success-------------|                       |                    |                |
```

**Implementation Key Points:**
- Appointment service makes HTTP calls to User and Doctor services
- Use axios with timeout (5 seconds)
- Handle failures gracefully (return 400 if user/doctor not found)
- Log all cross-service calls
- Add retry logic for transient failures

### Integration Example 2: Doctor Listing with Ratings

**Flow:**
1. Admin requests doctor list
2. Doctor service fetches all doctors from MongoDB
3. For each doctor, calls Feedback service to get average rating
4. Merges rating data with doctor info
5. Returns enriched response

**Implementation:**
- Use Promise.all for parallel requests
- Cache ratings (Redis - optional)
- Default to 0 if no ratings found
- Handle feedback service downtime gracefully

---

## 📝 Project Report Structure

### Report Outline (20-30 pages)

**1. Executive Summary (1 page)**
- Project overview
- Group members and responsibilities
- Technology stack summary
- Key achievements

**2. Introduction (2 pages)**
- Background and motivation
- Project objectives
- Application domain (healthcare appointment system)
- Scope and limitations

**3. System Architecture (5-7 pages)**
- Architecture diagram (full page)
- Microservices description
- Technology choices and rationale
- Design decisions
- Database schema (each service)
- Communication patterns

**4. Microservices Implementation (8-10 pages)**

For each service (2-2.5 pages each):
- **Student Name & Service:** User/Doctor/Appointment/Feedback Service
- **Functionality:** What it does
- **Endpoints:** API table with methods, paths, descriptions
- **Database Schema:** MongoDB collections and fields
- **Business Logic:** Key algorithms/validations
- **Integration Points:** Which services it calls/is called by
- **Challenges Faced:** Problems and solutions

**5. Inter-Service Communication (3-4 pages)**
- Communication strategy (REST APIs)
- Integration patterns used
- Example workflow (appointment creation)
- Error handling and resilience
- Sequence diagrams

**6. DevOps Implementation (3-4 pages)**
- Version control strategy
- Repository structure
- CI/CD pipeline architecture
- GitHub Actions workflow explanation
- Automated testing
- Deployment automation

**7. Containerization (2 pages)**
- Docker strategy
- Dockerfile optimization
- Docker Compose setup
- Container registry (Docker Hub)
- Image versioning

**8. Cloud Deployment (3-4 pages)**
- Cloud provider choice (AWS/Azure)
- Infrastructure setup
- ECS/Container Apps configuration
- Load balancing
- Networking (VPC, subnets)
- Scalability considerations

**9. Security Implementation (3-4 pages)**
- Authentication (JWT)
- Authorization (role-based)
- Input validation
- Security middleware (helmet, rate limiting)
- Cloud security (IAM, security groups)
- Secrets management
- DevSecOps practices (SonarCloud, Snyk)
- SAST scan results and fixes

**10. Testing & Quality Assurance (2 pages)**
- Unit testing approach
- Integration testing
- Manual testing scenarios
- Code coverage results
- Performance testing (optional)

**11. Challenges & Solutions (2-3 pages)**
- Technical challenges faced
- Integration issues
- Deployment problems
- Team coordination challenges
- How issues were resolved
- Lessons learned

**12. Future Enhancements (1 page)**
- Potential improvements
- Additional features
- Scalability plans
- Technology upgrades

**13. Conclusion (1 page)**
- Summary of achievements
- Skills acquired
- Project success evaluation

**14. References**
- Documentation links
- Technology references
- Tutorials followed

**15. Appendices**
- Complete API documentation
- GitHub repository links
- Deployment URLs
- Screenshots
- Code snippets (important ones)

---

## 🎯 Demonstration Plan (10 Minutes)

### Demo Script

**Minute 0-1: Introduction**
- Team introduction
- Project overview
- Architecture diagram walkthrough
- Show all 4 running services

**Minute 1-2: Architecture & Repositories**
- Open GitHub repositories (4 repos)
- Show repository structure
- Point out key files (Dockerfile, openapi.yaml, CI/CD workflow)
- Show commit history

**Minute 2-4: Live Application Demo**
1. **Create User** (30 sec)
   - Open admin panel
   - Register new user
   - Show user created in User Service

2. **Add Doctor** (30 sec)
   - Add new doctor
   - Show doctor in Doctor Service

3. **Book Appointment** (45 sec)
   - Create appointment with above user & doctor
   - Show integration: Appointment Service → User Service
   - Show integration: Appointment Service → Doctor Service
   - Show appointment created

4. **Complete & Feedback** (45 sec)
   - Mark appointment as completed
   - Show integration: Appointment Service → Feedback Service
   - Submit feedback
   - View doctor rating updated

**Minute 4-5: Inter-Service Communication**
- Open browser developer tools / Postman
- Show API calls between services
- Demonstrate what happens if user doesn't exist
- Show error handling

**Minute 5-7: DevOps Pipeline**
1. **Version Control** (30 sec)
   - Show GitHub repository
   - Make a small code change
   - Commit and push

2. **CI/CD Execution** (90 sec)
   - Show GitHub Actions running
   - Show pipeline stages:
     ✓ Tests passing
     ✓ Snyk security scan
     ✓ SonarCloud quality gate
     ✓ Docker image built
     ✓ Pushed to Docker Hub
     ✓ Deployment to AWS ECS
   - Show Docker Hub with new image

**Minute 7-8: Cloud Infrastructure**
- Show AWS Console (or Azure)
- Show ECS cluster with 4 running services
- Show Application Load Balancer
- Show CloudWatch logs
- Show public URLs working

**Minute 8-9: Security Measures**
1. **Cloud Security** (30 sec)
   - Show IAM roles
   - Show Security Groups (port restrictions)
   - Show Secrets Manager

2. **DevSecOps** (30 sec)
   - Show SonarCloud dashboard (code quality, security issues)
   - Show Snyk dashboard (vulnerability scan results)
   - Show how issues were fixed

3. **Application Security** (30 sec)
   - Show JWT token in API call
   - Show rate limiting in action
   - Test protected endpoint without token (401 error)
   - Test with token (success)

**Minute 9-10: Q&A**
- Answer examiner questions
- Show additional features if asked
- Clarify any technical details

### Demonstration Checklist

**Before Demo Day:**
- [ ] All services deployed and running
- [ ] Frontend accessible via public URL
- [ ] Backend APIs accessible via public URL
- [ ] Sample data populated (users, doctors)
- [ ] CI/CD pipeline working
- [ ] Security scans passed
- [ ] All GitHub repositories public
- [ ] README files complete
- [ ] API documentation (Swagger) accessible
- [ ] Architecture diagram prepared (printed/digital)
- [ ] Demo script practiced
- [ ] Backup plan (local docker-compose if cloud fails)
- [ ] Screen recording of working system (backup)

---

## ✅ Complete Checklist & Timeline

### Week 1: Service Development

**Day 1-2: Complete User Service**
- [ ] Implement user registration with password hashing
- [ ] Implement user login with JWT generation
- [ ] Add user CRUD operations
- [ ] Add input validation
- [ ] Create unit tests
- [ ] Document API in openapi.yaml
- [ ] Commit to version control

**Day 3-4: Complete Appointment Service**
- [ ] Implement appointment creation
- [ ] Add integration with User Service (verify user)
- [ ] Add integration with Doctor Service (verify doctor)
- [ ] Add conflict checking
- [ ] Add status management
- [ ] Create unit and integration tests
- [ ] Document API

**Day 5-6: Complete Feedback Service**
- [ ] Implement feedback submission
- [ ] Add rating calculation
- [ ] Add integration with Doctor Service
- [ ] Add notification endpoint for Appointment Service
- [ ] Create tests
- [ ] Document API

**Day 7: Integration Testing**
- [ ] Test end-to-end appointment flow
- [ ] Verify all inter-service calls work
- [ ] Fix any integration bugs
- [ ] Document integration points

---

### Week 2: DevOps Setup

**Day 1: Version Control**
- [ ] Create 4 GitHub repositories
- [ ] Push service code to respective repos
- [ ] Add README files
- [ ] Add .env.example files
- [ ] Tag initial release (v1.0)

**Day 2: API Documentation**
- [ ] Create openapi.yaml for all 4 services
- [ ] Add Swagger UI to each service
- [ ] Test documentation locally
- [ ] Publish documentation

**Day 3-4: CI/CD Pipeline**
- [ ] Create GitHub Actions workflows
- [ ] Set up Docker Hub accounts
- [ ] Configure GitHub secrets
- [ ] Test pipeline with dummy push
- [ ] Fix any pipeline issues

**Day 5: Containerization**
- [ ] Create/optimize Dockerfiles
- [ ] Update docker-compose.yml
- [ ] Test local docker deployment
- [ ] Push images to Docker Hub

**Day 6-7: SAST Integration**
- [ ] Set up SonarCloud projects
- [ ] Set up Snyk projects
- [ ] Integrate into CI/CD
- [ ] Fix critical security issues
- [ ] Run full scans

---

### Week 3: Security & Cloud

**Day 1-2: Security Implementation**
- [ ] Implement JWT authentication
- [ ] Add authorization middleware
- [ ] Add input validation (Joi)
- [ ] Add security middleware (helmet, rate limiting)
- [ ] Add CORS configuration
- [ ] Test security features

**Day 3: Cloud Setup**
- [ ] Create AWS/Azure account
- [ ] Set up CLI tools
- [ ] Create cloud resources
  - [ ] Container registry (or use Docker Hub)
  - [ ] Container orchestration cluster
  - [ ] Load balancer
  - [ ] VPC/networking
  - [ ] Security groups
  - [ ] IAM roles

**Day 4-5: Deployment**
- [ ] Create task definitions / deployment configs
- [ ] Deploy User Service
- [ ] Deploy Doctor Service
- [ ] Deploy Appointment Service
- [ ] Deploy Feedback Service
- [ ] Deploy API Gateway
- [ ] Configure load balancer routing
- [ ] Test all endpoints

**Day 6: Security Hardening**
- [ ] Configure IAM with least privilege
- [ ] Set up security groups properly
- [ ] Store secrets in Secrets Manager
- [ ] Enable HTTPS (optional)
- [ ] Test security configurations

**Day 7: Testing & Validation**
- [ ] End-to-end testing on cloud
- [ ] Load testing (basic)
- [ ] Security testing
- [ ] Fix any issues

---

### Week 4: Documentation & Demo

**Day 1-2: Report Writing**
- [ ] Write architecture section
- [ ] Document each service
- [ ] Write integration details
- [ ] Document DevOps practices
- [ ] Document security measures
- [ ] Add screenshots and diagrams

**Day 3: Architecture Diagram**
- [ ] Create comprehensive architecture diagram
- [ ] Show all services and connections
- [ ] Show cloud infrastructure
- [ ] Show CI/CD pipeline
- [ ] Export high-resolution version

**Day 4-5: Demo Preparation**
- [ ] Write demo script
- [ ] Practice demonstration
- [ ] Prepare sample data
- [ ] Create backup plan
- [ ] Record demo video (backup)
- [ ] Test all demo scenarios

**Day 6: Final Review**
- [ ] Proofread report
- [ ] Check all repository links work
- [ ] Verify all services running
- [ ] Test CI/CD one more time
- [ ] Check API documentation accessible

**Day 7: Submission**
- [ ] Submit report
- [ ] Provide repository links
- [ ] Provide deployment URLs
- [ ] Ready for demonstration

---

## 📌 Quick Reference

### Essential Commands

**Local Development:**
```bash
# Start all services
docker-compose up --build

# Start individual service
cd doctor-service && npm run dev

# Run tests
npm test

# Security scan
npm run test:security
```

**Git Workflow:**
```bash
git add .
git commit -m "feat: add integration with user service"
git push origin main
```

**Docker:**
```bash
# Build
docker build -t yourusername/appointment-doctor-service:v1.0 .

# Push
docker push yourusername/appointment-doctor-service:v1.0

# Run locally
docker run -p 3002:3002 --env-file .env yourusername/appointment-doctor-service:v1.0
```

**AWS Deployment:**
```bash
# Update service
aws ecs update-service --cluster appointment-cluster --service doctor-service --force-new-deployment

# Check status
aws ecs describe-services --cluster appointment-cluster --services doctor-service

# View logs
aws logs tail /ecs/doctor-service --follow
```

---

## 🎓 Key Points for Assessment

### For Each Criterion

**1. Practicality & Functionality (10%)**
- All CRUD operations work
- Services integrate successfully
- No critical bugs
- Handles edge cases

**2. DevOps & Cloud Capabilities (30%)**
- CI/CD pipeline runs automatically
- Docker images in registry
- Deployed on cloud provider
- Services are accessible via internet
- Proper version control

**3. Inter-Service Communication (10%)**
- At least 3 integration points working
- Demonstrates during demo clearly
- Error handling in place
- Well documented

**4. Security Measures (20%)**
- JWT authentication implemented
- IAM roles configured
- Security groups configured
- SAST tools integrated (SonarCloud, Snyk)
- Input validation present
- Rate limiting implemented

**5. Code Quality (20%)**
- Clean, readable code
- Proper error handling
- Consistent naming conventions
- Comments where needed
- Tests written
- No code smells (per SonarCloud)

**6. Report & Demo Clarity (10%)**
- Architecture diagram clear
- Report well-structured
- Demo flows smoothly
- Can explain technical decisions
- Q&A handled well

---

## 🚀 Final Tips

1. **Start Early:** Don't wait until last week
2. **Test Integration Early:** Service communication is critical
3. **Keep It Simple:** Working basic features > broken advanced features
4. **Document Everything:** As you go, not at the end
5. **Use Free Tiers:** AWS Free Tier for 1 year, Azure free trial, Docker Hub free account
6. **Practice Demo:** Multiple times before presentation
7. **Have Backup:** Local docker-compose if cloud fails during demo
8. **Team Communication:** Daily standups, shared task board
9. **Git Commits:** Commit frequently with clear messages
10. **Ask for Help:** Use Stack Overflow, AWS docs, office hours

---

## 📚 Useful Resources

**Documentation:**
- Express.js: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- Docker: https://docs.docker.com
- AWS ECS: https://docs.aws.amazon.com/ecs
- GitHub Actions: https://docs.github.com/actions

**Tutorials:**
- Microservices: https://microservices.io
- JWT Authentication: https://jwt.io/introduction
- Docker Compose: https://docs.docker.com/compose

**Tools:**
- Architecture Diagrams: draw.io, Lucidchart
- API Testing: Postman
- Code Quality: SonarCloud
- Security Scanning: Snyk

---

## 🎯 Success Criteria

Your project will be successful if you can demonstrate:

✅ 4 working microservices deployed on cloud
✅ Inter-service communication with at least 3 examples
✅ CI/CD pipeline that automates deployment
✅ Security measures at both application and cloud level
✅ SAST tools integrated with scans passing
✅ Clean, well-documented code
✅ Comprehensive project report
✅ Smooth 10-minute demonstration

---

**Good luck with your Cloud Computing assignment!** 🌟

For questions or clarifications, ensure each team member understands their service responsibilities and how services integrate together. Regular team meetings are essential for success.
