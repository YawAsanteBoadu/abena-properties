import Link from 'next/link';
import styles from './BuyOrRentSection.module.css';

interface GatewayCard {
  href: string;
  title: string;
  desc: string;
  cta: string;
  img: string;
}

// "Gateway" portals. Plain lazy <img> thumbnails keep these downstream of the
// Hero Banner's LCP — zero impact on initial paint.
const CARDS: GatewayCard[] = [
  {
    href: '/buy',
    title: 'Buy a Home',
    desc: 'Own your forever home from our curated collection of premium properties.',
    cta: 'Browse Homes',
    img: '/images/new_img/588fd5f9bbc90837b3ab4be6e587365b.jpg',
  },
  {
    href: '/rent',
    title: 'Rent a Home',
    desc: 'Fully furnished apartments and houses available to move into today.',
    cta: 'View Rentals',
    img: '/images/new_img/492f3f168f8e812c34068d1cba352b24.jpg',
  },
  {
    href: '/land-distress',
    title: 'Land & Distress Sales',
    desc: 'Titled land plots and below-market distress deals for sharp investors.',
    cta: 'Explore Deals',
    img: '/images/new_img/30559179d72ca3344f23c26084a469d2.jpg',
  },
  {
    href: '/projects',
    title: 'Construction & Projects',
    desc: 'Ongoing developments you can secure early, tracked by completion stage.',
    cta: 'See Projects',
    img: '/images/new_img/55236c863e2bbff4861a3d7d095ed1a8.jpg',
  },
];

export default function BuyOrRentSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>What Are You Looking For?</h2>
      <div className={styles.cards}>
        {CARDS.map((card) => (
          <Link key={card.href} href={card.href} className={styles.card}>
            <img
              src={card.img}
              alt={card.title}
              className={styles.cardImage}
              loading="lazy"
              decoding="async"
            />
            <span className={styles.cardOverlay} />
            <span className={styles.cardContent}>
              <span className={styles.cardTitle}>{card.title}</span>
              <span className={styles.cardDesc}>{card.desc}</span>
              <span className={styles.cardBtn}>{card.cta}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
