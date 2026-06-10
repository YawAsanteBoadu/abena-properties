import Image from 'next/image';
import Link from 'next/link';
import styles from './PropertyCard.module.css';
import { Property } from '@/data/properties';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, type: 'buy' | 'rent') => {
    const formatted = price.toLocaleString();
    return type === 'rent' ? `$${formatted}/mo` : `$${formatted}`;
  };

  return (
    <Link href={`/properties/${property.id}`} className={styles.cardLink}>
      <div className={styles.cardWrapper}>
        <div className={styles.mediaContainer}>
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
            style={{ objectFit: 'cover' }}
          />
          <span className={property.type === 'buy' ? styles.tagBuy : styles.tagRent}>
            {property.type === 'buy' ? 'BUY' : 'RENT'}
          </span>
        </div>
        <div className={styles.cardBody}>
          <h3 className={styles.title}>{property.title}</h3>
          <p className={styles.location}>{property.location}, {property.city}</p>
          <p className={styles.price}>{formatPrice(property.price, property.type)}</p>
          <div className={styles.specs}>
            <span>{property.bedrooms} Beds</span>
            <span className={styles.specDivider} />
            <span>{property.baths} Baths</span>
            <span className={styles.specDivider} />
            <span>{property.squareFeet.toLocaleString()} sqft</span>
            <span className={styles.specDivider} />
            <span>{property.levels} {property.levels === 1 ? 'Level' : 'Levels'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
