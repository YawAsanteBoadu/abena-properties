'use client';

import styles from '@/styles/Contact.module.css';

export default function ContactForm() {
  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Send Us a Message</h2>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" placeholder="Your full name" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" placeholder="your@email.com" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" placeholder="+233 XX XXX XXXX" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea id="message" rows={5} placeholder="Tell us what you are looking for..." />
        </div>
        <button type="submit" className={styles.submitBtn}>Send Message</button>
      </form>
    </div>
  );
}
