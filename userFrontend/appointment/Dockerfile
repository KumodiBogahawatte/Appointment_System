# Build stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Accept build arguments for Vite environment variables
ARG VITE_API_URL=http://localhost:3000

# Set environment variables for the build
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite app with environment variables
RUN npm run build

# Production stage - serve with a simple Node.js server
FROM node:20-alpine

WORKDIR /app

# Install a simple HTTP server
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/dist ./dist

EXPOSE 8080

# Serve the built app - listen on PORT env var (Cloud Run sets PORT=8080)
CMD ["serve", "-s", "dist", "-l", "${PORT:-8080}"]