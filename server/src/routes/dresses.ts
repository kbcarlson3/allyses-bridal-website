import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, dressSchema } from '../utils/validation.js';
import type { Dress, DressImage, ApiResponse, PaginatedResponse } from '../../../shared/src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'));
    }
  }
});

// Get all published dresses (public)
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 12;
    const offset = (page - 1) * per_page;

    const dresses = db.prepare(`
      SELECT * FROM dresses
      WHERE is_published = 1
      ORDER BY display_order ASC, created_at DESC
      LIMIT ? OFFSET ?
    `).all(per_page, offset) as any[];

    const total = db.prepare('SELECT COUNT(*) as count FROM dresses WHERE is_published = 1').get() as any;

    // Get images for each dress
    const dressesWithImages = dresses.map(dress => {
      const images = db.prepare('SELECT * FROM dress_images WHERE dress_id = ? ORDER BY display_order ASC').all(dress.id) as DressImage[];
      const primary_image = images.find(img => img.is_primary) || images[0];

      return {
        ...dress,
        features: JSON.parse(dress.features),
        is_new_arrival: Boolean(dress.is_new_arrival),
        is_published: Boolean(dress.is_published),
        images,
        primary_image
      };
    });

    res.json({
      success: true,
      data: {
        data: dressesWithImages,
        total: total.count,
        page,
        per_page,
        total_pages: Math.ceil(total.count / per_page)
      }
    } as ApiResponse<PaginatedResponse<Dress>>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Get dress by ID (public)
router.get('/:id', (req, res) => {
  try {
    const dress = db.prepare('SELECT * FROM dresses WHERE id = ? AND is_published = 1').get(req.params.id) as any;

    if (!dress) {
      return res.status(404).json({ success: false, error: 'Dress not found' } as ApiResponse);
    }

    const images = db.prepare('SELECT * FROM dress_images WHERE dress_id = ? ORDER BY display_order ASC').all(dress.id) as DressImage[];
    const primary_image = images.find(img => img.is_primary) || images[0];

    res.json({
      success: true,
      data: {
        ...dress,
        features: JSON.parse(dress.features),
        is_new_arrival: Boolean(dress.is_new_arrival),
        is_published: Boolean(dress.is_published),
        images,
        primary_image
      }
    } as ApiResponse<Dress>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Get all dresses
router.get('/admin/all', authenticateToken, (req, res) => {
  try {
    const dresses = db.prepare('SELECT * FROM dresses ORDER BY display_order ASC, created_at DESC').all() as any[];

    const dressesWithImages = dresses.map(dress => {
      const images = db.prepare('SELECT * FROM dress_images WHERE dress_id = ? ORDER BY display_order ASC').all(dress.id) as DressImage[];
      const primary_image = images.find(img => img.is_primary) || images[0];

      return {
        ...dress,
        features: JSON.parse(dress.features),
        is_new_arrival: Boolean(dress.is_new_arrival),
        is_published: Boolean(dress.is_published),
        images,
        primary_image
      };
    });

    res.json({ success: true, data: dressesWithImages } as ApiResponse<Dress[]>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Create dress
router.post('/', authenticateToken, validate(dressSchema), (req, res) => {
  try {
    const { name, price, description, features, is_new_arrival, is_published } = req.body;

    const result = db.prepare(`
      INSERT INTO dresses (name, price, description, features, is_new_arrival, is_published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, COALESCE((SELECT MAX(display_order) FROM dresses), 0) + 1)
    `).run(name, price, description, JSON.stringify(features), is_new_arrival ? 1 : 0, is_published ? 1 : 0);

    const dress = db.prepare('SELECT * FROM dresses WHERE id = ?').get(result.lastInsertRowid) as any;

    res.json({
      success: true,
      data: {
        ...dress,
        features: JSON.parse(dress.features),
        is_new_arrival: Boolean(dress.is_new_arrival),
        is_published: Boolean(dress.is_published),
        images: []
      }
    } as ApiResponse<Dress>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Update dress
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { name, price, description, features, is_new_arrival, is_published } = req.body;
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (price !== undefined) { updates.push('price = ?'); values.push(price); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (features !== undefined) { updates.push('features = ?'); values.push(JSON.stringify(features)); }
    if (is_new_arrival !== undefined) { updates.push('is_new_arrival = ?'); values.push(is_new_arrival ? 1 : 0); }
    if (is_published !== undefined) { updates.push('is_published = ?'); values.push(is_published ? 1 : 0); }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.params.id);

    db.prepare(`UPDATE dresses SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const dress = db.prepare('SELECT * FROM dresses WHERE id = ?').get(req.params.id) as any;
    const images = db.prepare('SELECT * FROM dress_images WHERE dress_id = ? ORDER BY display_order ASC').all(dress.id) as DressImage[];

    res.json({
      success: true,
      data: {
        ...dress,
        features: JSON.parse(dress.features),
        is_new_arrival: Boolean(dress.is_new_arrival),
        is_published: Boolean(dress.is_published),
        images
      }
    } as ApiResponse<Dress>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Delete dress
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Delete associated images from filesystem
    const images = db.prepare('SELECT image_path FROM dress_images WHERE dress_id = ?').all(req.params.id) as any[];
    const uploadsDir = path.join(__dirname, '../../uploads');

    for (const image of images) {
      try {
        await fs.unlink(path.join(uploadsDir, image.image_path));
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    db.prepare('DELETE FROM dresses WHERE id = ?').run(req.params.id);

    res.json({ success: true, message: 'Dress deleted successfully' } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Upload dress image
router.post('/:id/images', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' } as ApiResponse);
    }

    const dressId = req.params.id;
    const filename = `dress-${dressId}-${Date.now()}.webp`;
    const uploadsDir = path.join(__dirname, '../../uploads');
    const filepath = path.join(uploadsDir, filename);

    // Ensure uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Process and save image
    await sharp(req.file.buffer)
      .resize(1200, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(filepath);

    // Get current max display order
    const maxOrder = db.prepare('SELECT MAX(display_order) as max FROM dress_images WHERE dress_id = ?').get(dressId) as any;
    const displayOrder = (maxOrder?.max || -1) + 1;

    // Check if this is the first image (should be primary)
    const imageCount = db.prepare('SELECT COUNT(*) as count FROM dress_images WHERE dress_id = ?').get(dressId) as any;
    const isPrimary = imageCount.count === 0 ? 1 : 0;

    const result = db.prepare(`
      INSERT INTO dress_images (dress_id, image_path, is_primary, display_order)
      VALUES (?, ?, ?, ?)
    `).run(dressId, filename, isPrimary, displayOrder);

    const image = db.prepare('SELECT * FROM dress_images WHERE id = ?').get(result.lastInsertRowid) as any;

    res.json({
      success: true,
      data: {
        ...image,
        is_primary: Boolean(image.is_primary)
      }
    } as ApiResponse<DressImage>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Delete dress image
router.delete('/:dressId/images/:imageId', authenticateToken, async (req, res) => {
  try {
    const image = db.prepare('SELECT * FROM dress_images WHERE id = ? AND dress_id = ?').get(req.params.imageId, req.params.dressId) as any;

    if (!image) {
      return res.status(404).json({ success: false, error: 'Image not found' } as ApiResponse);
    }

    // Delete file from filesystem
    const filepath = path.join(__dirname, '../../uploads', image.image_path);
    try {
      await fs.unlink(filepath);
    } catch (err) {
      console.error('Error deleting image file:', err);
    }

    db.prepare('DELETE FROM dress_images WHERE id = ?').run(req.params.imageId);

    // If this was the primary image, set another image as primary
    if (image.is_primary) {
      const firstImage = db.prepare('SELECT id FROM dress_images WHERE dress_id = ? ORDER BY display_order ASC LIMIT 1').get(req.params.dressId) as any;
      if (firstImage) {
        db.prepare('UPDATE dress_images SET is_primary = 1 WHERE id = ?').run(firstImage.id);
      }
    }

    res.json({ success: true, message: 'Image deleted successfully' } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Set primary image
router.put('/:dressId/images/:imageId/primary', authenticateToken, (req, res) => {
  try {
    // Remove primary from all images of this dress
    db.prepare('UPDATE dress_images SET is_primary = 0 WHERE dress_id = ?').run(req.params.dressId);

    // Set this image as primary
    db.prepare('UPDATE dress_images SET is_primary = 1 WHERE id = ? AND dress_id = ?').run(req.params.imageId, req.params.dressId);

    res.json({ success: true, message: 'Primary image updated' } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

export default router;
