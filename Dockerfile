# Stage 1: Build the React application
# Use Debian-based image for better compatibility during build
FROM node:20 as build

WORKDIR /app

# Copy package files
COPY package.json ./

# Use yarn instead of npm for better handling of optional dependencies (Rollup binaries)
# This avoids the "hang" (downloading all binaries) and the "missing module" (skipping required binaries)
RUN yarn install

# Copy source code
COPY . .

# Accept build arguments for Vite
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set them as environment variables for the build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
