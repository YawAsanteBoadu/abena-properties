const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
  category: 'buy' | 'rent' | 'distress';
  originalPrice?: number;
  loading?: 'lazy' | 'eager';
}

export interface LandListing {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  size: string;
  imageUrl: string;
  category: 'land';
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  city: string;
  completion: number;
  expectedCompletion: string;
  imageUrl: string;
  category: 'project';
  description?: string;
}

function toFullUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}

function mapProperty(item: Record<string, unknown>): Property {
  return {
    id: item.id as string,
    title: item.title as string,
    location: item.location as string,
    city: item.city as string,
    price: item.price as number,
    type: (item.type as 'buy' | 'rent') || 'buy',
    bedrooms: (item.bedrooms as number) || 0,
    baths: (item.baths as number) || 0,
    squareFeet: (item.squareFeet as number) || 0,
    levels: (item.levels as number) || 1,
    imageUrl: toFullUrl(item.imageUrl as string),
    isHottest: item.isHottest as boolean | undefined,
    description: item.description as string | undefined,
    gallery: (item.gallery as string[] | undefined)?.map(toFullUrl),
    category: item.category as 'buy' | 'rent' | 'distress',
    originalPrice: item.originalPrice as number | undefined,
  };
}

function mapLand(item: Record<string, unknown>): LandListing {
  return {
    id: item.id as string,
    title: item.title as string,
    location: item.location as string,
    city: item.city as string,
    price: item.price as number,
    size: item.size as string,
    imageUrl: toFullUrl(item.imageUrl as string),
    category: 'land',
    description: item.description as string | undefined,
  };
}

function mapProject(item: Record<string, unknown>): Project {
  return {
    id: item.id as string,
    title: item.title as string,
    location: item.location as string,
    city: item.city as string,
    completion: item.completion as number,
    expectedCompletion: item.expectedCompletion as string,
    imageUrl: toFullUrl(item.imageUrl as string),
    category: 'project',
    description: item.description as string | undefined,
  };
}

async function fetchApi<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch {
    return [] as unknown as T;
  }
}

export async function getProperties(): Promise<Property[]> {
  const data = await fetchApi<Record<string, unknown>[]>('/api/listings');
  return data.filter((d) => ['buy', 'rent', 'distress'].includes(d.category as string)).map(mapProperty);
}

export async function getPropertiesByType(type: Property['type']): Promise<Property[]> {
  const data = await fetchApi<Record<string, unknown>[]>(`/api/listings?category=${type}`);
  return data.map(mapProperty);
}

export async function getHottestProperties(type: Property['type']): Promise<Property[]> {
  const data = await fetchApi<Record<string, unknown>[]>(`/api/listings?category=${type}&hottest=true`);
  return data.map(mapProperty);
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  try {
    const data = await fetchApi<Record<string, unknown>>(`/api/listings/${id}`);
    if (!data || !data.id) return undefined;
    return mapProperty(data);
  } catch {
    return undefined;
  }
}

export function getPropertyGallery(property: Property): string[] {
  if (property.gallery && property.gallery.length > 0) {
    return [property.imageUrl, ...property.gallery];
  }
  return [property.imageUrl];
}

export async function getDistressSales(): Promise<Property[]> {
  const data = await fetchApi<Record<string, unknown>[]>('/api/listings?category=distress');
  return data.map(mapProperty);
}

export async function getLands(): Promise<LandListing[]> {
  const data = await fetchApi<Record<string, unknown>[]>('/api/listings?category=land');
  return data.map(mapLand);
}

export async function getProjects(): Promise<Project[]> {
  const data = await fetchApi<Record<string, unknown>[]>('/api/listings?category=project');
  return data.map(mapProject);
}

export async function getAllListingIds(): Promise<string[]> {
  try {
    const data = await fetchApi<Record<string, unknown>[]>('/api/listings');
    return data.map((d) => d.id as string);
  } catch {
    return [];
  }
}

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

export async function getTestimonials() {
  return testimonials;
}
