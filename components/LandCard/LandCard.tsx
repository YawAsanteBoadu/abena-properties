import Image from 'next/image';
import styles from './LandCard.module.css';
import { LandListing } from '@/data/properties';

export default function LandCard({ land }: { land: LandListing }) {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.mediaContainer}>
        <Image
          src={land.imageUrl}
          alt={land.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
        <span className={styles.tag}>LAND</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.title}>{land.title}</h3>
        <p className={styles.location}>{land.location}, {land.city}</p>
        <p className={styles.size}>{land.size}</p>
        <p className={styles.price}>${land.price.toLocaleString()}</p>
        {land.description ? <p className={styles.desc}>{land.description}</p> : null}
      </div>
    </div>
  );
}
