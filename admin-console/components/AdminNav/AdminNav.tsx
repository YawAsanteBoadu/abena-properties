'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/actions';
import styles from './AdminNav.module.css';

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/listings', label: 'Listings' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        Abena Properties
        <span className={styles.brandSub}>Admin</span>
      </div>
      <div className={styles.links}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.link} ${pathname === link.href ? styles.linkActive : ''}`}
          >
            {link.label}
          </Link>
        ))}
        <form action={logoutAction}>
          <button type="submit" className={styles.logout}>
            Log Out
          </button>
        </form>
      </div>
    </nav>
  );
}
