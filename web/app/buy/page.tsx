import type { Metadata } from 'next';
import PropertyCard from '@/components/PropertyCard/PropertyCard';
import Counter from '@/components/Counter/Counter';
import { getPropertiesByType } from '@/data/properties';
import { BRAND } from '@/data/constants';
import styles from '@/styles/Listings.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Buy',
  description: 'Premium properties available for purchase in Ghana.',
};

export default async function BuyPage() {
  const buyProperties = await getPropertiesByType('buy');

  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Properties for Sale</h1>
        <p className={styles.heroSubtitle}>Find your forever home from our curated selection</p>
        <div className={styles.heroCounter}>
          <Counter end={BRAND.stats.homesSold} label="Homes Sold" />
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.grid}>
          {buyProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>
    </>
  );
}
