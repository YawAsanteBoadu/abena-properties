import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard/PropertyCard';
import styles from './NewPropertiesSection.module.css';
import { Property } from '@/data/properties';

interface NewPropertiesSectionProps {
  title: string;
  properties: Property[];
  viewMoreHref: string;
  viewMoreLabel: string;
}

export default function NewPropertiesSection({ title, properties, viewMoreHref, viewMoreLabel }: NewPropertiesSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.grid}>
        {properties.map((prop) => (
          <PropertyCard key={prop.id} property={prop} />
        ))}
      </div>
      <Link href={viewMoreHref} className={styles.viewMore}>
        {viewMoreLabel}
      </Link>
    </section>
  );
}
