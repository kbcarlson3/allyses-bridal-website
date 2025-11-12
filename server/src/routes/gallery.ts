import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';
import type { GalleryImage, ApiResponse } from '../../../shared/src/types.js';

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

// Get all gallery images (public)
router.get('/', (req, res) => {
  try {
    const images = db.prepare('SELECT * FROM gallery_images ORDER BY display_order ASC, created_at DESC').all() as GalleryImage[];

    res.json({ success: true, data: images } as ApiResponse<GalleryImage[]>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Upload gallery image
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' } as ApiResponse);
    }

    const filename = `gallery-${Date.now()}.webp`;
    const uploadsDir = path.join(__dirname, '../../uploads');
    const filepath = path.join(uploadsDir, filename);

    // Ensure uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Process and save image
    await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(filepath);

    // Get current max display order
    const maxOrder = db.prepare('SELECT MAX(display_order) as max FROM gallery_images').get() as any;
    const displayOrder = (maxOrder?.max || -1) + 1;

    const caption = req.body.caption || null;

    const result = db.prepare(`
      INSERT INTO gallery_images (image_path, caption, display_order)
      VALUES (?, ?, ?)
    `).run(filename, caption, displayOrder);

    const image = db.prepare('SELECT * FROM gallery_images WHERE id = ?').get(result.lastInsertRowid) as GalleryImage;

    res.json({
      success: true,
      data: image,
      message: 'Gallery image uploaded successfully'
    } as ApiResponse<GalleryImage>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Update gallery image caption
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { caption } = req.body;

    db.prepare('UPDATE gallery_images SET caption = ? WHERE id = ?').run(caption || null, req.params.id);

    const image = db.prepare('SELECT * FROM gallery_images WHERE id = ?').get(req.params.id) as GalleryImage;

    res.json({
      success: true,
      data: image,
      message: 'Gallery image updated successfully'
    } as ApiResponse<GalleryImage>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Update gallery images order
router.put('/reorder', authenticateToken, (req, res) => {
  try {
    const { imageIds } = req.body as { imageIds: number[] };

    if (!Array.isArray(imageIds)) {
      return res.status(400).json({
        success: false,
        error: 'imageIds must be an array'
      } as ApiResponse);
    }

    imageIds.forEach((id, index) => {
      db.prepare('UPDATE gallery_images SET display_order = ? WHERE id = ?').run(index, id);
    });

    const images = db.prepare('SELECT * FROM gallery_images ORDER BY display_order ASC').all() as GalleryImage[];

    res.json({
      success: true,
      data: images,
      message: 'Gallery order updated successfully'
    } as ApiResponse<GalleryImage[]>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Delete gallery image
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const image = db.prepare('SELECT * FROM gallery_images WHERE id = ?').get(req.params.id) as GalleryImage | undefined;

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

    db.prepare('DELETE FROM gallery_images WHERE id = ?').run(req.params.id);

    res.json({
      success: true,
      message: 'Gallery image deleted successfully'
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

export default router;
