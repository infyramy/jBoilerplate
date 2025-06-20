# Deployment Guide

## Coolify Deployment

This guide explains how to deploy your Vue.js application to Coolify.

### Prerequisites

1. A Coolify instance set up and running
2. Your code repository accessible to Coolify (GitHub, GitLab, etc.)
3. Environment variables configured

### Deployment Options

#### Option 1: Simple Dockerfile (Recommended for Coolify)

Use `Dockerfile.coolify` for a straightforward deployment:

```bash
# In Coolify, set the build configuration:
# - Dockerfile: Dockerfile.coolify
# - Port: 3000
```

This uses a simple static file server and is the most reliable option for Coolify.

#### Option 2: Nginx Multi-stage Build

Use the main `Dockerfile` for a more production-ready nginx setup:

```bash
# In Coolify, set the build configuration:
# - Dockerfile: Dockerfile
# - Port: 80
```

### Environment Variables

Set these environment variables in Coolify:

```bash
# Required
NODE_ENV=production

# Database (if using)
VITE_DB_CLIENT=mysql
VITE_DB_HOST=your-db-host
VITE_DB_PORT=3306
VITE_DB_USER=your-db-user
VITE_DB_PASSWORD=your-db-password
VITE_DB_NAME=your-db-name
VITE_DB_SSL=false

# API Configuration
VITE_API_URL=https://your-api-domain.com
VITE_API_TIMEOUT=30000

# Feature Flags (optional)
VITE_FEATURE_DARK_MODE=true
VITE_FEATURE_MULTILINGUAL_SUPPORT=true
VITE_FEATURE_NOTIFICATIONS=true
VITE_FEATURE_ANALYTICS=false
VITE_FEATURE_ADMIN_DASHBOARD=true
VITE_FEATURE_USER_MANAGEMENT=true
VITE_FEATURE_EMAIL_SERVICE=false
```

### Build Configuration in Coolify

1. **Repository**: Connect your Git repository
2. **Branch**: Select your deployment branch (usually `main` or `production`)
3. **Build Pack**: Docker
4. **Dockerfile**: Choose either `Dockerfile.coolify` (recommended) or `Dockerfile`
5. **Port**: 
   - For `Dockerfile.coolify`: 3000
   - For `Dockerfile`: 80
6. **Health Check**: `/` (both Dockerfiles include health checks)

### Troubleshooting

#### Build Fails

1. **pnpm lock file issues**: Ensure `pnpm-lock.yaml` is committed to your repository
2. **Memory issues**: Coolify might need more memory for the build process
3. **Dependencies**: Check that all dependencies are properly listed in `package.json`

#### App doesn't start

1. **Port issues**: Make sure the port in Coolify matches the exposed port in Dockerfile
2. **Environment variables**: Verify all required env vars are set
3. **Build artifacts**: Check that the `dist` folder is being created properly

#### App loads but doesn't work

1. **API connectivity**: Check that `VITE_API_URL` is correctly set
2. **Routing issues**: Ensure the nginx/serve configuration handles SPA routing
3. **Assets not loading**: Check the base URL configuration in `vite.config.mts`

### Local Testing

Test your Docker setup locally before deploying:

```bash
# Option 1: Test with Coolify Dockerfile
docker build -f Dockerfile.coolify -t jboilerplate-coolify .
docker run -p 3000:3000 jboilerplate-coolify

# Option 2: Test with main Dockerfile
docker build -f Dockerfile -t jboilerplate-nginx .
docker run -p 80:80 jboilerplate-nginx

# Option 3: Test with docker-compose
docker-compose -f docker-compose.app-only.yml up --build
```

### Performance Optimization

1. **Multi-stage builds**: Both Dockerfiles use multi-stage builds to reduce image size
2. **Static asset caching**: Nginx configuration includes aggressive caching for static assets
3. **Gzip compression**: Enabled in nginx for smaller transfer sizes
4. **Code splitting**: Vite configuration includes code splitting for better loading performance

### Security

1. **Security headers**: Nginx configuration includes security headers
2. **Non-root user**: Container runs as nginx user (for main Dockerfile)
3. **Minimal base image**: Uses Alpine Linux for smaller attack surface
4. **No secrets in build**: Environment variables are set at runtime, not build time

### Monitoring

Both Dockerfiles include health checks that Coolify can use for monitoring:

- **Endpoint**: `/`
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3
- **Start period**: 40 seconds

### Support

If you encounter issues:

1. Check Coolify logs for build and runtime errors
2. Verify environment variables are correctly set
3. Test the Docker build locally
4. Ensure your code works with `pnpm run dev` locally
5. Check that all environment variables referenced in the code are provided 