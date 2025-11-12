import express from 'express';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';
import type { Setting, BusinessHours, ApiResponse } from '../../../shared/src/types.js';

const router = express.Router();

// Get all settings (public - non-sensitive ones)
router.get('/', (req, res) => {
  try {
    const publicSettings = ['phone', 'email', 'address', 'hours', 'instagram_handle', 'facebook_url', 'our_story', 'welcome_message'];

    const settings = db.prepare(
      `SELECT * FROM settings WHERE setting_key IN (${publicSettings.map(() => '?').join(', ')})`
    ).all(...publicSettings) as Setting[];

    const settingsObj: Record<string, string> = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    res.json({ success: true, data: settingsObj } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Get all settings
router.get('/admin/all', authenticateToken, (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM settings').all() as Setting[];

    const settingsObj: Record<string, string> = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    res.json({ success: true, data: settingsObj } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Update settings
router.put('/', authenticateToken, (req, res) => {
  try {
    const updates = req.body as Record<string, string>;

    Object.entries(updates).forEach(([key, value]) => {
      db.prepare(`
        INSERT INTO settings (setting_key, setting_value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(setting_key) DO UPDATE SET
          setting_value = ?,
          updated_at = CURRENT_TIMESTAMP
      `).run(key, value, value);
    });

    const settings = db.prepare('SELECT * FROM settings').all() as Setting[];

    const settingsObj: Record<string, string> = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    res.json({
      success: true,
      data: settingsObj,
      message: 'Settings updated successfully'
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Get business hours
router.get('/hours', (req, res) => {
  try {
    const hours = db.prepare('SELECT * FROM business_hours ORDER BY day_of_week ASC').all() as BusinessHours[];
    res.json({ success: true, data: hours } as ApiResponse<BusinessHours[]>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Update business hours
router.put('/hours', authenticateToken, (req, res) => {
  try {
    const { hours } = req.body as { hours: Array<{ day_of_week: number; open_time: string; close_time: string; is_closed: boolean }> };

    hours.forEach(hour => {
      db.prepare(`
        INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(day_of_week) DO UPDATE SET
          open_time = ?,
          close_time = ?,
          is_closed = ?
      `).run(hour.day_of_week, hour.open_time, hour.close_time, hour.is_closed ? 1 : 0, hour.open_time, hour.close_time, hour.is_closed ? 1 : 0);
    });

    const updatedHours = db.prepare('SELECT * FROM business_hours ORDER BY day_of_week ASC').all() as BusinessHours[];
    res.json({ success: true, data: updatedHours } as ApiResponse<BusinessHours[]>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

export default router;
