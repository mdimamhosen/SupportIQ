# Use Node.js 20 as base
FROM node:20-alpine AS builder

WORKDIR /app

# Define build arguments
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy configuration files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production environment
FROM node:20-alpine

WORKDIR /app

# Copy built application and production dependencies
COPY ./package.json ./package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /app/build ./build

# Expose the application port
EXPOSE 8000

# Start the application using react-router-serve
CMD ["npm", "run", "start"]