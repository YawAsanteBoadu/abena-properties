'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteListingAction, toggleStatusAction } from '@/lib/actions';
import type { Listing } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import styles from './ListingTable.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function fullUrl(path: string) {
  return path.startsWith('http') ? path : `${API_URL}${path}`;
}

export default function ListingTable({ listings }: { listings: Listing[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm('Delete this listing permanently?')) return;
    await deleteListingAction(id);
    router.refresh();
  }

  async function handleToggle(id: string, current: string) {
    const next = current === 'published' ? 'draft' : 'published';
    await toggleStatusAction(id, next);
    router.refresh();
  }

  return (
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
          {listings.map((l) => (
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
                  >
                    {l.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(l.id)}
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
  );
}
