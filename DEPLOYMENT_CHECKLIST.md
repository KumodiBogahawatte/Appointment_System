# Deployment Checklist ✓

Use this checklist to ensure you've completed all steps for GCP Cloud Run deployment with GitHub Secrets.

## Phase 1: Preparation ✓

- [ ] Review the migration guide: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- [ ] Understand GitHub Secrets: [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)
- [ ] Review Cloud Run setup: [GCP_CLOUD_RUN_DEPLOYMENT.md](GCP_CLOUD_RUN_DEPLOYMENT.md)
- [ ] Verify all services have `process.env.*` or `import.meta.env.VITE_*` usage
- [ ] Ensure `package-lock.json` files are committed (for npm ci)

## Phase 2: GCP Setup

### Create GCP Project
- [ ] Create GCP project: `gcloud projects create appointment-system`
- [ ] Enable Cloud Run API
- [ ] Enable Container Registry API
- [ ] Enable Cloud Build API
- [ ] Enable IAM API
- [ ] Enable STS API (for Workload Identity)

### Create Service Account
- [ ] Create service account: `github-actions-sa`
- [ ] Grant Cloud Run Admin role
- [ ] Grant Storage Admin role
- [ ] Grant IAM Service Account User role

### Set up Workload Identity Federation
- [ ] Create Workload Identity Pool: `github-pool`
- [ ] Create OIDC provider: `github-provider`
- [ ] Configure GitHub OIDC issuer: `https://token.actions.githubusercontent.com`
- [ ] Add policy binding for service account

### Get Configuration Values
- [ ] Get GCP Project ID: `gcloud config get-value project`
- [ ] Get GCP Project Number: `gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)'`
- [ ] Get Workload Identity Provider resource name
- [ ] Get Service Account email

## Phase 3: GitHub Secrets Setup

### GCP Secrets
- [ ] Add `GCP_PROJECT_ID`
- [ ] Add `GCP_WORKLOAD_IDENTITY_PROVIDER`
- [ ] Add `GCP_SERVICE_ACCOUNT`

### Database Secrets (MongoDB Atlas)
- [ ] Create separate MongoDB users for each service
- [ ] Get connection strings for each service
- [ ] Add `MONGO_URI_USER`
- [ ] Add `MONGO_URI_DOCTOR`
- [ ] Add `MONGO_URI_APPOINTMENT`
- [ ] Add `MONGO_URI_FEEDBACK`

### Application Secrets
- [ ] Generate secure JWT secret: `openssl rand -base64 32`
- [ ] Add `JWT_SECRET`

### Firebase Secrets (Admin Frontend)
- [ ] Go to Firebase Project Settings
- [ ] Get Firebase configuration
- [ ] Add `VITE_FIREBASE_API_KEY`
- [ ] Add `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] Add `VITE_FIREBASE_PROJECT_ID`
- [ ] Add `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] Add `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] Add `VITE_FIREBASE_APP_ID`

### Frontend API URLs (Temporary - will update after first deployment)
- [ ] Add `VITE_API_GATEWAY_URL=http://localhost:3000` (temporary)
- [ ] Add `VITE_API_URL=http://localhost:3000` (temporary)

### Backend Service URLs (Temporary - will update after first deployment)
- [ ] Add `USER_SERVICE_URL=http://localhost:3001` (temporary)
- [ ] Add `DOCTOR_SERVICE_URL=http://localhost:3002` (temporary)
- [ ] Add `APPOINTMENT_SERVICE_URL=http://localhost:3003` (temporary)
- [ ] Add `FEEDBACK_SERVICE_URL=http://localhost:3004` (temporary)

## Phase 4: Code & Configuration

### Verify Code
- [ ] Backend services use `process.env.MONGO_URI`
- [ ] Backend services use `process.env.JWT_SECRET`
- [ ] Backend services use `process.env.API_GATEWAY_URL`
- [ ] Frontend apps use `import.meta.env.VITE_API_GATEWAY_URL`
- [ ] Frontend apps use `import.meta.env.VITE_FIREBASE_*`
- [ ] All services have `package.json` with scripts
- [ ] All services have `Dockerfile`

### Verify Configuration Files
- [ ] `.github/workflows/cloud-run-deploy.yml` exists
- [ ] `.env.example` documents all required variables
- [ ] `docker-compose.yml` uses environment variable placeholders
- [ ] Frontend Dockerfiles use `--build-arg` for Vite variables

### Git Preparation
- [ ] `.env` file is in `.gitignore` (don't commit real secrets)
- [ ] All changes are committed
- [ ] Ready to push to `main` branch

## Phase 5: First Deployment

### Push to GitHub
- [ ] Review all changes: `git status`
- [ ] Commit changes: `git commit -m "Add GCP Cloud Run deployment with GitHub Secrets"`
- [ ] Push to main: `git push origin main`

### Monitor Deployment
- [ ] Go to GitHub Actions
- [ ] Watch the workflow run
- [ ] Check all jobs pass: backend-ci, frontend-ci, docker-publish
- [ ] Confirm all services deploy successfully

### Troubleshoot if Needed
- [ ] Check GitHub Actions logs for errors
- [ ] Verify all GitHub Secrets are correctly set
- [ ] Check GCP Cloud Run logs: `gcloud run services logs read`
- [ ] Verify Docker images were pushed to GCR

## Phase 6: Post-Deployment Configuration

### Get Cloud Run URLs
- [ ] Get user-service URL: `gcloud run services describe user-service --region us-central1 --format='value(status.url)'`
- [ ] Get doctor-service URL
- [ ] Get appointment-service URL
- [ ] Get feedback-service URL
- [ ] Get api-gateway URL
- [ ] Get admin-frontend URL
- [ ] Get user-frontend URL

### Update GitHub Secrets with Real URLs
- [ ] Update `USER_SERVICE_URL` with Cloud Run URL
- [ ] Update `DOCTOR_SERVICE_URL` with Cloud Run URL
- [ ] Update `APPOINTMENT_SERVICE_URL` with Cloud Run URL
- [ ] Update `FEEDBACK_SERVICE_URL` with Cloud Run URL
- [ ] Update `VITE_API_GATEWAY_URL` with api-gateway Cloud Run URL
- [ ] Update `VITE_API_URL` with api-gateway Cloud Run URL

### Trigger Second Deployment
- [ ] Push empty commit: `git commit --allow-empty -m "Update service URLs after Cloud Run deployment"`
- [ ] Push to main: `git push origin main`
- [ ] Monitor GitHub Actions for successful deployment

## Phase 7: Verification

### Test Services Health
- [ ] Health check user-service: `curl https://user-service-xxxxx.a.run.app/health`
- [ ] Health check doctor-service
- [ ] Health check appointment-service
- [ ] Health check feedback-service
- [ ] Health check api-gateway

### Test API Functionality
- [ ] Create a user via API
- [ ] Create a doctor via API
- [ ] Create an appointment via API
- [ ] Submit feedback via API

### Test Frontends
- [ ] Access admin frontend URL in browser
- [ ] Verify Firebase login works (or shows login form)
- [ ] Verify admin frontend can access API
- [ ] Access user frontend URL in browser
- [ ] Verify user frontend can access API

### Check Logs
- [ ] View logs for each service: `gcloud run services logs read`
- [ ] Look for any errors or warnings
- [ ] Verify database connections are successful

## Phase 8: Ongoing Maintenance

### Regular Tasks
- [ ] Check Cloud Run logs weekly
- [ ] Monitor service health
- [ ] Review GitHub Actions workflow runs
- [ ] Update secrets if needed

### Security
- [ ] Rotate `JWT_SECRET` periodically
- [ ] Rotate MongoDB passwords periodically
- [ ] Review GitHub Actions permissions
- [ ] Monitor GCP IAM roles

### Updates
- [ ] Pull latest code: `git pull`
- [ ] Push updates: `git push origin main`
- [ ] GitHub Actions automatically deploys
- [ ] Monitor deployment in GitHub Actions

## Troubleshooting Checklist

### If Deployment Fails
- [ ] Verify all GitHub Secrets are set
- [ ] Check GitHub Actions logs for errors
- [ ] Verify GCP credentials are correct
- [ ] Check Dockerfile syntax
- [ ] Verify Docker image builds successfully locally

### If Services Can't Connect
- [ ] Verify service URLs are updated in GitHub Secrets
- [ ] Check if services are running: `gcloud run services list`
- [ ] Check service logs: `gcloud run services logs read`
- [ ] Verify API Gateway routing configuration

### If Database Connection Fails
- [ ] Verify `MONGO_URI_*` secrets are correct
- [ ] Check MongoDB Atlas network access settings
- [ ] Add GCP IP ranges to allowlist
- [ ] Test connection locally first

### If Firebase Not Working
- [ ] Verify `VITE_FIREBASE_*` secrets are correct
- [ ] Check Firebase project settings
- [ ] Verify build args are passed in workflow
- [ ] Check browser console for errors

## Success Criteria ✓

You're done when:
- [ ] All GitHub Secrets are configured
- [ ] GitHub Actions workflow successfully deploys all services
- [ ] All Cloud Run services are running and healthy
- [ ] Admin frontend loads and Firebase auth works
- [ ] User frontend loads and connects to API
- [ ] Services can communicate with each other
- [ ] Database connections are working
- [ ] You can create, read, update data through the API

## Next Steps

1. **Monitor**: Check logs and metrics regularly
2. **Optimize**: Fine-tune Cloud Run memory/CPU as needed
3. **Scale**: Configure auto-scaling if needed
4. **Backup**: Set up MongoDB backups
5. **CI/CD**: Add tests to GitHub Actions workflow
6. **Security**: Implement additional security measures
7. **Documentation**: Update team documentation with Cloud Run URLs

## Support Resources

- 📖 [GCP Cloud Run Documentation](https://cloud.google.com/run/docs)
- 📖 [GitHub Actions Documentation](https://docs.github.com/en/actions)
- 📖 [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- 🐛 [GCP Support](https://cloud.google.com/support)
- 💬 [GitHub Community](https://github.community)

---

**Last Updated:** April 2026  
**Status:** Ready for Cloud Run Deployment ✓
