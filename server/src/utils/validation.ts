import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().required().min(3).max(50),
  password: Joi.string().required().min(6)
});

export const dressSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  price: Joi.number().required().min(0).max(99999),
  description: Joi.string().required().min(10).max(5000),
  features: Joi.array().items(Joi.string()).required(),
  is_new_arrival: Joi.boolean().optional(),
  is_published: Joi.boolean().optional()
});

export const appointmentSchema = Joi.object({
  customer_name: Joi.string().required().min(2).max(100),
  customer_phone: Joi.string().required().pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
  customer_email: Joi.string().required().email(),
  appointment_type: Joi.string().required().valid('consultation', 'alterations', 'fitting'),
  appointment_date: Joi.string().required().pattern(/^\d{4}-\d{2}-\d{2}$/),
  appointment_time: Joi.string().required().pattern(/^\d{2}:\d{2}$/),
  duration_minutes: Joi.number().optional().min(15).max(240),
  notes: Joi.string().optional().allow('').max(1000)
});

export const inquirySchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().required().email(),
  phone: Joi.string().optional().allow('').pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
  message: Joi.string().required().min(10).max(2000),
  inquiry_type: Joi.string().optional().valid('general', 'appointment', 'alterations', 'floral')
});

export function validate(schema: Joi.ObjectSchema) {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    next();
  };
}
