import type { Metadata } from 'next';
import Image from 'next/image';
import Counter from '@/components/Counter/Counter';
import { BRAND } from '@/data/constants';
import styles from '@/styles/About.module.css';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Abena Properties and our mission.',
};

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>About Abena Properties</h1>
        <p className={styles.heroSubtitle}>Your trusted partner in Ghana&apos;s premium real estate market</p>
      </section>

      <section className={styles.story}>
        <div className={styles.storyGrid}>
          <div className={styles.storyText}>
            <h2 className={styles.sectionTitle}>Our Story</h2>
            <p>
              Abena Properties was founded with a simple mission: to make finding your dream home an
              enjoyable and seamless experience. Based in Accra, Ghana, we have grown from a small
              agency into one of the most trusted names in Ghanaian real estate.
            </p>
            <p>
              Our team of dedicated professionals brings decades of combined experience in property
              sales, rentals, and investment consulting. We pride ourselves on our deep knowledge of
              the local market and our commitment to matching every client with the perfect property.
            </p>
            <p>
              Whether you are a first-time buyer, a seasoned investor, or looking for the ideal
              rental, Abena Properties is here to guide you every step of the way.
            </p>
          </div>
          <div className={styles.storyImage}>
            <Image
              src="/images/properties/real_estate_agent.jpg"
              alt="Abena Properties Team"
              width={560}
              height={380}
              style={{ objectFit: 'cover', borderRadius: '16px' }}
            />
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          <Counter end={BRAND.stats.homesSold} label="Homes Sold" />
          <Counter end={BRAND.stats.homesRented} label="Homes Rented" />
          <Counter end={50} label="Expert Agents" />
          <Counter end={10} label="Years Experience" />
        </div>
      </section>

      <section className={styles.values}>
        <h2 className={styles.sectionTitle}>Why Choose Us</h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>&#9733;</div>
            <h3>Trusted Expertise</h3>
            <p>Our agents bring deep local market knowledge and years of industry experience to every transaction.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>&#9829;</div>
            <h3>Client-First Approach</h3>
            <p>We listen, understand, and deliver properties that truly match your lifestyle and budget.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>&#9878;</div>
            <h3>Premium Selection</h3>
            <p>Every property in our portfolio is carefully vetted to ensure the highest quality standards.</p>
          </div>
        </div>
      </section>
    </>
  );
}
