# Multi-stage build for production Vue.js app
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Enable corepack for pnpm
RUN corepack enable

WORKDIR /app

# Install system dependencies needed for some npm packages
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copy package management files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm with frozen lockfile
RUN pnpm install --frozen-lockfile --prod=false

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage with nginx
FROM nginx:stable-alpine AS production

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=base /app/dist /usr/share/nginx/html

# Create log directory
RUN mkdir -p /app/logs && chown -R nginx:nginx /app/logs

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]