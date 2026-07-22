# Deploy Kavach-AI Hackathon Prototype in 5 Minutes

## Option 1: Vercel (Recommended - 1 Click)

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Kavach-AI hackathon prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kavach-ai.git
git push -u origin main
```

2. **Deploy to Vercel**
- Go to https://vercel.com/new
- Import GitHub repo
- Click "Deploy"
- Done! ✅

**Your app is live at: `https://your-project.vercel.app`**

### Mobile Installation (iOS)

```
1. Safari → https://your-project.vercel.app
2. Tap Share → "Add to Home Screen"
3. Works offline + fullscreen
```

### Mobile Installation (Android)

```
1. Chrome → https://your-project.vercel.app
2. Menu ⋮ → "Install app"
3. Works offline + fullscreen
```

---

## Option 2: Netlify (2 Minutes)

### Steps

1. **Connect GitHub**
- Go to https://netlify.com
- Click "New site from Git"
- Select GitHub repo
- Use defaults (Next.js detected automatically)
- Deploy

**Your app is live at: `https://your-site.netlify.app`**

---

## Option 3: Self-Hosted (5 Minutes)

### On Linux Server (Ubuntu/Debian)

```bash
# SSH into server
ssh user@your-server.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs npm

# Clone repo
git clone https://github.com/YOUR_USERNAME/kavach-ai.git
cd kavach-ai

# Install & build
npm install
npm run build

# Install PM2 (process manager)
sudo npm install -g pm2
pm2 start npm -- start
pm2 startup
pm2 save

# Install Nginx as reverse proxy
sudo apt-get install nginx
# Create /etc/nginx/sites-available/default with config below
sudo systemctl restart nginx
```

**Nginx Config** (`/etc/nginx/sites-available/default`):

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Setup SSL (Let's Encrypt)**:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Your app is live at: `https://your-domain.com` ✅

---

## Option 4: Docker

### Prerequisites
- Docker installed
- Docker Hub account

### Steps

1. **Create Dockerfile** (already included)

2. **Build & Push**
```bash
docker build -t your-username/kavach-ai .
docker push your-username/kavach-ai
```

3. **Deploy to Docker Hub Registry**
```bash
# Pull image
docker pull your-username/kavach-ai

# Run container
docker run -d -p 3000:3000 your-username/kavach-ai
```

Your app runs on: `http://localhost:3000`

### Deploy to Railway (Free Docker Hosting)

```
1. Go to https://railway.app
2. New Project → GitHub repo
3. Deploy
```

Done! ✅

---

## Option 5: Google Cloud Run (Serverless)

```bash
# Create Dockerfile (already exists)

# Build image
gcloud builds submit --tag gcr.io/YOUR_PROJECT/kavach-ai

# Deploy
gcloud run deploy kavach-ai \
  --image gcr.io/YOUR_PROJECT/kavach-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

Your app is live at: `https://kavach-ai-XXXX.a.run.app` ✅

---

## Option 6: AWS Lambda + API Gateway

See `DEPLOYMENT.md` for full instructions.

---

## Verification Checklist

After deploying, verify these work:

- [ ] Dashboard loads (6-panel grid visible)
- [ ] Threat gauge animates
- [ ] "Permissions required" warning shows
- [ ] "Install" banner appears on mobile
- [ ] Record button works (bottom-right 🎙️)
- [ ] Permissions modal opens
- [ ] Audio waveform updates
- [ ] Open DevTools → Application → Service Workers (should be active)
- [ ] DevTools → Offline mode on → refresh → still works

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank page | Check browser console for errors |
| Service Worker not registered | Clear cache, refresh |
| PWA won't install | Use Chrome/Firefox on Android, or Safari on iOS |
| App crashes after deploy | Check logs: `vercel logs` or `docker logs` |
| Slow performance | Check LCP: `vercel analytics` |

---

## Environment Variables (Optional)

Create `.env.local` if using real backend:

```
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_USE_MOCK_API=false
```

(Currently hardcoded to mock for hackathon)

---

## Monitoring

### Vercel Dashboard
- Deployments: https://vercel.com/dashboard
- Analytics: https://vercel.com/analytics
- Logs: Click deployment → Functions → Logs

### Self-Hosted (PM2)
```bash
pm2 status
pm2 logs
pm2 monit
```

### Docker
```bash
docker ps
docker logs container-id
docker stats container-id
```

---

## Update After Deployment

```bash
# Make changes locally
git add .
git commit -m "Fix: permission modal styling"
git push origin main

# Vercel auto-deploys on push
# (Or manually via https://vercel.com/dashboard)
```

---

## Performance Tips

1. **Enable CDN** (Vercel does this automatically)
2. **Monitor Web Vitals** (Dashboard shows them)
3. **Enable Compression** (Nginx: add `gzip on;`)
4. **Cache Service Worker** (Already configured)

---

## That's It! 🎉

Your Kavach-AI prototype is live and ready to demonstrate at the hackathon.

**Live Domains:**
- Vercel: https://your-project.vercel.app
- Netlify: https://your-site.netlify.app
- Self-hosted: https://your-domain.com
- Docker: http://localhost:3000

**Mobile:** Install via home screen on iOS/Android

**Offline:** Works completely offline once installed

Questions? Check HACKATHON_README.md for detailed feature walkthrough.
