'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { NAV_LINKS, SERVICE_LINKS, BRAND } from '@/data/constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const serviceActive = SERVICE_LINKS.some((s) => s.href === pathname);

  // Split NAV_LINKS so Services dropdown sits after Properties
  const beforeServices = NAV_LINKS.slice(0, 2); // Home, Properties
  const afterServices = NAV_LINKS.slice(2);      // About Us, Contact

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.logoArea}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/AbProperties_logo.png"
              alt={`${BRAND.name} Logo`}
              fill
              sizes="(max-width: 768px) 100%, auto"
              priority
              className={styles.logoImage}
            />
          </Link>
          <div className={styles.socialIcons}>
            <a href={BRAND.socialLinks.facebook} className={styles.socialIcon} aria-label="Facebook">f</a>
            <a href={BRAND.socialLinks.instagram} className={styles.socialIcon} aria-label="Instagram">in</a>
            <a href={BRAND.socialLinks.twitter} className={styles.socialIcon} aria-label="Twitter">X</a>
          </div>
        </div>

        <ul className={styles.navLinks}>
          {/* Home, Properties */}
          {beforeServices.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Services dropdown — sits between Properties and About Us */}
          <li className={styles.dropdown}>
            <button
              type="button"
              className={`${styles.navLink} ${styles.dropdownToggle} ${serviceActive ? styles.navLinkActive : ''}`}
              aria-haspopup="true"
            >
              Services
              <span className={styles.caret} aria-hidden="true" />
            </button>
            <ul className={styles.dropdownMenu}>
              {SERVICE_LINKS.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className={`${styles.dropdownItem} ${pathname === s.href ? styles.dropdownItemActive : ''}`}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* About Us, Contact */}
          {afterServices.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </nav>

      <div
        className={`${styles.scrim} ${mobileOpen ? styles.scrimOpen : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        {/* Home, Properties */}
        {beforeServices.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.navLink}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        {/* Services in mobile menu */}
        <span className={styles.mobileGroupLabel}>Services</span>
        {SERVICE_LINKS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`${styles.navLink} ${styles.mobileSubLink}`}
            onClick={() => setMobileOpen(false)}
          >
            {s.label}
          </Link>
        ))}

        {/* About Us, Contact */}
        {afterServices.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.navLink}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}