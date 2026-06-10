import type { Metadata } from 'next';
import { BRAND } from '@/data/constants';
import styles from '@/styles/Contact.module.css';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Abena Properties.',
};

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(BRAND.whatsappMessage)}`;

  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Contact Us</h1>
        <p className={styles.heroSubtitle}>We would love to hear from you. Reach out through any channel below.</p>
      </section>

      <section className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.info}>
            <h2 className={styles.sectionTitle}>Get In Touch</h2>

            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <span className={styles.infoIcon}>&#9742;</span>
                <div>
                  <h3>Phone</h3>
                  <p>{BRAND.phone}</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoIcon}>&#9993;</span>
                <div>
                  <h3>Email</h3>
                  <p>{BRAND.email}</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoIcon}>&#9906;</span>
                <div>
                  <h3>Location</h3>
                  <p>{BRAND.address}</p>
                </div>
              </div>
            </div>

            <div className={styles.whatsapp}>
              <h3>Quick Chat</h3>
              <p>Send us a message on WhatsApp for a faster response.</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                Chat on WhatsApp
              </a>
            </div>

            <div className={styles.socials}>
              <h3>Follow Us</h3>
              <div className={styles.socialLinks}>
                <a href={BRAND.socialLinks.facebook} className={styles.socialLink}>Facebook</a>
                <a href={BRAND.socialLinks.instagram} className={styles.socialLink}>Instagram</a>
                <a href={BRAND.socialLinks.twitter} className={styles.socialLink}>Twitter</a>
                <a href={BRAND.socialLinks.linkedin} className={styles.socialLink}>LinkedIn</a>
              </div>
            </div>
          </div>

          <div className={styles.formSide}>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
