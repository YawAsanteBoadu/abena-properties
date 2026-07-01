'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteListingAction, toggleStatusAction } from '@/lib/actions';
import { useToast } from '@/components/Toast/ToastContext';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import type { Listing } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import styles from './ListingTable.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function fullUrl(path: string) {
  return path.startsWith('http') ? path : `${API_URL}${path}`;
}

export default function ListingTable({ listings }: { listings: Listing[] }) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

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