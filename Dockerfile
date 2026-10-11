# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN node ace build

# Stage 2: Production dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY --from=builder /app/build/package.json /app/build/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# Stage 3: Final
FROM node:22-alpine
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3333
WORKDIR /app
COPY --from=builder /app/build ./
COPY --from=deps /app/node_modules ./node_modules
# Seeder data files (read from the working directory)
COPY country-codes.csv languoid.csv ./
USER node
EXPOSE 3333
CMD ["node", "bin/server.js"]
