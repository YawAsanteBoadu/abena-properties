import Link from 'next/link';
import styles from './BuyOrRentSection.module.css';
import Counter from '@/components/Counter/Counter';
import { BRAND } from '@/data/constants';

export default function BuyOrRentSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>What Are You Looking For?</h2>
      <div className={styles.cards}>
        <Link href="/buy" className={styles.card}>
          <div className={styles.cardImage} style={{ backgroundImage: "url('/images/properties/buy_card_img2.jpg')" }} />
          <div className={styles.cardOverlay} />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Buy a Home</h3>
            <p className={styles.cardDesc}>Find your forever home from our curated collection of premium properties.</p>
            <Counter end={BRAND.stats.homesSold} label="Homes Sold" />
            <span className={styles.cardBtn}>Browse Homes</span>
          </div>
        </Link>
        <Link href="/rent" className={styles.card}>
          <div className={styles.cardImage} style={{ backgroundImage: "url('/images/properties/rent_card_img.jpg')" }} />
          <div className={styles.cardOverlay} />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Rent a Home</h3>
            <p className={styles.cardDesc}>Discover fully furnished apartments and houses available for rent today.</p>
            <Counter end={BRAND.stats.homesRented} label="Homes Rented" />
            <span className={styles.cardBtn}>View Rentals</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
