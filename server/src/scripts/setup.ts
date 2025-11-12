import bcrypt from 'bcryptjs';
import { initializeDatabase, db } from '../database/init.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Setting up database...\n');

// Initialize database schema
initializeDatabase();

// Create default admin account
const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
const password = process.env.DEFAULT_ADMIN_PASSWORD || 'changeme123';

const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

if (!existingUser) {
  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, passwordHash, 'admin');
  console.log(`✓ Created admin account (username: ${username}, password: ${password})`);
} else {
  console.log(`✓ Admin account already exists (username: ${username})`);
}

// Set default business hours (Mon-Sat: 10am-6pm, Sun: Closed)
const businessHours = [
  { day: 0, open: '10:00', close: '18:00', closed: 1 }, // Sunday - Closed
  { day: 1, open: '10:00', close: '18:00', closed: 0 }, // Monday
  { day: 2, open: '10:00', close: '18:00', closed: 0 }, // Tuesday
  { day: 3, open: '10:00', close: '18:00', closed: 0 }, // Wednesday
  { day: 4, open: '10:00', close: '18:00', closed: 0 }, // Thursday
  { day: 5, open: '10:00', close: '18:00', closed: 0 }, // Friday
  { day: 6, open: '10:00', close: '18:00', closed: 0 }, // Saturday
];

businessHours.forEach(({ day, open, close, closed }) => {
  const existing = db.prepare('SELECT * FROM business_hours WHERE day_of_week = ?').get(day);
  if (!existing) {
    db.prepare('INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed) VALUES (?, ?, ?, ?)').run(day, open, close, closed);
  }
});
console.log('✓ Business hours configured');

// Set default settings
const defaultSettings = [
  { key: 'phone', value: '(801) 224-0059' },
  { key: 'email', value: 'info@allysebridal.com' },
  { key: 'address', value: '4801 N University Ave, Provo, UT 84604' },
  { key: 'hours', value: 'Monday - Saturday: 10:00 AM - 6:00 PM, Sunday: Closed' },
  { key: 'instagram_handle', value: '@allysebridal' },
  { key: 'facebook_url', value: 'https://facebook.com/allysebridal' },
  {
    key: 'our_story',
    value: 'Established in 2000, Allyse\'s Bridal and Formal is owned by Janelle Carlson and specializes in modest formal wear with unique, innovative designs. We pride ourselves on our large in-stock inventory, in-house customizations and alterations, great customer service, and fair pricing. Every bride deserves to feel beautiful and confident on her special day, and we\'re here to make that dream come true.'
  },
  {
    key: 'welcome_message',
    value: 'Welcome to Allyse\'s Bridal and Formal, where elegance meets modesty. We offer a curated collection of stunning wedding dresses and formal wear, each designed with care and attention to detail. Our expert seamstresses provide in-house alterations to ensure your dress fits perfectly. Schedule an appointment today to find your dream dress!'
  }
];

defaultSettings.forEach(({ key, value }) => {
  const existing = db.prepare('SELECT * FROM settings WHERE setting_key = ?').get(key);
  if (!existing) {
    db.prepare('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)').run(key, value);
  }
});
console.log('✓ Default settings configured');

console.log('\n✅ Setup complete!\n');
console.log('Next steps:');
console.log('1. Run "npm run seed" to add sample dresses and gallery images');
console.log('2. Run "npm run dev" to start the development server');
console.log(`3. Login to admin panel with username: ${username}, password: ${password}`);
console.log('4. IMPORTANT: Change the admin password in production!\n');
