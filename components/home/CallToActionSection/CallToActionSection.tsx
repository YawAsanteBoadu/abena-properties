import styles from './CallToActionSection.module.css';
import { BRAND } from '@/data/constants';

export default function CallToActionSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Your Dream Home Is Within Reach</h2>
      <p className={styles.subtitle}>
        Let us help you find the perfect property. Get in touch with our team today.
      </p>
      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <span className={styles.icon}>&#9742;</span>
          <strong>Call Us</strong>
          <span>{BRAND.phone}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.infoItem}>
          <span className={styles.icon}>&#9906;</span>
          <strong>Visit Us</strong>
          <span>{BRAND.address}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.infoItem}>
          <span className={styles.icon}>&#9993;</span>
          <strong>Email Us</strong>
          <span>{BRAND.email}</span>
        </div>
      </div>
    </section>
  );
}
