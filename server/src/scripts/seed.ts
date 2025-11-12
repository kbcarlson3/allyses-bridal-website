import { db } from '../database/init.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Seeding database with sample data...\n');

// Sample dresses
const sampleDresses = [
  {
    name: 'Juliette',
    price: 1299,
    description: 'A stunning A-line gown featuring delicate lace appliqués on the bodice and a flowing tulle skirt. The flutter sleeves add a romantic touch, while the modest neckline ensures elegant coverage. Perfect for the bride seeking timeless beauty.',
    features: ['Lace appliqué bodice', 'Flutter sleeves', 'Tulle A-line skirt', 'Modest neckline', 'Chapel train', 'Satin buttons down back']
  },
  {
    name: 'Maren',
    price: 1199,
    description: 'Classic ballgown with a beaded illusion neckline and three-quarter sleeves. The full tulle skirt creates a fairytale silhouette, while the intricate beading adds sparkle and sophistication.',
    features: ['Beaded illusion neckline', 'Three-quarter sleeves', 'Full tulle ballgown skirt', 'Hidden pockets', 'Cathedral train', 'Lace up back']
  },
  {
    name: 'Chloe',
    price: 1349,
    description: 'Sophisticated sheath gown with long lace sleeves and a fitted silhouette. The illusion lace back creates a stunning statement, while the modest front maintains elegance. Ideal for the modern bride.',
    features: ['Long lace sleeves', 'Fitted sheath silhouette', 'Illusion lace back', 'Covered buttons', 'Court train', 'Stretch lining for comfort']
  },
  {
    name: 'Madalin',
    price: 1149,
    description: 'Romantic tulle tiered gown with a delicate lace top. The soft layers create beautiful movement, while the flutter sleeves add a dreamy quality. Perfect for outdoor and garden weddings.',
    features: ['Tiered tulle skirt', 'Delicate lace bodice', 'Flutter sleeves', 'Modest scoop neckline', 'Sweep train', 'Satin ribbon waist']
  },
  {
    name: 'Eliza',
    price: 899,
    description: 'Elegant A-line dress with a satin bodice and soft tulle skirt. The cap sleeves provide subtle coverage, while the beaded belt adds a touch of glamour. An excellent value for budget-conscious brides.',
    features: ['Satin bodice', 'Soft tulle skirt', 'Cap sleeves', 'Beaded belt', 'Chapel train', 'Back zipper']
  },
  {
    name: 'Shelby',
    price: 1249,
    description: 'Graceful ballgown with a lace overlay and long illusion sleeves. The intricate floral lace pattern creates texture and interest, while the full skirt ensures a dramatic entrance.',
    features: ['Floral lace overlay', 'Long illusion sleeves', 'Full tulle ballgown', 'Modest neckline', 'Hidden pockets', 'Covered buttons']
  },
  {
    name: 'Rose',
    price: 1099,
    description: 'Charming fit-and-flare gown with delicate lace details and elbow-length sleeves. The fitted bodice flatters the figure, while the flared skirt provides movement and comfort.',
    features: ['Fit-and-flare silhouette', 'Elbow-length lace sleeves', 'Illusion neckline', 'Flared tulle skirt', 'Court train', 'Lace up back']
  },
  {
    name: 'Hazel',
    price: 1399,
    description: 'Luxurious A-line gown with an embroidered lace bodice and three-quarter sleeves. The cathedral train makes a grand statement, while the modest design ensures comfort and confidence throughout your special day.',
    features: ['Embroidered lace bodice', 'Three-quarter sleeves', 'A-line tulle skirt', 'Modest scoop neckline', 'Cathedral train', 'Satin buttons', 'Sparkle tulle underlay']
  },
  {
    name: 'Scarlett',
    price: 1275,
    description: 'Breathtaking ballgown with a beaded bodice and cap sleeves. The layers of soft tulle create volume and romance, while the beading catches the light beautifully.',
    features: ['Beaded bodice', 'Cap sleeves', 'Layered tulle ballgown', 'Hidden pockets', 'Chapel train', 'Back zipper with buttons']
  },
  {
    name: 'Adelaide',
    price: 1175,
    description: 'Modern sheath dress with long lace sleeves and a geometric lace pattern. The clean lines and contemporary design appeal to fashion-forward brides seeking modest sophistication.',
    features: ['Geometric lace pattern', 'Long sleeves', 'Sheath silhouette', 'Illusion back', 'Court train', 'Covered buttons']
  },
  {
    name: 'Violet',
    price: 1325,
    description: 'Romantic A-line gown with flutter sleeves and a floral lace bodice. The soft tulle skirt flows beautifully, while the delicate details create an ethereal, garden-inspired look.',
    features: ['Floral lace bodice', 'Flutter sleeves', 'Soft tulle A-line skirt', 'V-neckline with modesty panel', 'Chapel train', 'Satin ribbon belt']
  },
  {
    name: 'Pearl',
    price: 1229,
    description: 'Elegant ballgown with a satin bodice and three-quarter lace sleeves. The combination of structured satin and delicate lace creates beautiful contrast, while the full skirt ensures a princess moment.',
    features: ['Satin bodice', 'Three-quarter lace sleeves', 'Full tulle ballgown', 'Boat neckline', 'Hidden pockets', 'Cathedral train', 'Lace up back']
  }
];

// Insert dresses
sampleDresses.forEach((dress, index) => {
  const existing = db.prepare('SELECT * FROM dresses WHERE name = ?').get(dress.name);

  if (!existing) {
    db.prepare(`
      INSERT INTO dresses (name, price, description, features, is_new_arrival, is_published, display_order)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `).run(
      dress.name,
      dress.price,
      dress.description,
      JSON.stringify(dress.features),
      index < 3 ? 1 : 0, // First 3 are "new arrivals"
      index
    );
    console.log(`✓ Added dress: ${dress.name}`);
  } else {
    console.log(`- Dress already exists: ${dress.name}`);
  }
});

console.log('\n✅ Database seeded successfully!\n');
console.log('Note: Sample dresses have been added without images.');
console.log('Use the admin panel to upload dress images after starting the server.\n');
