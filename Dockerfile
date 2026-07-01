# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies first (layer-cached unless lock file changes)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build the static site
COPY . .
RUN npm run build

# ── Stage 2: serve ────────────────────────────────────────────────────────────
FROM nginx:alpine

# Replace the default nginx site config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
