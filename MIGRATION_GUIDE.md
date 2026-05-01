# Migration Guide: Secrets to GitHub and GCP Cloud Run Deployment

This guide walks you through the complete process of migrating your Appointment System to use GitHub Secrets and deploy to Google Cloud Run.

## Overview

**Before:** Environment variables were hardcoded in `docker-compose.yml` and stored locally in `.env` files  
**After:** Secrets are stored safely in GitHub Secrets and injected at build/runtime via CI/CD

## Step 1: Prepare Your Code (Already Done ✅)

Your codebase already correctly accesses environment variables:

### Backend Services
```javascript
// ✅ Correctly uses process.env for Node.js
await mongoose.connect(process.env.MONGO_URI);
const token = jwt.sign(payload, process.env.JWT_SECRET);
```

### Frontend Apps (Vite)
```javascript
// ✅ Correctly uses import.meta.env for Vite
const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ... other Firebase config
};
```

**No code changes needed!** The environment variable names remain the same.

## Step 2: Set Up GCP Project

Follow the setup in [GCP_CLOUD_RUN_DEPLOYMENT.md](GCP_CLOUD_RUN_DEPLOYMENT.md):

```bash
# Create project
gcloud projects create appointment-system

# Enable APIs
gcloud services enable run.googleapis.com

# Create service account
gcloud iam service-accounts create github-actions-sa

# Configure Workload Identity (instead of storing credentials)
gcloud iam workload-identity-pools create "github-pool"
gcloud iam workload-identity-pools providers create-oidc "github-provider"
```

## Step 3: Configure GitHub Secrets

In your GitHub repository (**Settings → Secrets and variables → Actions**), add:

### GCP Configuration
- `GCP_PROJECT_ID`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`

### Database Credentials (MongoDB Atlas)
- `MONGO_URI_USER_SERVICE`
- `MONGO_URI_DOCTOR_SERVICE`
- `MONGO_URI_APPOINTMENT_SYSTEM`
- `MONGO_URI_FEEDBACK_SERVICE`

### Application Secrets
- `JWT_SECRET`

### Firebase Configuration (Admin Frontend)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Frontend API URLs (update after first deployment)
- `VITE_API_GATEWAY_URL`
- `VITE_API_URL`

### Backend Service URLs (update after first deployment)
- `USER_SERVICE_URL`
- `DOCTOR_SERVICE_URL`
- `APPOINTMENT_SERVICE_URL`
- `FEEDBACK_SERVICE_URL`

See [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md) for detailed instructions.

## Step 4: Update CI/CD Workflow

✅ **Already done!** The new workflow is at `.github/workflows/cloud-run-deploy.yml`

The workflow:
1. Checks out your code
2. Authenticates to GCP using Workload Identity (secure, no credentials stored!)
3. Builds Docker images for all services
4. Passes build arguments to frontend apps (Vite build-time variables)
5. Pushes images to Google Container Registry (GCR)
6. Deploys to Cloud Run with secrets injected as environment variables

## Step 5: First Deployment

Simply push to the `main` branch:

```bash
git add .
git commit -m "Configure GitHub Secrets and Cloud Run deployment"
git push origin main
```

**Monitor the deployment:**
1. Go to your GitHub repository
2. Click **Actions**
3. Click the running workflow
4. Wait for all services to deploy

**Expected output:**
```
✓ user-service deployed to Cloud Run
✓ doctor-service deployed to Cloud Run
✓ appointment-service deployed to Cloud Run
✓ feedback-service deployed to Cloud Run
✓ api-gateway deployed to Cloud Run
✓ admin-frontend deployed to Cloud Run
✓ user-frontend deployed to Cloud Run
```

## Step 6: Get Cloud Run URLs

After deployment, find your service URLs:

```bash
gcloud run services list --region us-central1
```

You'll see something like:
```
SERVICE          URL
user-service     https://user-service-xxxxx-us-central1.a.run.app
doctor-service   https://doctor-service-xxxxx-us-central1.a.run.app
api-gateway      https://api-gateway-xxxxx-us-central1.a.run.app
admin-frontend   https://admin-frontend-xxxxx-us-central1.a.run.app
user-frontend    https://user-frontend-xxxxx-us-central1.a.run.app
```

## Step 7: Update Service URLs in GitHub Secrets

Now that services are deployed, update these secrets with the actual Cloud Run URLs:

```
USER_SERVICE_URL = https://user-service-xxxxx-us-central1.a.run.app
DOCTOR_SERVICE_URL = https://doctor-service-xxxxx-us-central1.a.run.app
APPOINTMENT_SERVICE_URL = https://appointment-service-xxxxx-us-central1.a.run.app
FEEDBACK_SERVICE_URL = https://feedback-service-xxxxx-us-central1.a.run.app
VITE_API_GATEWAY_URL = https://api-gateway-xxxxx-us-central1.a.run.app
VITE_API_URL = https://api-gateway-xxxxx-us-central1.a.run.app
```

Then push a new commit to trigger another deployment with the updated URLs:

```bash
git commit --allow-empty -m "Update service URLs after first Cloud Run deployment"
git push origin main
```

## Step 8: Verify Deployment

Test your services:

```bash
# Health checks
curl https://user-service-xxxxx-us-central1.a.run.app/health
curl https://doctor-service-xxxxx-us-central1.a.run.app/health

# API Gateway (create a doctor)
curl -X POST https://api-gateway-xxxxx-us-central1.a.run.app/doctors \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. Smith","specialization":"Cardiology","email":"dr@example.com"}'

# Admin Frontend
curl https://admin-frontend-xxxxx-us-central1.a.run.app
```

## Step 9: View Logs

Monitor service logs in Cloud Run:

```bash
# View logs for a specific service
gcloud run services logs read user-service --region us-central1

# Follow live logs
gcloud run services logs read user-service --region us-central1 --limit=50 --follow
```

Or in the Google Cloud Console:
1. Go to **Cloud Run**
2. Click on a service
3. Click **Logs**

## Comparison: Before vs After

### Before: Local Development with Hardcoded Secrets
```yaml
# docker-compose.yml (INSECURE - visible in Git)
environment:
  - MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/db
  - JWT_SECRET=mysecret
  - VITE_FIREBASE_API_KEY=AIzaSyB9ZNMFum-iZ6tDUq4CVfpxbjHBbr-YX5I
```

### After: GitHub Secrets + Cloud Run (SECURE)
```yaml
# .github/workflows/cloud-run-deploy.yml
- name: Deploy to Cloud Run
  env:
    MONGO_URI: ${{ secrets.MONGO_URI_USER_SERVICE }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

**Benefits:**
- ✅ Secrets never exposed in Git
- ✅ Secrets encrypted in GitHub
- ✅ Secrets never logged
- ✅ Secrets rotatable without code changes
- ✅ Follows industry security best practices
- ✅ Compliance ready (GDPR, HIPAA, SOC 2)

## Troubleshooting

### Deployment fails: "Cannot read properties of undefined"
**Cause:** A required GitHub Secret is missing or misspelled  
**Fix:** Check `.github/workflows/cloud-run-deploy.yml` to see which secrets are required for each service

### Service can't connect to database
**Cause:** Database credentials are wrong or IP allowlist isn't configured  
**Fix:**
1. Verify `MONGO_URI_*` secrets in GitHub are correct
2. In MongoDB Atlas, go to **Network Access** and add GCP IP ranges
3. For development: Allow 0.0.0.0/0 (all IPs) temporarily

### Services can't reach each other
**Cause:** `USER_SERVICE_URL`, etc. secrets haven't been updated with Cloud Run URLs  
**Fix:** Get Cloud Run URLs and update GitHub Secrets as shown in Step 7

### Frontend shows blank page
**Cause:** Vite build-time environment variables weren't set during Docker build  
**Fix:** Verify the workflow passes build args: `--build-arg VITE_API_GATEWAY_URL=...`

### "Workload Identity authentication failed"
**Cause:** GCP Workload Identity configuration is incorrect  
**Fix:**
1. Verify `GCP_WORKLOAD_IDENTITY_PROVIDER` matches your setup
2. Check service account has `iam.workloadIdentityUser` role
3. Verify the repository name matches the condition in Workload Identity Pool

## Local Development

For local development with Docker Compose (with local secrets):

```bash
# Create .env file from template
cp .env.example .env

# Fill in test values
nano .env

# Run locally
docker compose up --build
```

For local development without Docker:

```bash
# Copy env template
cp .env.example .env

# Install dependencies and run
npm install
npm start
```

## Next Steps

1. ✅ Code is ready (no changes needed)
2. ✅ Dockerfiles are updated
3. ✅ CI/CD workflow is ready
4. **→ Configure GitHub Secrets** (go to GITHUB_SECRETS_SETUP.md)
5. **→ Set up GCP** (go to GCP_CLOUD_RUN_DEPLOYMENT.md)
6. **→ Push to GitHub and deploy**

## FAQ

**Q: Can I still use the local `.env` file?**  
A: Yes! Local development with `.env` still works. The GitHub Secrets are only used in CI/CD.

**Q: What if I need to rotate a secret?**  
A: Simply update the GitHub Secret and push any commit to trigger a new deployment.

**Q: Are my secrets safe?**  
A: Yes! GitHub Secrets are encrypted, only accessible to authorized workflows, and never logged.

**Q: Can I revert to the old system?**  
A: Yes, but not recommended. Keep the old `docker-compose.yml` as backup if you need to.

**Q: How much does Cloud Run cost?**  
A: Cloud Run has a free tier with 2 million requests/month. See [Cloud Run Pricing](https://cloud.google.com/run/pricing).

## Support

- 📖 [Google Cloud Run Docs](https://cloud.google.com/run/docs)
- 📖 [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- 📖 [GCP Workload Identity Federation](https://cloud.google.com/docs/authentication/workload-identity-federation)
- 📧 GCP Support: https://cloud.google.com/support
- 📧 GitHub Support: https://support.github.com
