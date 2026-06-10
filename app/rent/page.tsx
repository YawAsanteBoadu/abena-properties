import type { Metadata } from 'next';
import PropertyCard from '@/components/PropertyCard/PropertyCard';
import Counter from '@/components/Counter/Counter';
import { getPropertiesByType } from '@/data/properties';
import { BRAND } from '@/data/constants';
import styles from '@/styles/Listings.module.css';

export const metadata: Metadata = {
  title: 'Rent',
  description: 'Premium properties available for rent in Ghana.',
};

export default async function RentPage() {
  const rentProperties = await getPropertiesByType('rent');

  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Properties for Rent</h1>
        <p className={styles.heroSubtitle}>Discover fully furnished apartments and houses available today</p>
        <div className={styles.heroCounter}>
          <Counter end={BRAND.stats.homesRented} label="Homes Rented" />
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.grid}>
          {rentProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>
    </>
  );
}
