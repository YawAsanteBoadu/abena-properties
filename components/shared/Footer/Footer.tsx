import Link from 'next/link';
import styles from './Footer.module.css';
import { BRAND, NAV_LINKS } from '@/data/constants';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogo}>
            Abena<span className={styles.footerLogoAccent}>Properties</span>
          </div>
          <p className={styles.footerDesc}>
            Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters with premium real estate across Ghana.
          </p>
        </div>
        <div className={styles.footerRight}>
          <div className={styles.footerCol}>
            <h4>Navigation</h4>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Contact</h4>
            <ul>
              <li>{BRAND.address}</li>
              <li>{BRAND.phone}</li>
              <li>{BRAND.email}</li>
            </ul>
            <div className={styles.footerSocials}>
              <a href={BRAND.socialLinks.facebook} className={styles.footerSocialIcon} aria-label="Facebook">f</a>
              <a href={BRAND.socialLinks.instagram} className={styles.footerSocialIcon} aria-label="Instagram">in</a>
              <a href={BRAND.socialLinks.twitter} className={styles.footerSocialIcon} aria-label="Twitter">X</a>
              <a href={BRAND.socialLinks.linkedin} className={styles.footerSocialIcon} aria-label="LinkedIn">Li</a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </div>
    </footer>
  );
}
