'use client';

import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { uploadImagesAction, deleteImageAction, setPrimaryImageAction } from '@/lib/actions';
import { useToast } from '@/components/Toast/ToastContext';
import { mediaUrl } from '@/lib/media';
import type { ListingImage } from '@/lib/types';
import styles from './ImageUploader.module.css';

const MAX_TOTAL_UPLOAD_BYTES = 25 * 1024 * 1024;

interface ImageUploaderProps {
  listingId: string;
  images: ListingImage[];
}

export default function ImageUploader({ listingId, images }: ImageUploaderProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  function handleUpload() {
    const files = fileRef.current?.files;
    if (!files || files.length === 0) return;

    const totalBytes = Array.from(files).reduce((sum, f) => sum + f.size, 0);
    if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
      const totalMb = (totalBytes / 1024 / 1024).toFixed(1);
      const message = `Total upload size ${totalMb} MB exceeds the 25 MB limit. Please select fewer or smaller files.`;
      setUploadError(message);
      showError(message);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setUploading(true);
    setUploadError('');
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('images', f));

    startTransition(async () => {
      try {
        const result = await uploadImagesAction(listingId, formData);
        if (!result.ok) {
          setUploadError(result.error);
          showError(result.error);
        } else {
          showSuccess(`${files.length} image${files.length > 1 ? 's' : ''} uploaded.`);
          if (fileRef.current) fileRef.current.value = '';
          router.refresh();
        }
      } catch {
        setUploadError('Upload failed unexpectedly.');
        showError('Upload failed unexpectedly.');
      } finally {
        setUploading(false);
      }
    });
}

  function handleDelete(imageId: number) {
    if (!confirm('Delete this image?')) return;
    startTransition(async () => {
      const result = await deleteImageAction(imageId);
      if (!result.ok) {
        showError(result.error);
      } else {
        showSuccess('Image deleted.');
        router.refresh();
      }
    });
  }

  function handleSetPrimary(imageId: number) {
    startTransition(async () => {
      const result = await setPrimaryImageAction(imageId);
      if (!result.ok) {
        showError(result.error);
      } else {
        showSuccess('Primary image updated.');
        router.refresh();
      }
    });
  }

  const busy = uploading || isPending;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Images</h2>

      <div className={styles.uploadArea} onClick={() => !busy && fileRef.current?.click()}>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          hidden
          onChange={handleUpload}
          disabled={busy}
        />
        <p className={styles.uploadText}>
          {busy ? 'Uploading...' : 'Click or drag images here to upload'}
        </p>
        <button type="button" className={styles.uploadBtn} disabled={busy}>
          {busy ? 'Uploading...' : 'Choose Files'}
        </button>
      </div>

      {uploadError && (
        <div className={styles.uploadError}>{uploadError}</div>
      )}

      {images.length > 0 && (
        <div className={styles.grid}>
          {images.map((img) => (
            <div
              key={img.id}
              className={`${styles.imageCard} ${img.isPrimary ? styles.imageCardPrimary : ''}`}
            >
              {img.isPrimary && <span className={styles.primaryLabel}>Primary</span>}
              <Image
                src={mediaUrl(img.url)}
                alt={img.filename}
                width={140}
                height={140}
                className={styles.img}
              />
              <div className={styles.imageActions}>
                {!img.isPrimary && (
                  <button className={styles.imgBtn} onClick={() => handleSetPrimary(img.id)} disabled={busy}>
                    Primary
                  </button>
                )}
                <button className={styles.imgBtn} onClick={() => handleDelete(img.id)} disabled={busy}>
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