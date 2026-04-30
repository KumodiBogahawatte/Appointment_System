# Quick Reference: GitHub Secrets & Cloud Run

## 🔑 GitHub Secrets to Add (Quick Copy-Paste Template)

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

### GCP Secrets (Get from gcloud commands)
```
GCP_PROJECT_ID = your-project-id
GCP_WORKLOAD_IDENTITY_PROVIDER = projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github-provider
GCP_SERVICE_ACCOUNT = github-actions-sa@your-project-id.iam.gserviceaccount.com
```

### Database Secrets (From MongoDB Atlas)
```
MONGO_URI_USER = mongodb+srv://user:password@cluster.mongodb.net/userservice_db
MONGO_URI_DOCTOR = mongodb+srv://doctor:password@cluster.mongodb.net/doctorservice_db
MONGO_URI_APPOINTMENT = mongodb+srv://appointment:password@cluster.mongodb.net/appointmentservice_db
MONGO_URI_FEEDBACK = mongodb+srv://feedback:password@cluster.mongodb.net/feedbackservice_db
```

### Application Secrets
```
JWT_SECRET = (generate with: openssl rand -base64 32)
```

### Firebase Secrets (From Firebase Console)
```
VITE_FIREBASE_API_KEY = AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN = your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = your-project-id
VITE_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = 123456789
VITE_FIREBASE_APP_ID = 1:123456789:web:xxx
```

### Frontend URLs (Temporary - update after first deployment)
```
VITE_API_GATEWAY_URL = http://localhost:3000
VITE_API_URL = http://localhost:3000
```

### Backend Service URLs (Temporary - update after first deployment)
```
USER_SERVICE_URL = http://localhost:3001
DOCTOR_SERVICE_URL = http://localhost:3002
APPOINTMENT_SERVICE_URL = http://localhost:3003
FEEDBACK_SERVICE_URL = http://localhost:3004
```

## 🚀 Deployment Commands

### Generate JWT Secret
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Get GCP Values
```bash
# Project ID
gcloud config get-value project

# Project Number
gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)'

# Workload Identity Provider resource name
gcloud iam workload-identity-pools describe "github-pool" \
  --project="YOUR_PROJECT_ID" \
  --location="global" \
  --format='value(name)'

# Service account email
echo "github-actions-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com"
```

### Deploy Locally
```bash
# Copy env template
cp .env.example .env

# Edit with your values
nano .env

# Run with Docker
docker compose up --build

# Or run without Docker
cd user-service && npm install && npm start
cd doctor-service && npm install && npm start
# ... etc for other services
```

### Get Cloud Run URLs (After deployment)
```bash
gcloud run services list --region us-central1

# Get specific URL
gcloud run services describe user-service --region us-central1 --format='value(status.url)'
```

### View Logs
```bash
# View service logs
gcloud run services logs read user-service --region us-central1

# Follow live
gcloud run services logs read user-service --region us-central1 --follow

# Last 100 lines
gcloud run services logs read user-service --region us-central1 --limit=100
```

## 📝 Workflow (After Setup)

```
1. Configure GitHub Secrets ✓
   ↓
2. Push to GitHub
   git push origin main
   ↓
3. Monitor GitHub Actions
   GitHub → Actions → cloud-run-deploy
   ↓
4. Get Cloud Run URLs
   gcloud run services list
   ↓
5. Update GitHub Secrets with real URLs
   VITE_API_GATEWAY_URL = https://api-gateway-xxxxx.a.run.app
   USER_SERVICE_URL = https://user-service-xxxxx.a.run.app
   ... (all other service URLs)
   ↓
6. Push another commit
   git commit --allow-empty -m "Update service URLs"
   git push origin main
   ↓
7. Monitor second deployment
   ↓
8. Test services
   curl https://api-gateway-xxxxx.a.run.app/health
```

## 🧪 Test Commands

### Health Checks
```bash
# Each service has a health endpoint
curl https://user-service-xxxxx.a.run.app/health
curl https://doctor-service-xxxxx.a.run.app/health
curl https://appointment-service-xxxxx.a.run.app/health
curl https://feedback-service-xxxxx.a.run.app/health
curl https://api-gateway-xxxxx.a.run.app/health
```

### Create Test Data
```bash
# Create a doctor
curl -X POST https://api-gateway-xxxxx.a.run.app/doctors \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. Smith","specialization":"Cardiology","email":"dr@example.com"}'

# Register a user
curl -X POST https://api-gateway-xxxxx.a.run.app/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"securepass123"}'

# Create appointment
curl -X POST https://api-gateway-xxxxx.a.run.app/appointments \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","doctorId":"DOCTOR_ID","date":"2026-05-15"}'
```

## 🐛 Troubleshooting Commands

### Check if all secrets are set
```bash
# In GitHub repository settings, verify:
Settings → Secrets and variables → Actions
# Should show all secrets (values hidden as ***)
```

### Verify Docker images were built
```bash
gcloud container images list --project YOUR_PROJECT_ID
```

### Check service status
```bash
gcloud run services describe user-service --region us-central1
```

### See latest deployments
```bash
gcloud run services list --region us-central1
```

### Test database connection locally
```bash
# Copy the MONGO_URI from GitHub Secret
# Test it in MongoDB Compass or with mongosh:
mongosh "mongodb+srv://user:password@cluster.mongodb.net/userservice_db"
```

## 📋 Checklist

Before pushing to GitHub:
- [ ] All GitHub Secrets are set
- [ ] MongoDB URIs are correct
- [ ] JWT secret is strong (use openssl rand -base64 32)
- [ ] Firebase config is correct
- [ ] GCP project is set up
- [ ] Workload Identity Federation is configured

After first deployment:
- [ ] All services are running on Cloud Run
- [ ] Got all service URLs
- [ ] Updated GitHub Secrets with real URLs
- [ ] Pushed second commit

After second deployment:
- [ ] Services communicate with each other
- [ ] Database connections work
- [ ] Frontends load in browser
- [ ] Can create/read data through API

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| GitHub Repository | https://github.com/YOUR_USERNAME/Appointment_System |
| GitHub Actions | Repository → Actions → cloud-run-deploy |
| GCP Console | https://console.cloud.google.com |
| Cloud Run Services | Console → Cloud Run |
| MongoDB Atlas | https://cloud.mongodb.com |
| Firebase Console | https://console.firebase.google.com |

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| Workflow fails | Check GitHub Actions logs |
| Service unavailable | Check `gcloud run services logs read` |
| Database connection fails | Verify MONGO_URI secret and MongoDB IP allowlist |
| Services can't talk to each other | Update service URL secrets and redeploy |
| Frontend doesn't load | Check browser console for errors |
| Build times out | Increase Docker build timeout in workflow |

## 🎯 Success Indicators

✅ All green in GitHub Actions  
✅ Cloud Run shows all services running  
✅ Can access `https://admin-frontend-xxxxx.a.run.app` in browser  
✅ Database operations work (create/read/update/delete)  
✅ Logs show successful deployments  

---

**Tip:** Bookmark these commands for quick access!  
**Need help?** See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed explanations.
