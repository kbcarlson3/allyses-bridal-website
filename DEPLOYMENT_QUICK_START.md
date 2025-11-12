# ⚡ Quick Start Deployment Guide

## 🎯 Goal
Deploy your Allyse's Bridal website for **~$5/month** with Railway.app

---

## 📝 5-Minute Setup

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/allyses-bridal.git
git push -u origin main
```

### 2. Deploy on Railway
1. Go to [railway.app](https://railway.app) → Sign up (free)
2. "New Project" → "Deploy from GitHub"
3. Select your repo → Railway auto-deploys

### 3. Add Environment Variables
In Railway dashboard → Variables tab, add:

```env
NODE_ENV=production
JWT_SECRET=generate_with_openssl_rand_base64_32
DEFAULT_ADMIN_PASSWORD=your_strong_password_here
RESEND_API_KEY=your_resend_key_if_using_email
CORS_ORIGIN=https://your-domain.com
```

### 4. Add Persistent Volumes
Railway dashboard → Volumes tab:
- Volume 1: Mount to `/app/server/src/database`
- Volume 2: Mount to `/app/server/uploads`

### 5. Initialize Database
Railway dashboard → Terminal:
```bash
npm run setup
```

### 6. Point Your Domain
In Railway → Settings → Domains:
- Add `www.allysesbridal.com`
- Copy DNS records

In your domain registrar (GoDaddy/Namecheap):
- Add CNAME: `www` → `your-app.railway.app`
- Wait 24-48 hours for DNS propagation

---

## 🔒 Security (Do This First!)

1. Generate strong JWT secret:
   ```bash
   openssl rand -base64 32
   ```

2. Login to admin panel: `your-domain.com/admin`
   - Username: `admin`
   - Password: What you set in env vars

3. Immediately change password in admin settings

4. Delete default admin after creating new account

---

## 💰 Cost
- **Free tier:** $5/month credit (covers small sites)
- **After credit:** ~$5-6/month total
  - Hosting: $2-3/month
  - Storage: $1/month
  - Domain: Already own
  - HTTPS: Free

---

## 📸 Images Are Handled!
- All 140+ images already in `server/uploads/`
- Persistent volume keeps them safe
- No extra storage service needed
- No migration required

---

## ✅ Done!
Your website is live at:
- Railway URL: `https://your-app.railway.app`
- Custom Domain: `https://www.allysesbridal.com` (after DNS)

Admin panel:
- URL: `your-domain.com/admin`
- Manage dresses, appointments, inquiries

---

## 🆘 Need Help?
See full guide: `DEPLOYMENT.md`
