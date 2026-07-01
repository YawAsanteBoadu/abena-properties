'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface SearchListing {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  category: string;
  type?: string;
  description?: string;
  imageUrl?: string;
}

interface SearchContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  listings: SearchListing[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

let cachedListings: SearchListing[] | null = null;

function toFullUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [listings, setListings] = useState<SearchListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const fetchListings = useCallback(async () => {
    if (cachedListings) {
      setListings(cachedListings);
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/listings`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${res.status}`);
      const data: Record<string, unknown>[] = await res.json();
      const mapped: SearchListing[] = data.map((d) => ({
        id: d.id as string,
        title: d.title as string,
        location: d.location as string,
        city: d.city as string,
        price: d.price as number,
        category: d.category as string,
        type: d.type as string | undefined,
        description: d.description as string | undefined,
        imageUrl: toFullUrl(d.imageUrl as string),
      }));
      cachedListings = mapped;
      setListings(mapped);
    } catch {
      setError("Couldn't load listings — please try again");
      fetchedRef.current = false;
    } finally {
      setLoading(false);
    }
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    fetchListings();
  }, [fetchListings]);

  const close = useCallback(() => setIsOpen(false), []);

  const retry = useCallback(() => {
    fetchedRef.current = false;
    cachedListings = null;
    fetchListings();
  }, [fetchListings]);

  return (
    <SearchContext value={{ isOpen, open, close, listings, loading, error, retry }}>
      {children}
    </SearchContext>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
