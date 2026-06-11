export interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  type: 'buy' | 'rent';
  bedrooms: number;
  baths: number;
  squareFeet: number;
  levels: number;
  imageUrl: string;
  isHottest?: boolean;
  description?: string;
  gallery?: string[];
}

export const properties: Property[] = [
  {
    id: 'b1',
    title: 'Luxury Ocean View Villa',
    location: 'East Legon',
    city: 'Accra',
    price: 450000,
    type: 'buy',
    bedrooms: 5,
    baths: 4,
    squareFeet: 4200,
    levels: 2,
    imageUrl: '/images/properties/b681be923ce507717609721d962bf859.jpg',
    isHottest: true,
    description: 'Stunning modern villa with panoramic views and premium finishes throughout.',
  },
  {
    id: 'b2',
    title: 'Modern Executive Mansion',
    location: 'Airport Residential',
    city: 'Accra',
    price: 620000,
    type: 'buy',
    bedrooms: 6,
    baths: 5,
    squareFeet: 5800,
    levels: 3,
    imageUrl: '/images/properties/6519b25a5dbbe6387b0a7166bd777b9f.jpg',
    isHottest: true,
    description: 'Executive mansion in a prime location with world-class amenities.',
  },
  {
    id: 'b3',
    title: 'Contemporary Smart Home',
    location: 'Cantonments',
    city: 'Accra',
    price: 380000,
    type: 'buy',
    bedrooms: 4,
    baths: 3,
    squareFeet: 3500,
    levels: 2,
    imageUrl: '/images/properties/e5a5867d525a48840580fbda5f5ca5e2.jpg',
    isHottest: true,
    description: 'Smart home with cutting-edge technology and elegant contemporary design.',
  },
  {
    id: 'b4',
    title: 'Elegant Garden Estate',
    location: 'Trasacco Valley',
    city: 'Accra',
    price: 530000,
    type: 'buy',
    bedrooms: 5,
    baths: 4,
    squareFeet: 4800,
    levels: 2,
    imageUrl: '/images/properties/b4.jpg',
  },
  {
    id: 'b5',
    title: 'Premium Hilltop Residence',
    location: 'Labone',
    city: 'Accra',
    price: 490000,
    type: 'buy',
    bedrooms: 4,
    baths: 4,
    squareFeet: 4000,
    levels: 2,
    imageUrl: '/images/properties/a2a03dc0afecafc1a109b78fbc2e9d49.jpg',
  },
  {
    id: 'b6',
    title: 'Riverside Luxury Compound',
    location: 'Ridge',
    city: 'Accra',
    price: 750000,
    type: 'buy',
    bedrooms: 7,
    baths: 6,
    squareFeet: 6500,
    levels: 3,
    imageUrl: '/images/properties/98b5b1cc83f98f5f6fb86bd37e96b3d5.jpg',
  },
  {
    id: 'b7',
    title: 'Minimalist Townhouse',
    location: 'Osu',
    city: 'Accra',
    price: 280000,
    type: 'buy',
    bedrooms: 3,
    baths: 2,
    squareFeet: 2200,
    levels: 2,
    imageUrl: '/images/properties/d2cba2e57012191f80be7d71ed84a700.jpg',
  },
  {
    id: 'r1',
    title: 'Furnished Executive Apartment',
    location: 'Dzorwulu',
    city: 'Accra',
    price: 3500,
    type: 'rent',
    bedrooms: 3,
    baths: 2,
    squareFeet: 1800,
    levels: 1,
    imageUrl: '/images/properties/a6c6fe23e8125dac7ba053cd7b43ea59.jpg',
    isHottest: true,
    description: 'Fully furnished executive apartment with all modern conveniences.',
  },
  {
    id: 'r2',
    title: 'Penthouse Suite',
    location: 'Airport City',
    city: 'Accra',
    price: 5000,
    type: 'rent',
    bedrooms: 4,
    baths: 3,
    squareFeet: 2800,
    levels: 1,
    imageUrl: '/images/properties/812d27281c74ad90a1f5715cc9beccce.jpg',
    isHottest: true,
    description: 'Luxurious penthouse with city skyline views and premium finishes.',
  },
  {
    id: 'r3',
    title: 'Cozy Garden Flat',
    location: 'Roman Ridge',
    city: 'Accra',
    price: 2200,
    type: 'rent',
    bedrooms: 2,
    baths: 2,
    squareFeet: 1400,
    levels: 1,
    imageUrl: '/images/properties/360f36c6d50d95fccf4a99baa795d525.jpg',
    isHottest: true,
    description: 'Charming garden flat in a serene neighborhood with lush surroundings.',
  },
  {
    id: 'r4',
    title: 'Studio Loft Downtown',
    location: 'Oxford Street',
    city: 'Accra',
    price: 1500,
    type: 'rent',
    bedrooms: 1,
    baths: 1,
    squareFeet: 800,
    levels: 1,
    imageUrl: '/images/properties/r4_2.jpg',
  },
  {
    id: 'r5',
    title: 'Spacious Family Duplex',
    location: 'Spintex',
    city: 'Accra',
    price: 4000,
    type: 'rent',
    bedrooms: 4,
    baths: 3,
    squareFeet: 3200,
    levels: 2,
    imageUrl: '/images/properties/r5.jpg',
  },
  {
    id: 'r6',
    title: 'Serviced Corporate Suite',
    location: 'North Ridge',
    city: 'Accra',
    price: 4500,
    type: 'rent',
    bedrooms: 3,
    baths: 2,
    squareFeet: 2000,
    levels: 1,
    imageUrl: '/images/properties/r6.jpg',
  },
  {
    id: 'r7',
    title: 'Beachside Retreat',
    location: 'Tema',
    city: 'Greater Accra',
    price: 3000,
    type: 'rent',
    bedrooms: 3,
    baths: 2,
    squareFeet: 1600,
    levels: 1,
    imageUrl: '/images/properties/r7.jpg',
  },
];

export const testimonials = [
  {
    id: 't1',
    name: 'Kwame Asante',
    role: 'Homeowner',
    text: 'Abena Properties made our dream home a reality. Their professionalism and attention to detail exceeded all expectations. We could not be happier with our new home!',
    image: '/images/properties/real-estate-agent-sales-manager-holding-house-model-to-customer-after-signing-rental-lease-contract-of-sale-purchase-agreement-concerning-mortgage-loan-offer-for-and-house-insurance-free-photo.jpg',
  },
  {
    id: 't2',
    name: 'Ama Mensah',
    role: 'Tenant',
    text: 'Finding a rental property was seamless with Abena Properties. The team guided us every step of the way and found us the perfect apartment within our budget.',
    image: '/images/properties/real-estate-agent-sales-manager-holding-house-model-to-customer-after-signing-rental-lease-contract-of-sale-purchase-agreement-concerning-mortgage-loan-offer-for-and-house-insurance-free-photo.jpg',
  },
  {
    id: 't3',
    name: 'Yaw Boateng',
    role: 'Investor',
    text: 'As a property investor, I trust Abena Properties for their market knowledge and honest guidance. They have helped me build a portfolio of premium properties across Accra.',
    image: '/images/properties/real-estate-agent-sales-manager-holding-house-model-to-customer-after-signing-rental-lease-contract-of-sale-purchase-agreement-concerning-mortgage-loan-offer-for-and-house-insurance-free-photo.jpg',
  },
  {
    id: 't4',
    name: 'Efua Darko',
    role: 'First-time Buyer',
    text: 'I was nervous about buying my first home, but Abena Properties walked me through every step. Their patience and expertise made all the difference. Highly recommended!',
    image: '/images/properties/real-estate-agent-sales-manager-holding-house-model-to-customer-after-signing-rental-lease-contract-of-sale-purchase-agreement-concerning-mortgage-loan-offer-for-and-house-insurance-free-photo.jpg',
  },
];

/**
 * Server-side data accessors.
 *
 * In the App Router these run inside React Server Components, so the data is
 * fetched on the server and never ships to the client bundle. They replace the
 * legacy `getStaticProps` data-fetching approach used by the Pages Router.
 * Today the data is a local module; swapping these bodies for a database or
 * CMS call later requires no changes to the pages that consume them.
 */
export async function getProperties(): Promise<Property[]> {
  return properties;
}

export async function getPropertiesByType(type: Property['type']): Promise<Property[]> {
  return properties.filter((p) => p.type === type);
}

export async function getHottestProperties(type: Property['type']): Promise<Property[]> {
  return properties.filter((p) => p.type === type && p.isHottest);
}

export async function getTestimonials() {
  return testimonials;
}

/**
 * Fallback gallery image sets (one bedroom/photo set per array). Used to give
 * every property four extra interior photos for the detail-page slider when the
 * property doesn't define its own `gallery`.
 */
const GALLERY_SETS: string[][] = [
  [
    '/images/properties/bd01/0abaaa0b8170b899db5765d04b859422.jpg',
    '/images/properties/bd01/0e248e684c771e0b2de24b8303b26663.jpg',
    '/images/properties/bd01/1a53f4583c1444458c5ff8584e15bcb5.jpg',
    '/images/properties/bd01/1ae28cbb5dac600e6760188689876ac0.jpg',
  ],
  [
    '/images/properties/bd02/0f5c5f04e93063c3b002ab563db277d7.jpg',
    '/images/properties/bd02/2a4b66c89427dad9ced7aee4608534e3.jpg',
    '/images/properties/bd02/2c270afba34c954a09761aa109d84c74.jpg',
    '/images/properties/bd02/2dc2a490ceea65d6ac9e36adfc76d8c9.jpg',
  ],
  [
    '/images/properties/bd03/04ca9a63f17a107903f8663e8a200483.jpg',
    '/images/properties/bd03/05ca05144b33eb97ec15e228a03ac1c3.jpg',
    '/images/properties/bd03/2e6c31e5598f4d40f08d400cb1ba24a8.jpg',
    '/images/properties/bd03/2e97971c150a4ea7a24ec17147449494.jpg',
  ],
  [
    '/images/properties/bd04/1ed382abd3158e2accd2347d8b1ba4c6.jpg',
    '/images/properties/bd04/5a6a06adcd8f99bbaac8b387e910f091.jpg',
    '/images/properties/bd04/5e3a8358738b505da2a72f605b94e629.jpg',
    '/images/properties/bd04/6ed574644ef1580d397c2c82cd81363f.jpg',
  ],
  [
    '/images/properties/bd05/29de4d425ecea598675d3db24c7fe71c.jpg',
    '/images/properties/bd05/53a441688c8e10b4adb500b091f29d7a.jpg',
    '/images/properties/bd05/58ee2db301d5e53c199ad30ee5bc8a61.jpg',
    '/images/properties/bd05/71d1c859089056f3bec7ec41d5e7242e.jpg',
  ],
];

/** Fetch a single property by its id (server-side). */
export async function getPropertyById(id: string): Promise<Property | undefined> {
  return properties.find((p) => p.id === id);
}

/**
 * Build the ordered image list for a property's detail-page gallery: the card
 * image first, followed by four additional photos. Uses the property's own
 * `gallery` when present, otherwise a deterministic fallback set so the same
 * property always shows the same photos.
 */
export function getPropertyGallery(property: Property): string[] {
  if (property.gallery && property.gallery.length > 0) {
    return [property.imageUrl, ...property.gallery];
  }
  const hash = [...property.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const set = GALLERY_SETS[hash % GALLERY_SETS.length];
  return [property.imageUrl, ...set];
}
