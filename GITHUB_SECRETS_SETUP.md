# GitHub Secrets Setup Guide

This guide shows how to configure GitHub Secrets for the Appointment System CI/CD pipeline.

## Why GitHub Secrets?

GitHub Secrets ensure sensitive information (database credentials, API keys, JWT secrets) is:
- ✅ Never exposed in logs or code
- ✅ Encrypted at rest and in transit
- ✅ Only accessible to authorized GitHub Actions workflows
- ✅ Rotatable without changing code

## How to Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

## Required Secrets for Cloud Run Deployment

### 1. GCP Authentication Secrets

Add these secrets for Workload Identity Federation (no credentials stored!):

| Secret Name | Example Value | Description |
|---|---|---|
| `GCP_PROJECT_ID` | `appointment-system-prod` | Your GCP project ID |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github-provider` | Workload Identity Provider resource name |
| `GCP_SERVICE_ACCOUNT` | `github-actions-sa@appointment-system.iam.gserviceaccount.com` | Service account email |

**How to get these values:**
```bash
# Project number
gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)'

# Workload Identity Provider resource name
gcloud iam workload-identity-pools describe "github-pool" \
  --project="YOUR_PROJECT_ID" \
  --location="global" \
  --format='value(name)'

# Service account email
gcloud iam service-accounts list --filter="displayName:GitHub Actions"
```

### 2. Database Secrets (MongoDB Atlas URIs)

| Secret Name | Format | Description |
|---|---|---|
| `MONGO_URI_USER` | `mongodb+srv://user:password@cluster.mongodb.net/userservice_db?retryWrites=true&w=majority` | User Service database |
| `MONGO_URI_DOCTOR` | `mongodb+srv://doctor:password@cluster.mongodb.net/doctorservice_db?retryWrites=true&w=majority` | Doctor Service database |
| `MONGO_URI_APPOINTMENT` | `mongodb+srv://appointment:password@cluster.mongodb.net/appointmentservice_db?retryWrites=true&w=majority` | Appointment Service database |
| `MONGO_URI_FEEDBACK` | `mongodb+srv://feedback:password@cluster.mongodb.net/feedbackservice_db?retryWrites=true&w=majority` | Feedback Service database |

**Best Practice:** Create a separate MongoDB user for each service in MongoDB Atlas:
1. Go to MongoDB Atlas → Your Cluster
2. Click **Security** → **Database Access**
3. Click **Add New Database User**
4. Create user with limited permissions (this database only)
5. Generate connection string and add to GitHub Secrets

### 3. Application Secrets

| Secret Name | Example Value | Description |
|---|---|---|
| `JWT_SECRET` | A random 32-character string | JWT signing secret |

**Generate a secure JWT secret:**
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 4. Firebase Secrets (Admin Frontend)

These come from your Firebase project settings. Go to **Project Settings** → **Service Accounts** → **Credentials**:

| Secret Name | Example Value | Description |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSyB...` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `myapp.firebaseapp.com` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | `myapp` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `myapp.appspot.com` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:...` | Firebase app ID |

### 5. Frontend API Secrets

**After first Cloud Run deployment**, update these with actual Cloud Run service URLs:

| Secret Name | Example Value | Description |
|---|---|---|
| `VITE_API_GATEWAY_URL` | `https://api-gateway-xxxxx-us-central1.a.run.app` | API Gateway Cloud Run URL |
| `VITE_API_URL` | `https://api-gateway-xxxxx-us-central1.a.run.app` | API Gateway Cloud Run URL |

### 6. Backend Service URLs (Cloud Run)

**After first Cloud Run deployment**, update these so services can communicate:

| Secret Name | Example Value | Description |
|---|---|---|
| `USER_SERVICE_URL` | `https://user-service-xxxxx-us-central1.a.run.app` | User Service Cloud Run URL |
| `DOCTOR_SERVICE_URL` | `https://doctor-service-xxxxx-us-central1.a.run.app` | Doctor Service Cloud Run URL |
| `APPOINTMENT_SERVICE_URL` | `https://appointment-service-xxxxx-us-central1.a.run.app` | Appointment Service Cloud Run URL |
| `FEEDBACK_SERVICE_URL` | `https://feedback-service-xxxxx-us-central1.a.run.app` | Feedback Service Cloud Run URL |

## How Secrets Are Used in CI/CD

The GitHub Actions workflow (`.github/workflows/cloud-run-deploy.yml`) uses these secrets:

```yaml
# Accessing a secret in the workflow
env:
  DATABASE_URL: ${{ secrets.MONGO_URI_USER }}

# Using it in a step
- name: Deploy to Cloud Run
  env:
    ENVIRONMENT_VARS: |
      MONGO_URI=${{ secrets.MONGO_URI_USER }},\
      JWT_SECRET=${{ secrets.JWT_SECRET }}
  run: |
    gcloud run deploy user-service \
      --set-env-vars "$ENVIRONMENT_VARS"
```

## How Your App Accesses Secrets

Secrets are injected as environment variables at runtime. Your code accesses them normally:

### Node.js Backend
```javascript
// src/config/db.js
const mongoUri = process.env.MONGO_URI;  // From GitHub Secret MONGO_URI_USER
await mongoose.connect(mongoUri);
```

```javascript
// src/controllers/userController.js
const secret = process.env.JWT_SECRET;  // From GitHub Secret JWT_SECRET
const token = jwt.sign(payload, secret);
```

### React Frontend (Vite)
```javascript
// src/config/api.js
const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;  // From GitHub Secret VITE_API_GATEWAY_URL
```

## Rotating Secrets

To rotate a secret (e.g., after a security incident):

1. Generate a new value
2. Update the GitHub Secret
3. The next deployment will use the new value
4. Monitor logs to ensure everything works
5. For database credentials, also update the user in MongoDB Atlas

## Viewing Secret Usage in Logs

GitHub Actions **never logs secrets**. Even if you print `${{ secrets.MONGO_URI_USER }}`, it will be masked as `***`.

To verify a secret was used correctly:
1. Go to GitHub Actions → Your workflow run
2. Expand the step that uses the secret
3. You'll see `***` where the secret is masked

## Troubleshooting Secrets

### Workflow fails with "undefined secret"
- Verify the secret name matches exactly (GitHub Secrets are case-sensitive)
- Make sure you're in the correct repository

### Syntax error in environment variables
- Check for special characters in secret values
- If a secret contains special characters, it may need escaping
- Consider using a base64-encoded version

### Service can't connect to database after deployment
- Verify `MONGO_URI_*` secrets contain valid connection strings
- Check that MongoDB Atlas IP allowlist includes GCP Cloud Run IPs (usually 0.0.0.0/0 for development)
- Test the connection string locally first

### "Access Denied" when deploying
- Verify `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT` are correct
- Check that the service account has required IAM roles (Cloud Run Admin, Storage Admin, etc.)

## Best Practices

✅ **Do:**
- Use unique credentials for each service
- Rotate secrets periodically (especially JWT_SECRET)
- Use strong random values for secrets
- Document secret values in a secure location (password manager)
- Limit who can access GitHub Secrets (through repository access)

❌ **Don't:**
- Share secrets through email or chat
- Reuse the same secret across multiple applications
- Store secrets in code or `.env` files
- Log secrets to stdout
- Use placeholder values in production

## Example: Adding a New Secret

Let's add `MONGO_URI_USER`:

1. In MongoDB Atlas, create a new database user:
   - Username: `user-service-user`
   - Password: Generate a secure random string
   - Grant access to: `userservice_db` only

2. Get the connection string:
   ```
   mongodb+srv://user-service-user:PASSWORD@cluster.mongodb.net/userservice_db?retryWrites=true&w=majority
   ```

3. In GitHub:
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `MONGO_URI_USER`
   - Value: Paste the connection string
   - Click "Add secret"

4. The next deployment will automatically use this secret!

## Learn More

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Google Cloud Workload Identity Federation](https://cloud.google.com/docs/authentication/workload-identity-federation)
- [MongoDB Atlas Connection Strings](https://www.mongodb.com/docs/atlas/driver-connection)
