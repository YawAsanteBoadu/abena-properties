import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { initDatabase, getDb, runQuery, runInsert, saveDatabase } from '../config/database';
import { env } from '../config/env';
import { copyAndProcessImage } from '../services/imageService';

const WEB_PUBLIC = path.join(__dirname, '../../../public/images');

interface SeedListing {
  id: string;
  title: string;
  location: string;
  city: string;
  category: string;
  price?: number;
  originalPrice?: number;
  type?: string;
  bedrooms?: number;
  baths?: number;
  squareFeet?: number;
  levels?: number;
  size?: string;
  completion?: number;
  expectedCompletion?: string;
  description?: string;
  isHottest?: boolean;
  imageUrl: string;
  galleryPaths?: string[];
}

const GALLERY_SETS: string[][] = [
  [
    'properties/bd01/0abaaa0b8170b899db5765d04b859422.jpg',
    'properties/bd01/0e248e684c771e0b2de24b8303b26663.jpg',
    'properties/bd01/1a53f4583c1444458c5ff8584e15bcb5.jpg',
    'properties/bd01/1ae28cbb5dac600e6760188689876ac0.jpg',
  ],
  [
    'properties/bd02/0f5c5f04e93063c3b002ab563db277d7.jpg',
    'properties/bd02/2a4b66c89427dad9ced7aee4608534e3.jpg',
    'properties/bd02/2c270afba34c954a09761aa109d84c74.jpg',
    'properties/bd02/2dc2a490ceea65d6ac9e36adfc76d8c9.jpg',
  ],
  [
    'properties/bd03/04ca9a63f17a107903f8663e8a200483.jpg',
    'properties/bd03/05ca05144b33eb97ec15e228a03ac1c3.jpg',
    'properties/bd03/2e6c31e5598f4d40f08d400cb1ba24a8.jpg',
    'properties/bd03/2e97971c150a4ea7a24ec17147449494.jpg',
  ],
  [
    'properties/bd04/1ed382abd3158e2accd2347d8b1ba4c6.jpg',
    'properties/bd04/5a6a06adcd8f99bbaac8b387e910f091.jpg',
    'properties/bd04/5e3a8358738b505da2a72f605b94e629.jpg',
    'properties/bd04/6ed574644ef1580d397c2c82cd81363f.jpg',
  ],
  [
    'properties/bd05/29de4d425ecea598675d3db24c7fe71c.jpg',
    'properties/bd05/53a441688c8e10b4adb500b091f29d7a.jpg',
    'properties/bd05/58ee2db301d5e53c199ad30ee5bc8a61.jpg',
    'properties/bd05/71d1c859089056f3bec7ec41d5e7242e.jpg',
  ],
];

function getGallerySet(id: string): string[] {
  const hash = [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return GALLERY_SETS[hash % GALLERY_SETS.length];
}

const seedListings: SeedListing[] = [
  { id: 'b1', title: 'Luxury Ocean View Villa', location: 'East Legon', city: 'Accra', category: 'buy', price: 450000, type: 'buy', bedrooms: 5, baths: 4, squareFeet: 4200, levels: 2, imageUrl: 'properties/b1.jpg', isHottest: true, description: 'Stunning modern villa with panoramic views and premium finishes throughout.' },
  { id: 'b2', title: 'Modern Executive Mansion', location: 'Airport Residential', city: 'Accra', category: 'buy', price: 620000, type: 'buy', bedrooms: 6, baths: 5, squareFeet: 5800, levels: 3, imageUrl: 'properties/b2.jpg', isHottest: true, description: 'Executive mansion in a prime location with world-class amenities.' },
  { id: 'b3', title: 'Contemporary Smart Home', location: 'Cantonments', city: 'Accra', category: 'buy', price: 380000, type: 'buy', bedrooms: 4, baths: 3, squareFeet: 3500, levels: 2, imageUrl: 'properties/b3.jpg', isHottest: true, description: 'Smart home with cutting-edge technology and elegant contemporary design.' },
  { id: 'b4', title: 'Elegant Garden Estate', location: 'Trasacco Valley', city: 'Accra', category: 'buy', price: 530000, type: 'buy', bedrooms: 5, baths: 4, squareFeet: 4800, levels: 2, imageUrl: 'properties/b4.jpg' },
  { id: 'b5', title: 'Premium Hilltop Residence', location: 'Labone', city: 'Accra', category: 'buy', price: 490000, type: 'buy', bedrooms: 4, baths: 4, squareFeet: 4000, levels: 2, imageUrl: 'properties/b5.jpg' },
  { id: 'b6', title: 'Riverside Luxury Compound', location: 'Ridge', city: 'Accra', category: 'buy', price: 750000, type: 'buy', bedrooms: 7, baths: 6, squareFeet: 6500, levels: 3, imageUrl: 'properties/b6.jpg' },
  { id: 'b7', title: 'Minimalist Townhouse', location: 'Osu', city: 'Accra', category: 'buy', price: 280000, type: 'buy', bedrooms: 3, baths: 2, squareFeet: 2200, levels: 2, imageUrl: 'properties/b7.jpg' },
  { id: 'r1', title: 'Furnished Executive Apartment', location: 'Dzorwulu', city: 'Accra', category: 'rent', price: 3500, type: 'rent', bedrooms: 3, baths: 2, squareFeet: 1800, levels: 1, imageUrl: 'properties/r1.jpg', isHottest: true, description: 'Fully furnished executive apartment with all modern conveniences.' },
  { id: 'r2', title: 'Penthouse Suite', location: 'Airport City', city: 'Accra', category: 'rent', price: 5000, type: 'rent', bedrooms: 4, baths: 3, squareFeet: 2800, levels: 1, imageUrl: 'properties/r2.jpg', isHottest: true, description: 'Luxurious penthouse with city skyline views and premium finishes.' },
  { id: 'r3', title: 'Cozy Garden Flat', location: 'Roman Ridge', city: 'Accra', category: 'rent', price: 2200, type: 'rent', bedrooms: 2, baths: 2, squareFeet: 1400, levels: 1, imageUrl: 'properties/r3.jpg', isHottest: true, description: 'Charming garden flat in a serene neighborhood with lush surroundings.' },
  { id: 'r4', title: 'Studio Loft Downtown', location: 'Oxford Street', city: 'Accra', category: 'rent', price: 1500, type: 'rent', bedrooms: 1, baths: 1, squareFeet: 800, levels: 1, imageUrl: 'properties/r4_2.jpg' },
  { id: 'r5', title: 'Spacious Family Duplex', location: 'Spintex', city: 'Accra', category: 'rent', price: 4000, type: 'rent', bedrooms: 4, baths: 3, squareFeet: 3200, levels: 2, imageUrl: 'properties/r5.jpg' },
  { id: 'r6', title: 'Serviced Corporate Suite', location: 'North Ridge', city: 'Accra', category: 'rent', price: 4500, type: 'rent', bedrooms: 3, baths: 2, squareFeet: 2000, levels: 1, imageUrl: 'properties/r6.jpg' },
  { id: 'r7', title: 'Beachside Retreat', location: 'Tema', city: 'Greater Accra', category: 'rent', price: 3000, type: 'rent', bedrooms: 3, baths: 2, squareFeet: 1600, levels: 1, imageUrl: 'properties/r7.jpg' },
  { id: 'd1', title: 'Quick-Sale Family Home', location: 'Adenta', city: 'Accra', category: 'distress', price: 210000, originalPrice: 310000, type: 'buy', bedrooms: 4, baths: 3, squareFeet: 2600, levels: 2, imageUrl: 'new_img/1353917ea504fc3191b4e39bad5a8d14.jpg', description: 'Motivated seller. Priced well below market value for a fast, hassle-free sale.' },
  { id: 'd2', title: 'Bank Repossession Villa', location: 'East Legon Hills', city: 'Accra', category: 'distress', price: 295000, originalPrice: 420000, type: 'buy', bedrooms: 5, baths: 4, squareFeet: 3800, levels: 2, imageUrl: 'new_img/1358fcd9638648b772b5c7181fd71e85.jpg', description: 'Repossessed villa available at a substantial discount. Sold as-is, viewing recommended.' },
  { id: 'd3', title: 'Relocation Distress Apartment', location: 'Tesano', city: 'Accra', category: 'distress', price: 145000, originalPrice: 205000, type: 'buy', bedrooms: 3, baths: 2, squareFeet: 1700, levels: 1, imageUrl: 'new_img/155c0d34208f4d03e508910d6a8107a5.jpg', description: 'Owner relocating abroad and must sell quickly. Excellent value for buyers ready to move.' },
  { id: 'l1', title: 'Prime Residential Plot', location: 'East Legon Hills', city: 'Accra', category: 'land', price: 95000, size: '1 plot · 700 sqm', imageUrl: 'new_img/017898f2897ae46d943ce894bc963188.jpg', description: 'Serviced, titled land ready for development in a fast-growing residential enclave.' },
  { id: 'l2', title: 'Gated Community Land', location: 'Oyarifa', city: 'Accra', category: 'land', price: 120000, size: '2 plots · 1,400 sqm', imageUrl: 'new_img/061940e5ed56a0cbd6369d9fa06f583d.jpg', description: 'Two adjoining plots inside a secured, gated estate with paved access roads.' },
  { id: 'l3', title: 'Commercial Roadside Parcel', location: 'Spintex Road', city: 'Accra', category: 'land', price: 260000, size: '3 plots · 2,100 sqm', imageUrl: 'new_img/094785943cabd72aab612e0c607ee81f.jpg', description: 'High-visibility commercial frontage ideal for retail or mixed-use development.' },
  { id: 'l4', title: 'Hilltop View Land', location: 'Aburi', city: 'Eastern Region', category: 'land', price: 78000, size: '1 plot · 800 sqm', imageUrl: 'new_img/1112c5b7d0d9906faac57c14eee4546f.jpg', description: 'Elevated parcel with panoramic mountain views, perfect for a private retreat.' },
  { id: 'p1', title: 'The Cantonments Residences', location: 'Cantonments', city: 'Accra', category: 'project', completion: 60, expectedCompletion: 'Q4 2026', imageUrl: 'new_img/156b131d2bcb1166a6495b0a10d2dcae.jpg', description: 'A boutique block of 12 luxury apartments. Structure complete; interior fit-out underway.' },
  { id: 'p2', title: 'Ridge Towers Phase II', location: 'Ridge', city: 'Accra', category: 'project', completion: 35, expectedCompletion: 'Q2 2027', imageUrl: 'new_img/158fce30b06d86e5ce6ab667dfdd0c1b.jpg', description: 'Mixed-use high-rise with offices and serviced apartments. Superstructure in progress.' },
  { id: 'p3', title: 'Tema Community Estate', location: 'Tema', city: 'Greater Accra', category: 'project', completion: 85, expectedCompletion: 'Q3 2026', imageUrl: 'new_img/211bf9ac16406f3eb077b142b5cefa3a.jpg', description: 'Forty family townhouses nearing completion. Landscaping and snagging in final stages.' },
  { id: 'p4', title: 'Airport City Office Park', location: 'Airport City', city: 'Accra', category: 'project', completion: 15, expectedCompletion: 'Q1 2028', imageUrl: 'new_img/23293b764d7ab9ba4b74e2cd7c46af1d.jpg', description: 'Grade-A commercial campus. Foundation and groundworks recently commenced.' },
];

async function seed() {
  await initDatabase();
  process.stderr.write('[seed] Starting database seed...\n');

  const db = getDb();

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);

  db.exec('DELETE FROM listing_images');
  db.exec('DELETE FROM listings');
  db.exec('DELETE FROM admins');

  const hash = bcrypt.hashSync(env.defaultAdminPassword, 10);
  runQuery('INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)', [
    env.defaultAdminEmail, hash, 'Admin',
  ]);
  process.stderr.write(`[seed] Admin created: ${env.defaultAdminEmail}\n`);

  for (let i = 0; i < seedListings.length; i++) {
    const l = seedListings[i];

    runQuery(
      `INSERT INTO listings (id, title, location, city, category, status, price, original_price, type, bedrooms, baths, square_feet, levels, size, completion, expected_completion, description, is_hottest, sort_order)
       VALUES (?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        l.id, l.title, l.location, l.city, l.category,
        l.price ?? null, l.originalPrice ?? null, l.type ?? null,
        l.bedrooms ?? null, l.baths ?? null, l.squareFeet ?? null, l.levels ?? null,
        l.size ?? null, l.completion ?? null, l.expectedCompletion ?? null,
        l.description ?? null, l.isHottest ? 1 : 0, i,
      ]
    );

    const primaryPath = path.join(WEB_PUBLIC, l.imageUrl);
    if (fs.existsSync(primaryPath)) {
      const filename = await copyAndProcessImage(primaryPath, l.id);
      runQuery(
        'INSERT INTO listing_images (listing_id, filename, sort_order, is_primary) VALUES (?, ?, ?, ?)',
        [l.id, filename, 0, 1]
      );
      process.stderr.write(`[seed] ${l.id}: primary image processed\n`);
    } else {
      process.stderr.write(`[seed] ${l.id}: WARNING - primary image not found at ${primaryPath}\n`);
    }

    if (['buy', 'rent', 'distress'].includes(l.category)) {
      const galleryPaths = getGallerySet(l.id);
      for (let g = 0; g < galleryPaths.length; g++) {
        const galleryPath = path.join(WEB_PUBLIC, galleryPaths[g]);
        if (fs.existsSync(galleryPath)) {
          const filename = await copyAndProcessImage(galleryPath, l.id);
          runQuery(
            'INSERT INTO listing_images (listing_id, filename, sort_order, is_primary) VALUES (?, ?, ?, ?)',
            [l.id, filename, g + 1, 0]
          );
        }
      }
      process.stderr.write(`[seed] ${l.id}: gallery images processed\n`);
    }
  }

  saveDatabase();
  process.stderr.write(`[seed] Seeded ${seedListings.length} listings.\n`);
  process.stderr.write('[seed] Done.\n');
  process.exit(0);
}

seed().catch((err) => {
  process.stderr.write(`[seed] Error: ${err.message}\n`);
  process.exit(1);
});
