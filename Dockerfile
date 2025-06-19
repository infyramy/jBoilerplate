FROM node:18-alpine AS build

# Install pnpm with explicit version for stability
RUN npm install -g pnpm@8.14.0

# Set working directory
WORKDIR /app

# Set environment variable to bypass Husky install during CI
ENV CI=true
ENV HUSKY=0
ENV NODE_ENV=production

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies with more verbose output and retry logic
RUN echo "Installing dependencies..." && \
    pnpm install --frozen-lockfile --no-optional || \
    (echo "Retrying pnpm install with network timeout..." && \
    pnpm install --frozen-lockfile --no-optional --network-timeout 100000)

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM nginx:alpine AS production

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create a template for index.html with environment variable placeholders
RUN cp /usr/share/nginx/html/index.html /usr/share/nginx/html/index.html.template

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a volume for persistent data
VOLUME /usr/share/nginx/html

# Expose port 80 (nginx default)
EXPOSE 80

# Start nginx with environment variable substitution
CMD ["/bin/sh", "-c", "envsubst '$$API_URL $$VITE_DB_CLIENT $$VITE_DB_HOST $$VITE_DB_PORT $$VITE_DB_USER $$VITE_DB_PASSWORD $$VITE_DB_NAME' < /usr/share/nginx/html/index.html.template > /usr/share/nginx/html/index.html && nginx -g 'daemon off;'"]