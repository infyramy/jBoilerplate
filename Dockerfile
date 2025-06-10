FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

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

# Expose port 3100
EXPOSE 3100

# Start nginx with environment variable substitution
CMD ["/bin/sh", "-c", "envsubst '$$API_URL' < /usr/share/nginx/html/index.html.template > /usr/share/nginx/html/index.html && nginx -g 'daemon off;'"]