'use client';

import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { uploadImagesAction, deleteImageAction, setPrimaryImageAction } from '@/lib/actions';
import type { ListingImage } from '@/lib/types';
import styles from './ImageUploader.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function fullUrl(path: string) {
  return path.startsWith('http') ? path : `${API_URL}${path}`;
}

interface ImageUploaderProps {
  listingId: string;
  images: ListingImage[];
}

export default function ImageUploader({ listingId, images }: ImageUploaderProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  function handleUpload() {
    const files = fileRef.current?.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('images', f));

    startTransition(async () => {
      try {
        await uploadImagesAction(listingId, formData);
        if (fileRef.current) fileRef.current.value = '';
        router.refresh();
      } finally {
        setUploading(false);
      }
    });
  }

  function handleDelete(imageId: number) {
    if (!confirm('Delete this image?')) return;
    startTransition(async () => {
      await deleteImageAction(imageId);
      router.refresh();
    });
  }

  function handleSetPrimary(imageId: number) {
    startTransition(async () => {
      await setPrimaryImageAction(imageId);
      router.refresh();
    });
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Images</h2>

      <div className={styles.uploadArea} onClick={() => fileRef.current?.click()}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleUpload}
        />
        <p className={styles.uploadText}>Click or drag images here to upload</p>
        <button type="button" className={styles.uploadBtn} disabled={uploading || isPending}>
          {uploading ? 'Uploading...' : 'Choose Files'}
        </button>
      </div>

      {images.length > 0 && (
        <div className={styles.grid}>
          {images.map((img) => (
            <div
              key={img.id}
              className={`${styles.imageCard} ${img.isPrimary ? styles.imageCardPrimary : ''}`}
            >
              {img.isPrimary && <span className={styles.primaryLabel}>Primary</span>}
              <Image
                src={fullUrl(img.url)}
                alt={img.filename}
                width={140}
                height={140}
                className={styles.img}
              />
              <div className={styles.imageActions}>
                {!img.isPrimary && (
                  <button className={styles.imgBtn} onClick={() => handleSetPrimary(img.id)}>
                    Primary
                  </button>
                )}
                <button className={styles.imgBtn} onClick={() => handleDelete(img.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
