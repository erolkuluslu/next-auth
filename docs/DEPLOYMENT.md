# Deployment Guide

This document provides comprehensive deployment instructions for all three stages of the interview case study.

## 🚀 Deployment Overview

Each stage has its own deployment strategy optimized for its architecture:

- **Stage 1 & 2**: Traditional Next.js deployment (Vercel/Netlify)
- **Stage 3**: Containerized micro frontend deployment (Docker/Kubernetes)

## 📋 Stage 1: Authentication System Deployment

### Vercel Deployment (Recommended)

#### 1. Vercel CLI Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from stage1-auth directory
cd stage1-auth
vercel
```

#### 2. Environment Variables
Set up environment variables in Vercel dashboard:

```bash
# Production Environment Variables
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secure-secret-key-here
AUTH0_CLIENT_ID=your-auth0-production-client-id
AUTH0_CLIENT_SECRET=your-auth0-production-client-secret
AUTH0_DOMAIN=your-production-tenant.auth0.com
JWT_SECRET=your-jwt-production-secret
```

#### 3. Auth0 Configuration
Update Auth0 application settings:
- **Allowed Callback URLs**: `https://your-app.vercel.app/api/auth/callback/auth0`
- **Allowed Logout URLs**: `https://your-app.vercel.app`
- **Allowed Web Origins**: `https://your-app.vercel.app`

#### 4. Domain Configuration (Optional)
```bash
# Add custom domain
vercel domains add your-domain.com

# Configure DNS
# Add CNAME record: your-domain.com -> cname.vercel-dns.com
```

### Netlify Deployment (Alternative)

#### 1. Build Configuration
Create `netlify.toml` in stage1-auth:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd stage1-auth
netlify deploy --prod
```

### Self-hosted Deployment

#### 1. Docker Configuration
```dockerfile
# stage1-auth/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### 2. Build and Deploy
```bash
# Build image
docker build -t stage1-auth .

# Run container
docker run -p 3000:3000 \
  -e NEXTAUTH_URL=https://your-domain.com \
  -e NEXTAUTH_SECRET=your-secret \
  -e AUTH0_CLIENT_ID=your-client-id \
  -e AUTH0_CLIENT_SECRET=your-client-secret \
  -e AUTH0_DOMAIN=your-domain.auth0.com \
  stage1-auth
```

## 📋 Stage 2: E-commerce Platform Deployment

### Vercel Deployment

#### 1. Environment Variables
```bash
# Production Environment Variables
FAKE_STORE_API_URL=https://fakestoreapi.com
DEFAULT_LOCALE=en
SUPPORTED_LOCALES=en,tr
ISR_REVALIDATE_TIME=3600
```

#### 2. ISR Configuration
Ensure proper ISR setup in next.config.js:
```javascript
module.exports = {
  experimental: {
    isrMemoryCacheSize: 0, // Disable in-memory cache for Vercel
  },
  images: {
    domains: ['fakestoreapi.com'],
  },
};
```

#### 3. Deploy
```bash
cd stage2-ecommerce
vercel --prod
```

### Performance Optimization

#### 1. Bundle Analysis
```bash
# Analyze bundle before deployment
npm run analyze

# Optimize based on analysis results
# - Code splitting: Dynamic imports for large components
# - Tree shaking: Remove unused dependencies
# - Image optimization: Proper next/image usage
```

#### 2. Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lhci:
    name: Lighthouse
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js 18.x
        uses: actions/setup-node@v3
        with:
          node-version: 18.x
      - name: npm install, build
        run: |
          npm install
          npm run build
      - name: run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.11.x
          lhci autorun
```

#### 3. Lighthouse Configuration
```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm start",
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/products",
        "http://localhost:3000/products/1"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

## 📋 Stage 3: Micro Frontend Deployment

### Docker Compose Deployment (Development)

#### 1. Development Setup
```bash
# Start all micro frontends
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f shell-app
```

#### 2. Production Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  shell-app:
    build:
      context: ./stage3-microfrontend/shell-app
      dockerfile: Dockerfile.prod
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - HOME_APP_URL=http://home-app:3001
      - CART_APP_URL=http://cart-app:3002
    depends_on:
      - home-app
      - cart-app
    restart: unless-stopped

  home-app:
    build:
      context: ./stage3-microfrontend/home-app
      dockerfile: Dockerfile.prod
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - FAKE_STORE_API_URL=https://fakestoreapi.com
    restart: unless-stopped

  cart-app:
    build:
      context: ./stage3-microfrontend/cart-app
      dockerfile: Dockerfile.prod
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - shell-app
    restart: unless-stopped
```

### Kubernetes Deployment

#### 1. Kubernetes Manifests
```yaml
# k8s/shell-app-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shell-app
  labels:
    app: shell-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: shell-app
  template:
    metadata:
      labels:
        app: shell-app
    spec:
      containers:
      - name: shell-app
        image: your-registry/shell-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: HOME_APP_URL
          value: "http://home-app-service:3001"
        - name: CART_APP_URL
          value: "http://cart-app-service:3002"
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: shell-app-service
spec:
  selector:
    app: shell-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shell-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: shell-app-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: shell-app-service
            port:
              number: 80
```

#### 2. Deploy to Kubernetes
```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get ingress

# Check logs
kubectl logs -f deployment/shell-app
```

### CDN and Load Balancing

#### 1. Nginx Configuration
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream shell-app {
        server shell-app:3000;
    }
    
    upstream home-app {
        server home-app:3001;
    }
    
    upstream cart-app {
        server cart-app:3002;
    }

    server {
        listen 80;
        server_name localhost;

        # Main shell application
        location / {
            proxy_pass http://shell-app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Home micro frontend
        location /home/ {
            proxy_pass http://home-app/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Cart micro frontend
        location /cart/ {
            proxy_pass http://cart-app/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

#### 1. Build and Deploy Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [ main, prod/* ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Type check
      run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli
        lhci autorun
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-args: '--prod'
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}

  docker-build:
    needs: test
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/heads/prod/')
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push Docker images
      run: |
        # Build shell-app
        docker build -t your-registry/shell-app:latest ./stage3-microfrontend/shell-app
        docker push your-registry/shell-app:latest
        
        # Build home-app
        docker build -t your-registry/home-app:latest ./stage3-microfrontend/home-app
        docker push your-registry/home-app:latest
        
        # Build cart-app
        docker build -t your-registry/cart-app:latest ./stage3-microfrontend/cart-app
        docker push your-registry/cart-app:latest
```

#### 2. Environment-specific Deployments
```yaml
# Deploy to different environments based on branch
- name: Deploy to Development
  if: github.ref == 'refs/heads/dev/*'
  run: |
    vercel --confirm --token ${{ secrets.VERCEL_TOKEN }}

- name: Deploy to Production
  if: github.ref == 'refs/heads/prod/*'
  run: |
    vercel --prod --confirm --token ${{ secrets.VERCEL_TOKEN }}
```

## 🔍 Monitoring and Observability

### Health Checks

#### 1. Application Health Endpoints
```typescript
// pages/api/health.ts
export default function handler(req: NextRequest, res: NextResponse) {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  };

  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.status = 'error';
    res.status(503).json(healthCheck);
  }
}
```

#### 2. Database Connectivity Check
```typescript
// pages/api/ready.ts
export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    // Check database connection
    // Check external APIs
    // Check required services
    
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
}
```

### Performance Monitoring

#### 1. Web Vitals Tracking
```typescript
// lib/analytics.ts
export function reportWebVitals({ id, name, label, value }: any) {
  // Send to analytics service
  if (typeof window !== 'undefined') {
    (window as any).gtag('event', name, {
      event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      event_label: id,
      non_interaction: true,
    });
  }
}
```

#### 2. Error Tracking
```typescript
// lib/error-tracking.ts
export function captureException(error: Error, context?: any) {
  // Send to error tracking service (Sentry, LogRocket, etc.)
  console.error('Application Error:', error, context);
  
  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, context);
  }
}
```

## 🚨 Troubleshooting Common Deployment Issues

### Build Errors
```bash
# Clear caches
rm -rf .next node_modules
npm install
npm run build

# Memory issues during build
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Environment Variable Issues
```bash
# Verify environment variables
node -e "console.log(process.env)"

# Check Vercel environment variables
vercel env ls
```

### Docker Issues
```bash
# Check container logs
docker logs container_name

# Debug container
docker exec -it container_name /bin/sh

# Check resource usage
docker stats
```

### Performance Issues
```bash
# Analyze bundle size
npm run analyze

# Check Lighthouse scores
lighthouse https://your-app.com --output=json

# Monitor Core Web Vitals
# Use Chrome DevTools Performance tab
```

This comprehensive deployment guide ensures reliable, scalable deployment across all three stages of the interview case study with proper monitoring and troubleshooting procedures.