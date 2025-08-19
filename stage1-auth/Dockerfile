# 12-Factor App Dockerfile
# Implements proper build, release, run separation

# =============================================================================
# V. BUILD - Create optimized application build
# =============================================================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=production
ENV BUILD_STANDALONE=true
RUN npm run build

# =============================================================================
# V. RELEASE - Combine build with runtime environment
# =============================================================================
FROM node:18-alpine AS runner

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create directory for environment files
RUN mkdir -p /app/config
COPY --chown=nextjs:nodejs .env.production /app/config/

# Switch to non-root user
USER nextjs

# VII. Port Binding - Expose port from environment
EXPOSE $PORT

# VI. Processes - Set environment for stateless execution
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/health || exit 1

# =============================================================================
# V. RUN - Execute the application
# =============================================================================
CMD ["node", "server.js"]