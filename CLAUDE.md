# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack TypeScript monorepo for Allyse's Bridal and Formal, featuring a React frontend, Express backend, and SQLite database. The application has two main interfaces: a public-facing storefront and a secure admin panel.

## Architecture

### Monorepo Structure (npm workspaces)

- **client/**: React 18 frontend with Vite, TypeScript, Tailwind CSS, and react-router-dom
- **server/**: Express backend with TypeScript, SQLite (better-sqlite3), JWT auth, and email (Resend)
- **shared/**: Shared TypeScript types exported to both client and server

The shared workspace must be built before client/server to ensure types are available.

### Key Dependencies

**Server:**
- `better-sqlite3`: File-based SQLite database (stored at `server/src/database/bridal.db`)
- `sharp`: Image processing (auto-converts uploads to WebP, resizes to 1200px width)
- `resend`: Email service for appointment confirmations
- `bcryptjs` + `jsonwebtoken`: Authentication
- `helmet`, `express-rate-limit`, `joi`: Security and validation

**Client:**
- `react-big-calendar` + `moment`: Admin appointment calendar
- `react-hook-form`: Form handling
- `lucide-react`: Icon library
- `axios`: API client (configured in `client/src/services/api.ts`)

### Database

SQLite database with schema defined in `server/src/database/init.ts`. Tables include:
- users (admin accounts)
- dresses, dress_images (dress catalog with multi-image support)
- appointments (booking system)
- business_hours, blocked_dates (scheduling)
- inquiries (contact form submissions)
- gallery_images (homepage gallery)
- settings (key-value config store)

### Authentication Flow

- JWT tokens stored in localStorage
- Auth context in `client/src/context/AuthContext.tsx`
- Protected routes use auth middleware (`server/src/middleware/auth.ts`)
- Admin panel is entirely behind authentication
- Default admin credentials: `admin` / `changeme123` (must be changed in production)

### File Upload System

- Images uploaded to `server/uploads/`
- Sharp automatically processes: resize to 1200px max width, convert to WebP at 85% quality
- Files served statically via Express at `/uploads/*`
- Dress images support primary image designation and display ordering
- Gallery images support captions and display ordering

## Common Commands

### Development

```bash
# Install all workspace dependencies
npm install

# Start both client and server in watch mode (runs concurrently)
npm run dev
# Client: http://localhost:5173
# Server: http://localhost:3000

# Run individual workspaces
npm run dev:client  # Frontend only
npm run dev:server  # Backend only (uses tsx watch)
```

### Database Setup

```bash
# Create database schema and default admin account
npm run setup

# Add 12 sample dresses (optional)
npm run seed
```

### Building

```bash
# Build all workspaces (shared → client → server)
npm run build

# Build individual workspaces
npm run build:client  # Vite build to client/dist
npm run build:server  # TypeScript compile to server/dist

# Production start (serves built client from server)
npm start
```

### Testing Individual Components

**Server routes:** Use curl or a REST client to test API endpoints. See README.md for full endpoint list.

**Client components:** Start dev server and navigate to specific routes. Admin panel at `/admin/*`.

## Development Guidelines

### Adding New Features to Shared Types

1. Edit `shared/src/types.ts`
2. Run `npm run build --workspace=shared` (or full `npm run build`)
3. Both client and server will then have access to new types

### Image Upload Changes

- Images are processed by Sharp middleware before saving
- Current settings: max 1200px width, WebP format, 85% quality
- Modify in dress/gallery route handlers if needed
- Ensure `server/uploads/` directory persists in production (Railway/Render need volume/disk configuration)

### Database Migrations

There is no formal migration system. Schema changes require:
1. Update `server/src/database/init.ts`
2. Either manually alter production DB or drop and re-run setup (data loss)
3. For production, consider manual SQL `ALTER TABLE` commands

### API Client

Frontend API calls use `client/src/services/api.ts` which configures axios with base URL and auth headers. Import and use this client for consistency.

### Email Configuration

Appointment confirmations use Resend API. Configure in `server/.env`:
- `RESEND_API_KEY`: Get from https://resend.com (free tier: 3,000 emails/month)
- `FROM_EMAIL`: Must be verified domain in Resend

## Key Files

- `server/src/index.ts`: Express server entry point with all middleware and routes
- `server/src/database/init.ts`: Database schema definition
- `server/src/routes/`: API route handlers (auth, dresses, appointments, settings, inquiries, gallery)
- `client/src/App.tsx`: React Router configuration with public/admin route split
- `client/src/pages/admin/`: Admin panel components
- `client/src/pages/public/`: Public-facing pages
- `client/src/context/AuthContext.tsx`: Authentication state management

## Production Deployment

Configured for Railway (see `railway.json` and `Procfile`) or Render. See DEPLOYMENT.md for detailed instructions.

**Critical production steps:**
1. Set strong `JWT_SECRET` environment variable
2. Configure `RESEND_API_KEY` for email
3. Ensure `server/uploads/` and `server/src/database/` persist (configure volumes/disks)
4. Change default admin password immediately after first login
5. Set `NODE_ENV=production`

## Environment Variables

Located in `server/.env` (development defaults provided). Production requires:
- `JWT_SECRET`: Must be changed from dev default
- `RESEND_API_KEY`: Required for appointment emails
- `NODE_ENV`: Set to `production`
- `CORS_ORIGIN`: Frontend URL (auto-detected in dev)
- `PORT`: Default 3000

## Known Patterns

- All API responses follow `ApiResponse<T>` interface from shared types
- Forms use `react-hook-form` with validation
- Admin calendar uses `react-big-calendar` with moment.js for date handling
- Business hours use day_of_week (0-6, Sunday-Saturday)
- Appointment durations are stored in minutes
