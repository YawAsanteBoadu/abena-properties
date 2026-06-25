export type Category = 'buy' | 'rent' | 'land' | 'project' | 'distress';
export type ListingStatus = 'draft' | 'published' | 'archived';
export type PropertyType = 'buy' | 'rent';

export interface ListingRow {
  id: string;
  title: string;
  location: string;
  city: string;
  category: Category;
  status: ListingStatus;
  price: number | null;
  original_price: number | null;
  type: PropertyType | null;
  bedrooms: number | null;
  baths: number | null;
  square_feet: number | null;
  levels: number | null;
  size: string | null;
  completion: number | null;
  expected_completion: string | null;
  description: string | null;
  is_hottest: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ListingImageRow {
  id: number;
  listing_id: string;
  filename: string;
  sort_order: number;
  is_primary: number;
  created_at: string;
}

export interface AdminRow {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
}

export interface ListingResponse {
  id: string;
  title: string;
  location: string;
  city: string;
  category: Category;
  status: ListingStatus;
  price?: number;
  originalPrice?: number;
  type?: PropertyType;
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
  gallery?: string[];
  images: ImageResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ImageResponse {
  id: number;
  filename: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface CreateListingBody {
  id?: string;
  title: string;
  location: string;
  city: string;
  category: Category;
  status?: ListingStatus;
  price?: number;
  originalPrice?: number;
  type?: PropertyType;
  bedrooms?: number;
  baths?: number;
  squareFeet?: number;
  levels?: number;
  size?: string;
  completion?: number;
  expectedCompletion?: string;
  description?: string;
  isHottest?: boolean;
}
