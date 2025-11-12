# Allyse's Bridal and Formal Website

A modern, full-stack website for Allyse's Bridal and Formal, featuring a public-facing storefront and comprehensive admin panel for managing dresses, appointments, and content.

## Features

### Customer-Facing
- Browse wedding dresses and formal wear
- View detailed product information with image galleries
- Book appointments online with automatic email confirmation
- Learn about alterations and floral design services
- Contact form for inquiries
- Responsive design for mobile, tablet, and desktop

### Admin Panel
- Dress management (add, edit, delete, upload images)
- Appointment calendar and booking management
- Business hours and blocked dates configuration
- Gallery management for homepage
- Customer inquiry inbox
- Website settings (contact info, about text, etc.)
- Secure JWT authentication

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (simple, file-based)
- **Image Processing**: Sharp (automatic WebP conversion, resizing)
- **Email**: Resend API for appointment confirmations
- **Authentication**: JWT with bcrypt password hashing

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup the database**
   ```bash
   npm run setup
   ```
   This creates the database schema, default admin account, and initial settings.

3. **Seed sample data (optional)**
   ```bash
   npm run seed
   ```
   Adds 12 sample dresses to get you started.

4. **Configure environment variables**

   The server already has a `.env` file with development defaults. For production, update:
   - `JWT_SECRET`: Change to a strong random string
   - `RESEND_API_KEY`: Add your Resend API key for email confirmations
   - `NODE_ENV`: Set to `production`

### Development

Run both client and server in development mode:
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

Or run them separately:
```bash
npm run dev:client  # Frontend only
npm run dev:server  # Backend only
```

### Production Build

```bash
npm run build
npm start
```

## Default Admin Access

- **URL**: http://localhost:5173/admin/login
- **Username**: `admin`
- **Password**: `changeme123`

**IMPORTANT**: Change the admin password immediately after first login!

## Deployment

### Railway / Render

1. Connect your Git repository
2. Set environment variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=<your-secret-key>`
   - `RESEND_API_KEY=<your-api-key>`
3. Build command: `npm run build`
4. Start command: `npm start`

The SQLite database file will be stored in the `server/src/database` directory. For persistence, ensure this directory is included in your hosting platform's persistent storage.

### File Uploads

Uploaded images are stored in `server/uploads`. Ensure this directory persists across deployments or consider using cloud storage (S3, Cloudinary) for production.

## Project Structure

```
allyses-bridal/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   └── context/        # Auth context
│   └── public/
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth middleware
│   │   ├── database/       # SQLite setup
│   │   ├── scripts/        # Setup & seed scripts
│   │   └── utils/          # Validation utilities
│   └── uploads/            # User-uploaded images
└── shared/                 # Shared TypeScript types

```

## API Endpoints

### Public
- `GET /api/dresses` - List published dresses
- `GET /api/dresses/:id` - Get dress details
- `GET /api/appointments/availability` - Check time slot availability
- `POST /api/appointments` - Book appointment
- `POST /api/inquiries` - Submit inquiry
- `GET /api/gallery` - Get gallery images
- `GET /api/settings` - Get public settings

### Admin (requires authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token
- `GET /api/dresses/admin/all` - Get all dresses
- `POST /api/dresses` - Create dress
- `PUT /api/dresses/:id` - Update dress
- `DELETE /api/dresses/:id` - Delete dress
- `POST /api/dresses/:id/images` - Upload dress image
- `GET /api/appointments/admin/all` - Get all appointments
- `PUT /api/appointments/:id` - Update appointment
- And more...

## Database Backup

The SQLite database is stored at `server/src/database/bridal.db`. To backup:

```bash
cp server/src/database/bridal.db server/src/database/bridal-backup-$(date +%Y%m%d).db
```

## Support

For issues or questions, contact the developer or refer to the USER_GUIDE.md for detailed instructions on using the admin panel.

## License

Private - All Rights Reserved
