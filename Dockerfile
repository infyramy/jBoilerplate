FROM node:18-alpine AS build

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV CI=true
ENV NPM_CONFIG_LOGLEVEL=verbose

# Copy package files and install dependencies with npm instead of pnpm
COPY package.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application with npm
RUN npm run build

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