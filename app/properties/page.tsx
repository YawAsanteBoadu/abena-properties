import type { Metadata } from 'next';
import { getProperties } from '@/data/properties';
import styles from '@/styles/Listings.module.css';
import PropertiesExplorer from './PropertiesExplorer';

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Browse all premium property listings for buying and renting.',
};

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>All Properties</h1>
        <p className={styles.heroSubtitle}>Browse our complete collection of premium listings</p>
      </section>
      <PropertiesExplorer properties={properties} />
    </>
  );
}
