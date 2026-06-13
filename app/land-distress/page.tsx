import type { Metadata } from 'next';
import LandCard from '@/components/LandCard/LandCard';
import PropertyCard from '@/components/PropertyCard/PropertyCard';
import { getLands, getDistressSales } from '@/data/properties';
import styles from '@/styles/LandDistress.module.css';

export const metadata: Metadata = {
  title: 'Land & Distress Sales',
  description:
    'Premium titled land acquisitions and below-market distress property deals across Ghana.',
};

export default async function LandDistressPage() {
  const [lands, distress] = await Promise.all([getLands(), getDistressSales()]);

  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Land &amp; Distress Sales</h1>
        <p className={styles.heroSubtitle}>
          Two distinct opportunities, one place — investment-grade land and motivated, below-market sales.
        </p>
      </section>

      {/* Segment 1 — Premium Land Acquisitions */}
      <section className={`${styles.segment} ${styles.landSegment}`}>
        <div className={styles.segmentInner}>
          <div className={styles.segmentHead}>
            <span className={`${styles.eyebrow} ${styles.eyebrowLand}`}>Investment-grade</span>
            <h2 className={styles.segmentTitle}>Premium Land Acquisitions</h2>
            <p className={styles.segmentDesc}>
              Serviced, titled plots in high-growth corridors — ready to build on or hold.
            </p>
          </div>
          <div className={styles.grid}>
            {lands.map((land) => (
              <LandCard key={land.id} land={land} />
            ))}
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* Segment 2 — Distress Sales */}
      <section className={`${styles.segment} ${styles.distressSegment}`}>
        <div className={styles.segmentInner}>
          <div className={styles.segmentHead}>
            <span className={`${styles.eyebrow} ${styles.eyebrowDistress}`}>Below market value</span>
            <h2 className={styles.segmentTitle}>Distress Sales</h2>
            <p className={styles.segmentDesc}>
              Motivated sellers and repossessions priced to move fast. Act quickly — these rarely last.
            </p>
          </div>
          <div className={styles.grid}>
            {distress.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
