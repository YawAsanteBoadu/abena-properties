'use client';

import { useState, useTransition, useMemo, useDeferredValue, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteListingAction, toggleStatusAction } from '@/lib/actions';
import { useToast } from '@/components/Toast/ToastContext';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import type { Listing, Category } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import styles from './ListingTable.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function fullUrl(path: string) {
  return path.startsWith('http') ? path : `${API_URL}${path}`;
}

type CategoryFilter = Category | 'all';

// Labels mirror the dashboard's category cards (see app/(authenticated)/page.tsx)
// so the two pages share one category vocabulary.
const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'buy', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'land', label: 'Land' },
  { value: 'project', label: 'Projects' },
  { value: 'distress', label: 'Distress' },
];

export default function ListingTable({ listings }: { listings: Listing[] }) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

  // Client-side search over the already-fetched listings array. No network call.
  // useDeferredValue keeps typing responsive; the filter itself is cheap for the
  // current ~25 rows and scales comfortably to a few hundred rows before a
  // server-side search would be worth introducing.
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const deferredQuery = useDeferredValue(query);
  const searchRef = useRef<HTMLInputElement>(null);

  // Search and category are independent filter state composed with AND logic in
  // one pass, so switching either only re-derives the list once.
  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return listings.filter((l) => {
      if (category !== 'all' && l.category !== category) return false;
      if (!q) return true;
      return [l.id, l.title, l.location, l.city, l.category, l.status]
        .some((field) => field?.toLowerCase().includes(q));
    });
  }, [listings, deferredQuery, category]);

  // Per-category totals for the pill counts — like the dashboard cards, these
  // reflect the whole listings array and are independent of the search text.
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: listings.length };
    for (const l of listings) counts[l.category] = (counts[l.category] ?? 0) + 1;
    return counts;
  }, [listings]);

  const activeCategoryLabel =
    CATEGORY_FILTERS.find((c) => c.value === category)?.label ?? '';

  function clearSearch() {
    setQuery('');
    searchRef.current?.focus();
  }

  // Escape hatch from the empty state: reset both filters when a category is
  // active (clearing search alone wouldn't restore results); otherwise it's a
  // plain search reset.
  function clearAllFilters() {
    setQuery('');
    setCategory('all');
    searchRef.current?.focus();
  }

  function requestDelete(id: string, title: string) {
    setPendingDelete({ id, title });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const { id, title } = pendingDelete;
    startTransition(async () => {
      const result = await deleteListingAction(id);
      if (!result.ok) {
        showError(result.error); // keep the dialog open so they can retry or cancel
      } else {
        showSuccess(`"${title}" deleted.`);
        setPendingDelete(null);
        router.refresh();
      }
    });
  }

  function handleToggle(id: string, current: string) {
    const next = current === 'published' ? 'draft' : 'published';
    startTransition(async () => {
      const result = await toggleStatusAction(id, next);
      if (!result.ok) {
        showError(result.error);
      } else {
        showSuccess(`Status changed to ${next}.`);
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div className={styles.pills} role="group" aria-label="Filter by category">
        {CATEGORY_FILTERS.map((c) => (
          <button
            key={c.value}
            type="button"
            className={`${styles.pill} ${category === c.value ? styles.pillActive : ''}`}
            aria-pressed={category === c.value}
            onClick={() => setCategory(c.value)}
          >
            {c.label}
            <span className={styles.pillCount}>{categoryCounts[c.value] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <label htmlFor="listing-search" className={styles.visuallyHidden}>
            Search listings
          </label>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="listing-search"
            ref={searchRef}
            type="text"
            className={styles.searchInput}
            placeholder="Search by title, location, category, ID…"
            aria-label="Search listings"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setQuery('');
            }}
          />
          {query && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <p className={styles.resultCount} aria-live="polite">
          {filtered.length} of {listings.length} listings
        </p>
      </div>

      {filtered.length === 0 && listings.length > 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            {query ? <>No listings match &ldquo;{query}&rdquo;</> : 'No listings'}
            {category !== 'all' && ` in ${activeCategoryLabel}`}
          </p>
          <button
            type="button"
            className={styles.emptyClearBtn}
            onClick={category !== 'all' ? clearAllFilters : clearSearch}
          >
            {category !== 'all' ? 'Clear filters' : 'Clear search'}
          </button>
        </div>
      ) : (
      <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((l) => (
            <tr key={l.id}>
              <td>
                {l.imageUrl && (
                  <Image
                    src={fullUrl(l.imageUrl)}
                    alt={l.title}
                    width={48}
                    height={48}
                    className={styles.thumb}
                  />
                )}
              </td>
              <td>
                <div className={styles.titleCell}>{l.title}</div>
                <div className={styles.locationCell}>{l.location}, {l.city}</div>
              </td>
              <td><span className={styles.category}>{l.category}</span></td>
              <td><StatusBadge status={l.status} /></td>
              <td>{l.price ? `$${l.price.toLocaleString()}` : '—'}</td>
              <td>
                <div className={styles.actions}>
                  <Link href={`/listings/${l.id}/edit`} className={styles.editBtn}>
                    Edit
                  </Link>
                  <button
                    className={styles.statusBtn}
                    onClick={() => handleToggle(l.id, l.status)}
                    disabled={isPending}
                  >
                    {l.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => requestDelete(l.id, l.title)}
                    disabled={isPending}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        variant="danger"
        title="Delete listing"
        message={
          pendingDelete ? (
            <>
              Delete <strong>{pendingDelete.title}</strong> permanently? This also
              removes its images and can&apos;t be undone.
            </>
          ) : null
        }
        confirmLabel="Delete listing"
        cancelLabel="Cancel"
        loading={isPending}
        onConfirm={confirmDelete}
        onCancel={() => { if (!isPending) setPendingDelete(null); }}
      />
    </div>
  );
}