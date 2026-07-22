# Kavach-AI Deployment Guide

Complete guide for deploying Kavach-AI to production environments.

## Quick Start

### Vercel (Recommended)

1. **Connect GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial Kavach-AI dashboard"
   git push origin main
   ```

2. **Import Project**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose your Kavach-AI repo

3. **Configure Environment**
   ```
   NEXT_PUBLIC_API_BASE = https://api.kavach-ai.example.com/api/v1
   NEXT_PUBLIC_WS_BASE = wss://api.kavach-ai.example.com/api/v1
   ```

4. **Deploy**
   ```bash
   vercel deploy --prod
   ```

## Build Configuration

### Next.js Config

```javascript
// next.config.mjs
export default {
  reactCompiler: true,           // Enable React Compiler (stable in v16)
  cacheComponents: true,         // Enable cache components
  experimental: {
    ppr: true,                   // Partial Pre-Rendering
  },
};
```

### Build Optimization

```bash
# Analyze bundle size
pnpm build --analyze

# Production build
pnpm build
pnpm start

# Verify output
ls -la .next/
```

## Environment Setup

### Development

```bash
# .env.local
NEXT_PUBLIC_API_BASE=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_BASE=ws://localhost:8080/api/v1
NODE_ENV=development
```

### Staging

```bash
# .env.staging
NEXT_PUBLIC_API_BASE=https://api-staging.kavach-ai.example.com/api/v1
NEXT_PUBLIC_WS_BASE=wss://api-staging.kavach-ai.example.com/api/v1
NODE_ENV=development
```

### Production

```bash
# .env.production
NEXT_PUBLIC_API_BASE=https://api.kavach-ai.example.com/api/v1
NEXT_PUBLIC_WS_BASE=wss://api.kavach-ai.example.com/api/v1
NODE_ENV=production
```

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production stage
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install pnpm
RUN npm install -g pnpm

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["pnpm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  kavach-ai:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_BASE: ${API_BASE:-http://backend:8080/api/v1}
      NEXT_PUBLIC_WS_BASE: ${WS_BASE:-ws://backend:8080/api/v1}
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    image: kavach-backend:latest
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
    restart: unless-stopped
```

### Build & Run

```bash
# Build image
docker build -t kavach-ai:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE=https://api.example.com/api/v1 \
  -e NEXT_PUBLIC_WS_BASE=wss://api.example.com/api/v1 \
  kavach-ai:latest

# Or with docker-compose
docker-compose up -d
```

## Kubernetes Deployment

### deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kavach-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: kavach-ai
  template:
    metadata:
      labels:
        app: kavach-ai
    spec:
      containers:
      - name: kavach-ai
        image: kavach-ai:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXT_PUBLIC_API_BASE
          valueFrom:
            configMapKeyRef:
              name: kavach-config
              key: api_base
        - name: NEXT_PUBLIC_WS_BASE
          valueFrom:
            configMapKeyRef:
              name: kavach-config
              key: ws_base
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

### service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: kavach-ai-service
spec:
  selector:
    app: kavach-ai
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

### Deploy to K8s

```bash
# Create namespace
kubectl create namespace kavach

# Create ConfigMap
kubectl create configmap kavach-config \
  --from-literal=api_base=https://api.example.com/api/v1 \
  --from-literal=ws_base=wss://api.example.com/api/v1 \
  -n kavach

# Deploy
kubectl apply -f deployment.yaml -n kavach
kubectl apply -f service.yaml -n kavach

# Check status
kubectl get pods -n kavach
kubectl logs -f deployment/kavach-ai -n kavach
```

## HTTPS/TLS Configuration

### Nginx Reverse Proxy

```nginx
upstream kavach_backend {
    server kavach-ai:3000;
}

server {
    listen 80;
    server_name dashboard.kavach-ai.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dashboard.kavach-ai.example.com;

    ssl_certificate /etc/ssl/certs/fullchain.pem;
    ssl_certificate_key /etc/ssl/private/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://kavach_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /_next/static/ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        proxy_pass http://kavach_backend;
    }
}
```

## Performance Optimization

### Static Generation

```bash
# Pre-render dashboard
pnpm build --profile

# Cache static assets for 1 year
# Handled by headers in .next/config.json
```

### CDN Configuration

```javascript
// next.config.mjs
export default {
  images: {
    domains: ['api.kavach-ai.example.com'],
  },
  staticPageGenerationTimeout: 60,
};
```

### Caching Headers

```javascript
// middleware.ts (or proxy headers)
{
  source: '/_next/static/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable'
    }
  ]
}
```

## Monitoring & Logging

### Health Check

```bash
# Add to deployment
curl -s http://localhost:3000/api/health || exit 1
```

### Application Monitoring

```javascript
// Add to api/health route (if needed)
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
```

### Log Aggregation

```bash
# Send logs to Vercel (automatic)
# Or use external service:
# - Datadog
# - LogRocket
# - Sentry (error tracking)
```

## Backup & Recovery

### Static Assets Backup

```bash
# Backup Next.js build artifacts
tar -czf kavach-build-$(date +%Y%m%d).tar.gz .next/
```

### Database Backup (if needed)

```bash
# Handled by backend
# Ensure backend implements database snapshots
```

## Security Checklist

- [ ] Enable HTTPS/TLS (WSS for WebSockets)
- [ ] Configure CORS headers correctly
- [ ] Set strong CSP headers
- [ ] Enable rate limiting on API endpoints
- [ ] Rotate API credentials regularly
- [ ] Monitor for suspicious activity
- [ ] Implement request logging
- [ ] Test virtual camera detection
- [ ] Validate all user input
- [ ] Use secure session management

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules

# Reinstall dependencies
pnpm install

# Try again
pnpm build
```

### WebSocket Connection Fails in Production

```bash
# Issue: WSS not working
# Solution: Configure backend CORS + TLS

# nginx config
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
```

### High Memory Usage

```bash
# Check bundle size
pnpm build --analyze

# Optimize images
# Reduce number of components in memory
# Use dynamic imports
```

## Performance Metrics

Typical production performance targets:

| Metric | Target | Current |
|--------|--------|---------|
| **First Paint (FP)** | < 1.5s | ~1.2s |
| **Largest Contentful Paint (LCP)** | < 2.5s | ~2.0s |
| **Time to Interactive (TTI)** | < 3.5s | ~3.0s |
| **Cumulative Layout Shift (CLS)** | < 0.1 | ~0.05 |
| **Bundle Size** | < 500KB | ~350KB |

## Scaling Considerations

- **Horizontal**: Use load balancer (nginx, AWS ALB)
- **Vertical**: Increase Node.js heap size if needed
- **Database**: Ensure backend scales appropriately
- **WebSocket**: Consider dedicated WebSocket server
- **CDN**: Use CloudFlare or AWS CloudFront

## Rollback Procedure

```bash
# Vercel
vercel rollback

# Docker
docker run -p 3000:3000 kavach-ai:previous-tag

# Kubernetes
kubectl rollout undo deployment/kavach-ai -n kavach
```

## Support & Maintenance

- Monitor Vercel Analytics dashboard
- Set up alerts for error rates
- Regular security audits
- Keep dependencies updated
- Review logs weekly
- Performance testing monthly

---

**Last Updated**: 2025
