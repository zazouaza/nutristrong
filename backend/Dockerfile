# Stage 1: Build
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies like typescript)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]
