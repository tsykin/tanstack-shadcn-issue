FROM node:22.20.0-alpine
WORKDIR /app

# Accept build arguments for Vite environment variables
ARG VITE_BASE_URL

# Expose Vite environment variables to build process
ENV VITE_BASE_URL=$VITE_BASE_URL

ENV PORT=3000
EXPOSE 3000

# Copy and install dependencies (including devDependencies for build)
COPY package.json package-lock.json ./
RUN npm ci --include=optional

# Copy source and build
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Set production environment after build
ENV NODE_ENV=production

# Run the Nitro server
CMD ["node", ".output/server/index.mjs"]
