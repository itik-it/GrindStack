# Stage 1: Build with Node
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files and env
COPY . .
COPY .env.docker .env

# Build the app
RUN npm run build

# ------------------------------------------------

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Clean existing html files
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# ✅ Add custom nginx config to handle React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose default Nginx port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
