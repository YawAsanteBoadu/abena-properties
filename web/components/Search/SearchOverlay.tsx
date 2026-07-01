'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useSearch, type SearchListing } from './SearchProvider';
import SearchResult from './SearchResult';
import styles from './Search.module.css';

const MAX_RESULTS = 8;

function matchScore(listing: SearchListing, query: string): number {
  const q = query.toLowerCase();
  if (listing.title.toLowerCase().includes(q)) return 3;
  if (listing.location.toLowerCase().includes(q)) return 2;
  if (listing.city.toLowerCase().includes(q)) return 2;
  if (listing.category.toLowerCase().includes(q)) return 1;
  if (listing.type?.toLowerCase().includes(q)) return 1;
  if (listing.description?.toLowerCase().includes(q)) return 1;
  return 0;
}

export default function SearchOverlay() {
  const { isOpen, close, listings, loading, error, retry } = useSearch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 100);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const scored = listings
      .map((l) => ({ listing: l, score: matchScore(l, debouncedQuery.trim()) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, MAX_RESULTS).map((s) => s.listing);
  }, [listings, debouncedQuery]);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = '';
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navigate = useCallback(
    (id: string) => {
      close();
      setQuery('');
      router.push(`/properties/${id}`);
    },
    [close, router],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        setQuery('');
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        navigate(results[selectedIndex].id);
      }
    },
    [results, selectedIndex, close, navigate],
  );

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Search properties">
      <div className={styles.backdrop} onClick={() => { close(); setQuery(''); }} aria-hidden="true" />
      <div className={styles.dialog} onKeyDown={handleKeyDown}>
        <div className={styles.inputRow}>
          <svg
            className={styles.inputIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="20"
            height="20"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search properties…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={results[selectedIndex] ? `search-result-${selectedIndex}` : undefined}
          />
          <button
            className={styles.closeBtn}
            onClick={() => { close(); setQuery(''); }}
            aria-label="Close search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {loading && (
            <div className={styles.status}>
              <div className={styles.spinner} />
              <span>Loading listings…</span>
            </div>
          )}

          {error && (
            <div className={styles.status}>
              <p>{error}</p>
              <button className={styles.retryBtn} onClick={retry}>Retry</button>
            </div>
          )}

          {!loading && !error && debouncedQuery.trim() && results.length === 0 && (
            <div className={styles.status}>
              <p>No properties found</p>
              <p className={styles.statusHint}>Try different keywords like a location, city, or property type</p>
            </div>
          )}

          {!loading && !error && !debouncedQuery.trim() && (
            <div className={styles.status}>
              <p className={styles.statusHint}>Type to search across all properties</p>
            </div>
          )}

          {results.length > 0 && (
            <ul id="search-results" role="listbox" className={styles.resultList}>
              {results.map((listing, i) => (
                <SearchResult
                  key={listing.id}
                  id={`search-result-${i}`}
                  listing={listing}
                  isSelected={i === selectedIndex}
                  onClick={() => navigate(listing.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
