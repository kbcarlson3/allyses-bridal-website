# 🚀 Deployment Guide - Allyse's Bridal Website

## Most Inexpensive Deployment Option: Railway.app

**Cost:** Free tier ($5/month credit) → ~$5/month after credit usage  
**Includes:** Persistent storage, custom domain, HTTPS, auto-deploy

---

## 📋 Pre-Deployment Steps

### 1. Initialize Git Repository (if not already done)

```bash
cd /Users/keatoncarlson/allyses_new_website
git init
git add .
git commit -m "Initial commit - production ready"
```

### 2. Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/allyses-bridal.git
git branch -M main
git push -u origin main
```

---

## 🛠️ Railway Deployment Steps

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account (free)
3. You get $5/month free credit

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `allyses-bridal` repository
4. Railway will auto-detect the Node.js project

### Step 3: Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```env
NODE_ENV=production
JWT_SECRET=YOUR_STRONG_RANDOM_SECRET_HERE
PORT=3000
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@allysesbridal.com
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=CHANGE_THIS_TO_SECURE_PASSWORD
CORS_ORIGIN=https://your-domain.com
```

**🔐 IMPORTANT SECURITY:**
- `JWT_SECRET`: Generate with: `openssl rand -base64 32`
- `DEFAULT_ADMIN_PASSWORD`: Use a strong password (20+ characters)

### Step 4: Add Persistent Volumes

Railway needs volumes for:
1. **Database:** `server/src/database/bridal.db`
2. **Uploads:** `server/uploads/`

In Railway dashboard:
1. Go to **Volumes** tab
2. Click "Add Volume"
3. Mount path: `/app/server/src/database` (for database)
4. Add another volume for `/app/server/uploads` (for images)

### Step 5: Deploy

1. Click "Deploy" in Railway
2. Wait for build to complete (~3-5 minutes)
3. Railway will provide a URL like: `https://your-app.railway.app`

### Step 6: Initialize Database

After first deployment:

1. In Railway dashboard, click "Terminal" tab
2. Run: `npm run setup` (creates database and default admin)
3. Run: `npm run seed` (optional - adds sample dresses)

---

## 🌐 Custom Domain Setup

### Option 1: Use Railway Subdomain (Free)
Your site is at: `https://your-app.railway.app`

### Option 2: Custom Domain (allysesbridal.com)

#### A. In Railway:
1. Go to **Settings** → **Domains**
2. Click "Add Domain"
3. Enter: `www.allysesbridal.com`
4. Railway shows DNS records to add

#### B. In Your Domain Registrar (GoDaddy/Namecheap/etc):
1. Go to DNS settings
2. Add CNAME record:
   - **Host:** `www`
   - **Points to:** `your-app.railway.app`
   - **TTL:** Automatic
3. Add A record for root domain:
   - **Host:** `@` or blank
   - **Points to:** Railway's IP (shown in dashboard)

#### C. Wait for DNS Propagation
- Can take 1-48 hours
- Check status: `dig www.allysesbridal.com`

---

## 🔒 Security Checklist

### Before Launch:

- [ ] Change `JWT_SECRET` to strong random value
- [ ] Change `DEFAULT_ADMIN_PASSWORD` to strong password
- [ ] Update `CORS_ORIGIN` to your domain
- [ ] Enable HTTPS (automatic on Railway)
- [ ] Log into admin panel and change password again
- [ ] Delete default admin after creating new account

### Admin Panel Security:

**URL:** `https://your-domain.com/admin/login`

1. **First login:** Use credentials from env vars
2. **Immediately:** Go to Settings → Change Password
3. **Create new admin:** Admin Dashboard → Create another admin
4. **Delete default:** Delete the original admin account

---

## 💾 Image Storage - Already Handled!

Your images are stored in `server/uploads/` which maps to Railway volume:
- ✅ **Persistent:** Survives deployments
- ✅ **Backed up:** Railway handles backups
- ✅ **Fast:** Served directly by Express

Current images (~100MB):
- 97 dress product images
- 10 hero gallery images
- 16 gallery images

---

## 💰 Cost Breakdown

### Railway Free Tier:
- **$5/month credit** (should cover small site)
- Includes:
  - Hosting
  - Persistent volumes
  - HTTPS certificate
  - Custom domain support
  - Auto-deploy on git push

### After Free Credit (~$5/month):
- **Execution:** ~$2-3/month
- **Storage:** ~$1/month (for database + images)
- **Bandwidth:** Free up to reasonable limits

**Total: ~$5-6/month for professional hosting!**

---

## 📧 Email Configuration (Optional)

For appointment confirmation emails:

### Option 1: Resend.com (Recommended)
- **Free Tier:** 3,000 emails/month
- **Setup:**
  1. Sign up at [resend.com](https://resend.com)
  2. Verify your domain (allysesbridal.com)
  3. Get API key
  4. Add to Railway env: `RESEND_API_KEY=re_xxx`

### Option 2: Skip Email
- Appointments still save to database
- Check via admin panel

---

## 🚀 Deployment Commands

### Local Testing:
```bash
# Build for production
npm run build

# Test production build locally
NODE_ENV=production npm start
```

### Railway Auto-Deploy:
```bash
# Just push to main branch
git add .
git commit -m "Update"
git push origin main
# Railway auto-deploys in ~2-3 minutes
```

---

## 📊 Monitoring

### Railway Dashboard:
- **Metrics:** CPU, Memory, Network usage
- **Logs:** Real-time server logs
- **Deployments:** History and rollback

### Health Check:
```bash
curl https://your-domain.com/api/health
```

Should return:
```json
{"success":true,"message":"Server is running"}
```

---

## 🔄 Updates & Maintenance

### Adding New Dresses:
1. Log into admin panel: `your-domain.com/admin`
2. Go to Dress Management
3. Add dress + upload images
4. Publish when ready

### Database Backup:
Railway auto-backs up volumes, but you can also:
```bash
# In Railway terminal
sqlite3 src/database/bridal.db .dump > backup.sql
```

### Rollback Deployment:
1. Railway dashboard → Deployments
2. Click previous deployment
3. Click "Redeploy"

---

## ❓ Troubleshooting

### Site Not Loading:
1. Check Railway logs in dashboard
2. Verify environment variables are set
3. Ensure volumes are mounted correctly

### Images Not Showing:
1. Verify upload volume is mounted at `/app/server/uploads`
2. Check Railway logs for file permission errors
3. Verify images uploaded via admin panel

### Admin Login Fails:
1. Check Railway env vars: `DEFAULT_ADMIN_USERNAME` & `DEFAULT_ADMIN_PASSWORD`
2. Run `npm run setup` in Railway terminal to reset admin
3. Verify `JWT_SECRET` is set

### DNS Not Working:
1. Check DNS propagation: `dig your-domain.com`
2. Wait 24-48 hours for full propagation
3. Verify DNS records match Railway instructions

---

## 📞 Support

- **Railway:** [railway.app/help](https://railway.app/help)
- **Railway Discord:** [discord.gg/railway](https://discord.gg/railway)
- **This Project:** Check logs in Railway dashboard

---

## ✅ Launch Checklist

Before going live:

- [ ] Push code to GitHub
- [ ] Deploy to Railway
- [ ] Add environment variables
- [ ] Configure persistent volumes
- [ ] Run `npm run setup` to initialize database
- [ ] Change all default passwords
- [ ] Configure custom domain
- [ ] Test all pages work
- [ ] Test admin login
- [ ] Test image uploads
- [ ] Test appointment booking
- [ ] Setup email (Resend)
- [ ] Monitor for 24 hours

**🎉 You're Live!**

