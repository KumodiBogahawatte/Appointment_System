# GCP Cloud Run Deployment Guide with GitHub Secrets

This guide walks you through deploying the Appointment System to Google Cloud Run using GitHub Actions and GitHub Secrets.

## Prerequisites

- Google Cloud Platform (GCP) account with billing enabled
- GitHub repository with this code
- `gcloud` CLI installed locally
- Docker installed locally

## Step 1: Set Up GCP Project

```bash
# Create a new GCP project
gcloud projects create appointment-system --name="Appointment System"

# Set the project
gcloud config set project appointment-system

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Create a service account for GitHub Actions
gcloud iam service-accounts create github-actions-sa \
  --display-name="GitHub Actions Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding appointment-system \
  --member=serviceAccount:github-actions-sa@appointment-system.iam.gserviceaccount.com \
  --role=roles/run.admin

gcloud projects add-iam-policy-binding appointment-system \
  --member=serviceAccount:github-actions-sa@appointment-system.iam.gserviceaccount.com \
  --role=roles/storage.admin

gcloud projects add-iam-policy-binding appointment-system \
  --member=serviceAccount:github-actions-sa@appointment-system.iam.gserviceaccount.com \
  --role=roles/iam.serviceAccountUser
```

## Step 2: Configure Workload Identity Federation

This allows GitHub Actions to authenticate with GCP without storing credentials.

```bash
# Enable the required services
gcloud services enable iap.googleapis.com
gcloud services enable sts.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable serviceusage.googleapis.com

# Create a Workload Identity Provider
gcloud iam workload-identity-pools create "github-pool" \
  --project="appointment-system" \
  --location="global" \
  --display-name="GitHub Pool"

# Get the workload identity provider resource name
WORKLOAD_IDENTITY_PROVIDER=$(gcloud iam workload-identity-pools describe "github-pool" \
  --project="appointment-system" \
  --location="global" \
  --format='value(name)')

# Create workload identity provider credential
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project="appointment-system" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,assertion.aud=assertion.aud,assertion.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-condition="assertion.aud == 'https://github.com/YOUR_GITHUB_ORG' || assertion.repository == 'YOUR_GITHUB_USERNAME/Appointment_System'"

# Grant the GitHub Actions service account access
gcloud iam service-accounts add-iam-policy-binding github-actions-sa@appointment-system.iam.gserviceaccount.com \
  --project="appointment-system" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/YOUR_GITHUB_USERNAME/Appointment_System"

# Get the workload identity provider resource name again and save it
echo $WORKLOAD_IDENTITY_PROVIDER
```

## Step 3: Add GitHub Secrets

In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add the following secrets:

### GCP Secrets

```
GCP_PROJECT_ID: your-project-id
GCP_WORKLOAD_IDENTITY_PROVIDER: projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider
GCP_SERVICE_ACCOUNT: github-actions-sa@appointment-system.iam.gserviceaccount.com
```

### Database Secrets (MongoDB Atlas URIs)

```
MONGO_URI_USER: mongodb+srv://user:password@cluster.mongodb.net/userservice_db?retryWrites=true&w=majority
MONGO_URI_DOCTOR: mongodb+srv://doctor:password@cluster.mongodb.net/doctorservice_db?retryWrites=true&w=majority
MONGO_URI_APPOINTMENT: mongodb+srv://appointment:password@cluster.mongodb.net/appointmentservice_db?retryWrites=true&w=majority
MONGO_URI_FEEDBACK: mongodb+srv://feedback:password@cluster.mongodb.net/feedbackservice_db?retryWrites=true&w=majority
```

### Application Secrets

```
JWT_SECRET: your-super-secret-jwt-key-here
```

### Service URL Secrets (for API Gateway routing)

```
USER_SERVICE_URL: https://user-service-xxxxx-us-central1.a.run.app
DOCTOR_SERVICE_URL: https://doctor-service-xxxxx-us-central1.a.run.app
APPOINTMENT_SERVICE_URL: https://appointment-service-xxxxx-us-central1.a.run.app
FEEDBACK_SERVICE_URL: https://feedback-service-xxxxx-us-central1.a.run.app
```

**Note:** Leave these empty initially. Update them after the first deployment when Cloud Run generates URLs.

### Frontend Secrets

```
VITE_API_GATEWAY_URL: https://api-gateway-xxxxx-us-central1.a.run.app
VITE_API_URL: https://api-gateway-xxxxx-us-central1.a.run.app

VITE_FIREBASE_API_KEY: your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN: your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID: your_project_id
VITE_FIREBASE_STORAGE_BUCKET: your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID: your_sender_id
VITE_FIREBASE_APP_ID: your_firebase_app_id
```

## Step 4: Push to GitHub and Deploy

The GitHub Actions workflow will automatically:

1. Build Docker images for each service
2. Push to Google Container Registry (gcr.io)
3. Deploy to Cloud Run with the environment variables from GitHub Secrets

```bash
git add .
git commit -m "Add GCP Cloud Run deployment"
git push origin main
```

Monitor the deployment in GitHub Actions. Once complete, Cloud Run will provide public HTTPS URLs for each service.

## Step 5: Update Service URLs (After First Deployment)

After the first deployment, Cloud Run provides URLs. Update the following GitHub Secrets:

```
USER_SERVICE_URL: https://user-service-xxxxx-us-central1.a.run.app
DOCTOR_SERVICE_URL: https://doctor-service-xxxxx-us-central1.a.run.app
APPOINTMENT_SERVICE_URL: https://appointment-service-xxxxx-us-central1.a.run.app
FEEDBACK_SERVICE_URL: https://feedback-service-xxxxx-us-central1.a.run.app
VITE_API_GATEWAY_URL: https://api-gateway-xxxxx-us-central1.a.run.app
VITE_API_URL: https://api-gateway-xxxxx-us-central1.a.run.app
```

Then trigger another deployment by pushing a commit to main.

## Step 6: Verify Deployment

```bash
# View Cloud Run services
gcloud run services list --region us-central1

# View service details
gcloud run services describe user-service --region us-central1

# View logs
gcloud run services logs read user-service --region us-central1 --limit=50
```

## How GitHub Secrets Are Used

The workflow file [.github/workflows/cloud-run-deploy.yml](.github/workflows/cloud-run-deploy.yml) automatically:

1. **Reads GitHub Secrets**: `${{ secrets.MONGO_URI_USER }}`, `${{ secrets.JWT_SECRET }}`, etc.
2. **Sets Environment Variables**: Passes them to the Docker container at runtime via Cloud Run's `--set-env-vars` flag
3. **Your Code Accesses Them**: `process.env.MONGO_URI`, `process.env.JWT_SECRET`, etc. in Node.js

For frontend apps (Vite), environment variables are injected at runtime since the containers serve the built static app.

## Accessing Secrets in Your Code

Your backend code already accesses secrets correctly:

```javascript
// src/config/db.js
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // <-- Loaded from GitHub Secret
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
```

```javascript
// src/controllers/userController.js
const token = jwt.sign(
  { userId: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,  // <-- Loaded from GitHub Secret
  { expiresIn: "1h" }
);
```

## Troubleshooting

### Cannot authenticate to GCP
- Verify the Workload Identity Provider resource name in GitHub Secrets matches the actual value
- Check that the GitHub repository matches the `assertion.repository` condition

### Build fails with "Cannot read properties of undefined"
- Ensure all required GitHub Secrets are set
- Check the Dockerfile for proper environment variable handling

### Service doesn't connect to database
- Verify `MONGO_URI_*` secrets are correct MongoDB Atlas connection strings
- Ensure MongoDB Atlas allows connections from GCP Cloud Run (check IP allowlist)

### Services can't reach each other
- Update `USER_SERVICE_URL`, `DOCTOR_SERVICE_URL`, etc. with actual Cloud Run URLs after first deployment
- Ensure all services are deployed successfully

## Security Best Practices

✅ **Do:** Store all sensitive data in GitHub Secrets  
✅ **Do:** Use separate MongoDB users/passwords for each service  
✅ **Do:** Rotate JWT_SECRET periodically  
✅ **Do:** Use Workload Identity instead of service account keys  

❌ **Don't:** Commit `.env` files to Git  
❌ **Don't:** Expose secrets in logs  
❌ **Don't:** Reuse the same credentials across services
