export type Category = 'buy' | 'rent' | 'land' | 'project' | 'distress';
export type ListingStatus = 'draft' | 'published' | 'archived';

export interface Listing {
  id: string;
  title: string;
  location: string;
  city: string;
  category: Category;
  status: ListingStatus;
  price?: number;
  originalPrice?: number;
  type?: 'buy' | 'rent';
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
  images: ListingImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ListingImage {
  id: number;
  filename: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface CreateListingData {
  title: string;
  location: string;
  city: string;
  category: Category;
  status?: ListingStatus;
  price?: number;
  originalPrice?: number;
  type?: 'buy' | 'rent';
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
