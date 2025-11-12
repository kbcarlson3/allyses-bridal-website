import express from 'express';
import { Resend } from 'resend';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, appointmentSchema } from '../utils/validation.js';
import type {
  Appointment,
  BusinessHours,
  BlockedDate,
  TimeSlot,
  ApiResponse
} from '../../../shared/src/types.js';

const router = express.Router();

// Initialize Resend only if API key is provided
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder_key') {
  resend = new Resend(process.env.RESEND_API_KEY);
}

// Get available time slots for a date (public)
router.get('/availability', (req, res) => {
  try {
    const { date, appointment_type } = req.query;

    if (!date || !appointment_type) {
      return res.status(400).json({
        success: false,
        error: 'Date and appointment_type are required'
      } as ApiResponse);
    }

    // Check if date is blocked
    const blocked = db.prepare('SELECT * FROM blocked_dates WHERE blocked_date = ?').get(date) as BlockedDate | undefined;
    if (blocked) {
      return res.json({
        success: true,
        data: { available: false, reason: blocked.reason, slots: [] }
      } as ApiResponse);
    }

    // Get day of week (0 = Sunday, 6 = Saturday)
    const dateObj = new Date(date as string);
    const dayOfWeek = dateObj.getDay();

    // Get business hours for this day
    const businessHours = db.prepare('SELECT * FROM business_hours WHERE day_of_week = ?').get(dayOfWeek) as BusinessHours | undefined;

    if (!businessHours || businessHours.is_closed) {
      return res.json({
        success: true,
        data: { available: false, reason: 'Closed', slots: [] }
      } as ApiResponse);
    }

    // Get existing appointments for this date
    const existingAppointments = db.prepare(
      'SELECT appointment_time, duration_minutes FROM appointments WHERE appointment_date = ? AND status != ?'
    ).all(date, 'cancelled') as Appointment[];

    // Generate time slots
    const slots: TimeSlot[] = [];
    const [openHour, openMinute] = businessHours.open_time.split(':').map(Number);
    const [closeHour, closeMinute] = businessHours.close_time.split(':').map(Number);

    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    const slotDuration = 30; // Default 30-minute slots

    for (let time = openTime; time < closeTime; time += slotDuration) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      // Check if slot is available
      const isBooked = existingAppointments.some(apt => {
        const [aptHour, aptMinute] = apt.appointment_time.split(':').map(Number);
        const aptTime = aptHour * 60 + aptMinute;
        const aptEnd = aptTime + apt.duration_minutes;

        return (time >= aptTime && time < aptEnd) || (time + slotDuration > aptTime && time < aptTime);
      });

      slots.push({
        time: timeString,
        available: !isBooked
      });
    }

    res.json({
      success: true,
      data: { available: true, slots }
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Create appointment (public)
router.post('/', validate(appointmentSchema), async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      appointment_type,
      appointment_date,
      appointment_time,
      duration_minutes = 30,
      notes
    } = req.body;

    // Check if slot is still available
    const existingAppointments = db.prepare(
      'SELECT appointment_time, duration_minutes FROM appointments WHERE appointment_date = ? AND status != ?'
    ).all(appointment_date, 'cancelled') as Appointment[];

    const [reqHour, reqMinute] = appointment_time.split(':').map(Number);
    const reqTime = reqHour * 60 + reqMinute;

    const isBooked = existingAppointments.some(apt => {
      const [aptHour, aptMinute] = apt.appointment_time.split(':').map(Number);
      const aptTime = aptHour * 60 + aptMinute;
      const aptEnd = aptTime + apt.duration_minutes;

      return (reqTime >= aptTime && reqTime < aptEnd) || (reqTime + duration_minutes > aptTime && reqTime < aptTime);
    });

    if (isBooked) {
      return res.status(400).json({
        success: false,
        error: 'This time slot is no longer available'
      } as ApiResponse);
    }

    // Create appointment
    const result = db.prepare(`
      INSERT INTO appointments (customer_name, customer_phone, customer_email, appointment_type, appointment_date, appointment_time, duration_minutes, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(customer_name, customer_phone, customer_email, appointment_type, appointment_date, appointment_time, duration_minutes, notes || null);

    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid) as Appointment;

    // Send confirmation email (if Resend is configured)
    if (resend) {
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@allysebridal.com',
          to: customer_email,
          subject: `Appointment Confirmation - Allyse's Bridal`,
          html: `
            <h2>Appointment Confirmation</h2>
            <p>Dear ${customer_name},</p>
            <p>Your appointment has been scheduled!</p>
            <h3>Appointment Details:</h3>
            <ul>
              <li><strong>Type:</strong> ${appointment_type}</li>
              <li><strong>Date:</strong> ${appointment_date}</li>
              <li><strong>Time:</strong> ${appointment_time}</li>
              <li><strong>Duration:</strong> ${duration_minutes} minutes</li>
            </ul>
            <p>If you need to cancel or reschedule, please call us at (801) 224-0059.</p>
            <p>We look forward to seeing you!</p>
            <p><strong>Allyse's Bridal and Formal</strong><br/>
            4801 N University Ave, Provo, UT 84604<br/>
            (801) 224-0059</p>
          `
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log('Email not configured - skipping confirmation email');
    }

    res.json({
      success: true,
      data: appointment,
      message: 'Appointment created successfully. Confirmation email sent.'
    } as ApiResponse<Appointment>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Get all appointments
router.get('/admin/all', authenticateToken, (req, res) => {
  try {
    const { start_date, end_date, status } = req.query;
    let query = 'SELECT * FROM appointments WHERE 1=1';
    const params: any[] = [];

    if (start_date) {
      query += ' AND appointment_date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      query += ' AND appointment_date <= ?';
      params.push(end_date);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY appointment_date ASC, appointment_time ASC';

    const appointments = db.prepare(query).all(...params) as Appointment[];

    res.json({ success: true, data: appointments } as ApiResponse<Appointment[]>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Update appointment
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      'customer_name', 'customer_phone', 'customer_email',
      'appointment_type', 'appointment_date', 'appointment_time',
      'duration_minutes', 'status', 'notes'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      } as ApiResponse);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.params.id);

    db.prepare(`UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id) as Appointment;

    res.json({
      success: true,
      data: appointment,
      message: 'Appointment updated successfully'
    } as ApiResponse<Appointment>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Delete appointment
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM appointments WHERE id = ?').run(req.params.id);

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Get business hours
router.get('/admin/business-hours', authenticateToken, (req, res) => {
  try {
    const hours = db.prepare('SELECT * FROM business_hours ORDER BY day_of_week ASC').all() as BusinessHours[];
    res.json({ success: true, data: hours } as ApiResponse<BusinessHours[]>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Update business hours
router.put('/admin/business-hours/:dayOfWeek', authenticateToken, (req, res) => {
  try {
    const { open_time, close_time, is_closed } = req.body;
    const dayOfWeek = parseInt(req.params.dayOfWeek);

    db.prepare(`
      INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(day_of_week) DO UPDATE SET
        open_time = ?,
        close_time = ?,
        is_closed = ?
    `).run(dayOfWeek, open_time, close_time, is_closed ? 1 : 0, open_time, close_time, is_closed ? 1 : 0);

    const hours = db.prepare('SELECT * FROM business_hours WHERE day_of_week = ?').get(dayOfWeek) as BusinessHours;

    res.json({ success: true, data: hours } as ApiResponse<BusinessHours>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Get blocked dates
router.get('/admin/blocked-dates', authenticateToken, (req, res) => {
  try {
    const dates = db.prepare('SELECT * FROM blocked_dates ORDER BY blocked_date ASC').all() as BlockedDate[];
    res.json({ success: true, data: dates } as ApiResponse<BlockedDate[]>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Add blocked date
router.post('/admin/blocked-dates', authenticateToken, (req, res) => {
  try {
    const { blocked_date, reason } = req.body;

    const result = db.prepare('INSERT INTO blocked_dates (blocked_date, reason) VALUES (?, ?)').run(blocked_date, reason);

    const blockedDate = db.prepare('SELECT * FROM blocked_dates WHERE id = ?').get(result.lastInsertRowid) as BlockedDate;

    res.json({ success: true, data: blockedDate } as ApiResponse<BlockedDate>);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

// Admin: Delete blocked date
router.delete('/admin/blocked-dates/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM blocked_dates WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Blocked date removed' } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message } as ApiResponse);
  }
});

export default router;
