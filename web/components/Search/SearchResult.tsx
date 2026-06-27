import Image from 'next/image';
import type { SearchListing } from './SearchProvider';
import styles from './Search.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  buy: 'Buy',
  rent: 'Rent',
  land: 'Land',
  project: 'Project',
  distress: 'Distress',
};

interface SearchResultProps {
  listing: SearchListing;
  isSelected: boolean;
  onClick: () => void;
  id: string;
}

export default function SearchResult({ listing, isSelected, onClick, id }: SearchResultProps) {
  const label = CATEGORY_LABELS[listing.category] || listing.category;

  return (
    <li
      id={id}
      role="option"
      aria-selected={isSelected}
      className={`${styles.result} ${isSelected ? styles.resultSelected : ''}`}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
    >
      {listing.imageUrl && (
        <div className={styles.resultThumb}>
          <Image
            src={listing.imageUrl}
            alt=""
            width={48}
            height={48}
            className={styles.resultImg}
          />
        </div>
      )}
      <div className={styles.resultInfo}>
        <div className={styles.resultTitle}>{listing.title}</div>
        <div className={styles.resultMeta}>
          {listing.location}, {listing.city}
        </div>
      </div>
      <span className={styles.resultBadge}>{label}</span>
      {listing.price > 0 && (
        <span className={styles.resultPrice}>${listing.price.toLocaleString()}</span>
      )}
    </li>
  );
}
