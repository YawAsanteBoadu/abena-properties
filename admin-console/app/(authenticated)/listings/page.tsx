import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { Listing } from '@/lib/types';
import ListingTable from '@/components/ListingTable/ListingTable';
import styles from './page.module.css';

export default async function ListingsPage() {
  const listings = await apiFetch<Listing[]>('/api/admin/listings');

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Listings</h1>
        <Link href="/listings/new" className={styles.addBtn}>
          + New Listing
        </Link>
      </div>
      <ListingTable listings={listings} />
    </div>
  );
}
