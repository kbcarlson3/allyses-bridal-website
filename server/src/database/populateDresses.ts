import { db } from './init.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DressData {
  name: string;
  slug: string;
  price: number;
  description: string;
  is_new_arrival: boolean;
  images: string[];
}

async function populateDresses() {
  // Read the dress data from JSON file
  const dressDataPath = path.join(__dirname, '../../uploads/COMPLETE_DRESS_DATA.json');
  const dressData: DressData[] = JSON.parse(fs.readFileSync(dressDataPath, 'utf-8'));

  console.log(`Found ${dressData.length} dresses to populate`);

  // Clear existing dresses and images
  db.exec('DELETE FROM dress_images');
  db.exec('DELETE FROM dresses');
  console.log('Cleared existing dresses and images');

  // Prepare statements for better performance
  const insertDressStmt = db.prepare(`
    INSERT INTO dresses (name, price, description, features, is_new_arrival, is_published, display_order)
    VALUES (?, ?, ?, ?, ?, 1, ?)
  `);

  const insertImageStmt = db.prepare(`
    INSERT INTO dress_images (dress_id, image_path, is_primary, display_order)
    VALUES (?, ?, ?, ?)
  `);

  // Process each dress
  let displayOrder = 0;
  for (const dress of dressData) {
    displayOrder++;

    // Insert dress
    const result = insertDressStmt.run(
      dress.name,
      dress.price,
      dress.description,
      '[]', // features - empty array as JSON
      dress.is_new_arrival ? 1 : 0,
      displayOrder
    );

    const dressId = result.lastInsertRowid;
    console.log(`Inserted dress: ${dress.name} (ID: ${dressId})`);

    // Insert images
    dress.images.forEach((imageName, index) => {
      const imagePath = `dresses/${imageName}`;
      insertImageStmt.run(
        dressId,
        imagePath,
        index === 0 ? 1 : 0, // First image is primary
        index
      );
    });

    console.log(`  Added ${dress.images.length} images`);
  }

  console.log(`\n✅ Successfully populated ${dressData.length} dresses with images!`);

  // Show summary
  const totalDresses = db.prepare('SELECT COUNT(*) as count FROM dresses').get() as { count: number };
  const totalImages = db.prepare('SELECT COUNT(*) as count FROM dress_images').get() as { count: number };
  console.log(`\nDatabase summary:`);
  console.log(`- Total dresses: ${totalDresses.count}`);
  console.log(`- Total images: ${totalImages.count}`);
}

populateDresses().catch(console.error);
