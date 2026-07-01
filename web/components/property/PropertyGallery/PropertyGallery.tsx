'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './PropertyGallery.module.css';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div className={styles.gallery}>
      <div className={styles.stage}>
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${title} — photo ${index + 1} of ${count}`}
          fill
          sizes="(max-width: 900px) 100vw, 900px"
          priority={index === 0}
          style={{ objectFit: 'cover' }}
        />

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => go(index - 1)}
          aria-label="Previous photo"
        >
          &#8249;
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => go(index + 1)}
          aria-label="Next photo"
        >
          &#8250;
        </button>

        <span className={styles.counter}>
          {index + 1} / {count}
        </span>
      </div>

      <div className={styles.thumbs}>
        {images.map((src, i) => (
          <button
            type="button"
            key={src + i}
            className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`View photo ${i + 1}`}
            aria-current={i === index}
          >
            <Image src={src} alt="" fill sizes="120px" style={{ objectFit: 'cover' }} />
          </button>
        ))}
      </div>
    </div>
  );
}
