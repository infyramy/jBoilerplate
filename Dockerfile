FROM node:20-alpine as build

WORKDIR /app

# Install dependencies for node-gyp
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package.json ./

# Remove lifecycle scripts from package.json that might cause issues
RUN node -e "const pkg=JSON.parse(require('fs').readFileSync('./package.json')); \
    delete pkg.scripts.prepare; \
    delete pkg.scripts.setup; \
    delete pkg.scripts.cli; \
    delete pkg.scripts['cli:setup']; \
    require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));"

# Install dependencies directly with npm, avoiding lifecycle scripts
RUN npm install --no-audit --no-fund --ignore-scripts

# Copy source files
COPY . .

# Build directly using webpack/vite commands to avoid npm scripts
RUN node ./node_modules/.bin/vue-tsc --noEmit && node ./node_modules/.bin/vite build

# Production stage
FROM nginx:stable-alpine

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]