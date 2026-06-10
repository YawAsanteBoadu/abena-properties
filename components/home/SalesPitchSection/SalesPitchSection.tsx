import styles from './SalesPitchSection.module.css';
import { BRAND } from '@/data/constants';

export default function SalesPitchSection() {
  const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(BRAND.whatsappMessage)}`;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.pitch}>
          <h2 className={styles.heading}>Ready to Make Your Move?</h2>
          <p className={styles.text}>
            At Abena Properties, we believe everyone deserves a place to call home. Whether you are
            looking for a luxurious mansion in East Legon or a cozy apartment in Osu, our experienced
            team is dedicated to finding the perfect property that fits your lifestyle and budget.
            With over {BRAND.stats.homesSold} homes sold and {BRAND.stats.homesRented} properties
            rented, we have the expertise and network to deliver results.
          </p>
          <p className={styles.text}>
            Do not wait for the perfect moment — create it. Reach out to us today and let us start
            your journey to homeownership or find your ideal rental property.
          </p>
        </div>
        <div className={styles.contact}>
          <div className={styles.contactCard}>
            <h3 className={styles.contactTitle}>Get In Touch</h3>
            <p className={styles.contactDesc}>
              Send us a message on WhatsApp and one of our agents will respond within minutes.
            </p>
            <div className={styles.template}>
              <p className={styles.templateLabel}>Your message will say:</p>
              <p className={styles.templateText}>&ldquo;{BRAND.whatsappMessage}&rdquo;</p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
