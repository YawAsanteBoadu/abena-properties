import Link from 'next/link';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.heading}>
          Find Your <span className={styles.accent}>Perfect</span> Home
        </h1>
        <p className={styles.subtitle}>
          Discover premium properties for buying and renting across Ghana.
          Your dream home is just one click away.
        </p>
        <Link href="/properties" className={styles.exploreBtn}>
          Explore Properties
        </Link>
      </div>
    </section>
  );
}
