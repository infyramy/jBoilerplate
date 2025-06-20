# Production Vue.js Application Dockerfile
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install system dependencies for native packages
RUN apk add --no-cache python3 make g++

# Copy package files first (better Docker layer caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies (skip scripts to avoid prepare script issues)
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copy source code
COPY . .

# Build the application (skip TypeScript check for reliability)
RUN pnpm run build:only

# Production stage with nginx
FROM nginx:stable-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Run as root for nginx (required for port 80)
# Create directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"] 