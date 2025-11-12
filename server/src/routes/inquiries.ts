import express from 'express';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, inquirySchema } from '../utils/validation.js';
import type { Inquiry, ApiResponse } from '../../../shared/src/types.js';

const router = express.Router();

// Submit inquiry (public)
router.post('/', validate(inquirySchema), (req, res) => {
  try {
    const { name, email, phone, message, inquiry_type } = req.body;

    const result = db.prepare(`
      INSERT INTO inquiries (name, email, phone, message, inquiry_type, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `).run(name, email, phone || null, message, inquiry_type || 'general');

    const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(result.lastInsertRowid) as Inquiry;

    res.json({
      success: true,
      data: inquiry,
      message: 'Inquiry submitted successfully. We will get back to you soon.'
    } as ApiResponse<Inquiry>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Get all inquiries
router.get('/admin/all', authenticateToken, (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM inquiries';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const inquiries = db.prepare(query).all(...params) as Inquiry[];

    res.json({ success: true, data: inquiries } as ApiResponse<Inquiry[]>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Update inquiry status
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'handled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      } as ApiResponse);
    }

    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, req.params.id);

    const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id) as Inquiry;

    res.json({
      success: true,
      data: inquiry,
      message: 'Inquiry updated successfully'
    } as ApiResponse<Inquiry>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Delete inquiry
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id);

    res.json({
      success: true,
      message: 'Inquiry deleted successfully'
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

export default router;
