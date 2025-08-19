# 12-Factor App Implementation

This document outlines how the Next.js authentication application follows the [12-Factor App](https://12factor.net/) methodology for building software-as-a-service applications.

## 🏗️ I. Codebase

**One codebase tracked in revision control, many deploys**

- ✅ Single Git repository with all application code
- ✅ Multiple environment configurations (development, production, test)
- ✅ Environment-specific deployment configurations
- ✅ No code duplication between environments

```
Repository Structure:
├── src/                 # Application source code
├── .env.example         # Environment template
├── .env.development     # Development config
├── .env.production      # Production config
└── .env.test           # Test config
```

## 📦 II. Dependencies

**Explicitly declare and isolate dependencies**

- ✅ `package.json` declares all dependencies explicitly
- ✅ No system-wide dependencies required
- ✅ Dependency isolation through Node.js modules
- ✅ Lock file (`package-lock.json`) ensures reproducible builds

```json
{
  "dependencies": {
    "next": "14.2.32",
    "next-auth": "^4.24.7",
    "@auth0/nextjs-auth0": "^3.5.0"
  }
}
```

## ⚙️ III. Config

**Store config in the environment**

- ✅ All configuration stored in environment variables
- ✅ No hardcoded configuration in source code
- ✅ Environment-specific configuration files
- ✅ Comprehensive environment validation

### Environment Configuration System

```typescript
// src/config/environment.ts
export interface EnvironmentConfig {
  auth: {
    auth0ClientId: string;
    auth0ClientSecret: string;
    nextAuthSecret: string;
    // ... more auth config
  };
  app: {
    nodeEnv: string;
    port: number;
    appName: string;
    version: string;
  };
  // ... more config sections
}
```

### Configuration Files

| File | Purpose | Contains |
|------|---------|----------|
| `.env.example` | Template and documentation | All available environment variables |
| `.env.development` | Development settings | Debug mode, relaxed security |
| `.env.production` | Production settings | Strict security, optimizations |
| `.env.test` | Test settings | Test-specific configurations |
| `.env.local` | Local overrides | User-specific sensitive values |

## 🔌 IV. Backing Services

**Treat backing services as attached resources**

- ✅ Auth0 as external authentication service
- ✅ Database connections configurable via environment
- ✅ Services accessed via environment-configured URLs
- ✅ Easy to swap backing services between environments

```typescript
// Backing services configured via environment
const authProvider = Auth0Provider({
  clientId: env.auth.auth0ClientId,        // From environment
  clientSecret: env.auth.auth0ClientSecret, // From environment
  issuer: `https://${env.auth.auth0Domain}`, // From environment
});
```

## 🏗️ V. Build, Release, Run

**Strictly separate build and run stages**

- ✅ Build stage: `npm run build` creates optimized application
- ✅ Release stage: Combines build with environment config
- ✅ Run stage: Executes the release in environment
- ✅ Next.js standalone output for containerization

```bash
# Build stage
npm run build

# Release stage (example with Docker)
COPY .env.production .env.local
COPY .next/standalone ./
COPY .next/static ./.next/static

# Run stage
NODE_ENV=production node server.js
```

### Next.js Configuration

```javascript
// next.config.js
output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
```

## 🚀 VI. Processes

**Execute the app as one or more stateless processes**

- ✅ Stateless application design
- ✅ Session state stored in JWT tokens (not server memory)
- ✅ No sticky sessions required
- ✅ Process-local caching avoided

```typescript
// Stateless session management
session: {
  strategy: 'jwt',  // No server-side session storage
  maxAge: env.auth.sessionMaxAge,
}
```

## 🔗 VII. Port Binding

**Export services via port binding**

- ✅ Application binds to port specified by environment
- ✅ No dependency on external web server
- ✅ Next.js built-in server handles HTTP requests
- ✅ Port configuration externalized

```javascript
// Environment-based port configuration
port: parseInt(process.env.PORT || '3000')
```

## ⚡ VIII. Concurrency

**Scale out via the process model**

- ✅ Stateless processes enable horizontal scaling
- ✅ Rate limiting configured per environment
- ✅ Resource limits externally configurable
- ✅ No shared state between processes

```typescript
// Environment-based concurrency settings
security: {
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
}
```

## 🗑️ IX. Disposability

**Maximize robustness with fast startup and graceful shutdown**

- ✅ Fast startup through optimized builds
- ✅ Graceful shutdown handling
- ✅ No long-running background tasks
- ✅ Quick recovery from failures

```javascript
// Fast startup optimizations
experimental: {
  serverComponentsExternalPackages: ['jsonwebtoken', 'jose'],
  optimizePackageImports: ['lucide-react'],
}
```

## 🔄 X. Dev/Prod Parity

**Keep development, staging, and production as similar as possible**

- ✅ Same dependencies across environments
- ✅ Environment-specific configurations only
- ✅ Same backing services (Auth0) across environments
- ✅ Minimal differences between environments

### Environment Parity Matrix

| Aspect | Development | Production |
|--------|-------------|------------|
| Dependencies | Identical | Identical |
| Authentication | Auth0 | Auth0 |
| Session Strategy | JWT | JWT |
| Differences | Debug mode, Relaxed limits | Optimized, Strict limits |

## 📝 XI. Logs

**Treat logs as event streams**

- ✅ Logs written to stdout/stderr
- ✅ Environment-configurable log levels
- ✅ Structured logging approach
- ✅ No log file management in application

```typescript
// Environment-based logging configuration
logging: {
  level: process.env.LOG_LEVEL || 'info',
  enableConsole: process.env.LOG_CONSOLE !== 'false',
  enableFile: process.env.LOG_FILE === 'true',
}
```

### Logging Configuration

| Environment | Level | Console | File | Debug |
|-------------|-------|---------|------|-------|
| Development | debug | ✅ | ❌ | ✅ |
| Production | info | ✅ | ✅ | ❌ |
| Test | error | ❌ | ❌ | ❌ |

## 🔧 XII. Admin Processes

**Run admin/management tasks as one-off processes**

- ✅ Database migrations as separate processes
- ✅ Debug mode configurable via environment
- ✅ Administrative tasks separated from web processes
- ✅ One-off scripts in separate files

```typescript
// Admin configuration
security: {
  enableDebug: process.env.NEXTAUTH_DEBUG === 'true',
}
```

## 🛠️ Implementation Benefits

### 1. **Portability**
- Runs consistently across different environments
- Easy deployment to various platforms
- No environment-specific code changes

### 2. **Scalability**
- Stateless design enables horizontal scaling
- Process-based concurrency model
- No shared state limitations

### 3. **Maintainability**
- Clear separation of concerns
- Environment-based configuration
- Predictable deployment process

### 4. **Reliability**
- Fast startup and graceful shutdown
- Robust error handling
- Clear dependency management

## 📁 Configuration Files Structure

```
.env.example         # Template with all variables documented
.env.development     # Development-specific overrides
.env.production      # Production-specific overrides  
.env.test           # Test-specific overrides
.env.local          # Local user overrides (gitignored)

src/config/
├── environment.ts   # Environment configuration factory
└── auth.config.ts   # NextAuth configuration using environment
```

## 🚀 Deployment Examples

### Development
```bash
cp .env.example .env.local
# Fill in your values
npm run dev
```

### Production
```bash
export NODE_ENV=production
export AUTH0_CLIENT_ID=prod_client_id
export NEXTAUTH_SECRET=secure_production_secret
npm run build
npm start
```

### Docker
```dockerfile
# Build stage
FROM node:18-alpine AS builder
COPY package*.json ./
RUN npm ci --only=production

# Release stage
FROM node:18-alpine AS runner
COPY --from=builder /app/.next/standalone ./
COPY .env.production .env.local
EXPOSE 3000
CMD ["node", "server.js"]
```

This 12-Factor App implementation ensures the application is portable, scalable, and maintainable across different environments and deployment scenarios.