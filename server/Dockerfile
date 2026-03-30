# Use Node.js 20 as base
FROM node:20-alpine AS builder

WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production environment
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Set permissions for Node user
USER node

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "dist/main"]
