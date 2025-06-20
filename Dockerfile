# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm
# Install dependencies
COPY package*.json ./
RUN pnpm install

# Copy project files
COPY . .

# Build the app
RUN pnpm run build

# Stage 2: Serve
FROM nginx:1.25-alpine

# Copy build files to Nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
