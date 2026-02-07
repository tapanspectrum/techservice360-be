# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build NestJS app
RUN npm run build


# ---------- Production stage ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy only package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy compiled app
COPY --from=builder /app/dist ./dist

# Expose NestJS port
EXPOSE 4001

# Start app
CMD ["node", "dist/main.js"]
