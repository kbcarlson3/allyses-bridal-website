import { db } from './init.js';

const galleryImages = [
  // Service images (used by HomePage services section via galleryImages[0] and [1])
  {
    image_path: 'service-consultation-correct.jpg',
    caption: 'Wedding Dress Consultation',
    display_order: 1
  },
  {
    image_path: 'service-alterations-correct.jpg',
    caption: 'Alterations Service',
    display_order: 2
  },
  // Our Story image (used by HomePage our story section via galleryImages[2])
  {
    image_path: 'our-story-image.jpg',
    caption: 'Our Story - Bride with bouquet',
    display_order: 3
  },
  // Instagram gallery images (used by HomePage Instagram section via galleryImages.slice(3, 6))
  {
    image_path: 'gallery-instagram-october-sale.jpg',
    caption: 'October Sale - 1/2 OFF BRIDAL PARTY',
    display_order: 4
  },
  {
    image_path: 'gallery-instagram-juliette-gown.jpg',
    caption: 'Juliette Gown - Glitter tulle ballgown with basque waist',
    display_order: 5
  },
  {
    image_path: 'gallery-instagram-daphne-dress.jpg',
    caption: 'Daphne Dress - Every angle is perfect',
    display_order: 6
  },
  // Hero gallery images (10 images for the hero carousel)
  {
    image_path: 'hero-gallery-1.jpg',
    caption: 'Hero Gallery Image 1',
    display_order: 7
  },
  {
    image_path: 'hero-gallery-2.jpg',
    caption: 'Hero Gallery Image 2',
    display_order: 8
  },
  {
    image_path: 'hero-gallery-3.jpg',
    caption: 'Hero Gallery Image 3',
    display_order: 9
  },
  {
    image_path: 'hero-gallery-4.jpg',
    caption: 'Hero Gallery Image 4',
    display_order: 10
  },
  {
    image_path: 'hero-gallery-5.jpg',
    caption: 'Hero Gallery Image 5',
    display_order: 11
  },
  {
    image_path: 'hero-gallery-6.jpg',
    caption: 'Hero Gallery Image 6',
    display_order: 12
  },
  {
    image_path: 'hero-gallery-7.jpg',
    caption: 'Hero Gallery Image 7',
    display_order: 13
  },
  {
    image_path: 'hero-gallery-8.jpg',
    caption: 'Hero Gallery Image 8',
    display_order: 14
  },
  {
    image_path: 'hero-gallery-9.jpg',
    caption: 'Hero Gallery Image 9',
    display_order: 15
  },
  {
    image_path: 'hero-gallery-10.jpg',
    caption: 'Hero Gallery Image 10',
    display_order: 16
  }
];

function populateGallery() {
  // Clear existing gallery images
  db.exec('DELETE FROM gallery_images');
  console.log('Cleared existing gallery images');

  // Prepare statement
  const insertStmt = db.prepare(`
    INSERT INTO gallery_images (image_path, caption, display_order)
    VALUES (?, ?, ?)
  `);

  // Insert gallery images
  galleryImages.forEach(image => {
    insertStmt.run(image.image_path, image.caption, image.display_order);
    console.log(`Inserted gallery image: ${image.image_path}`);
  });

  console.log(`\n✅ Successfully populated ${galleryImages.length} gallery images!`);

  // Show summary
  const total = db.prepare('SELECT COUNT(*) as count FROM gallery_images').get() as { count: number };
  console.log(`\nDatabase summary:`);
  console.log(`- Total gallery images: ${total.count}`);
}

populateGallery();
