import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PropertyGallery from '@/components/property/PropertyGallery/PropertyGallery';
import VideoFacade from '@/components/property/VideoFacade/VideoFacade';
import { getAllListingIds, getPropertyById, getPropertyGallery } from '@/data/properties';
import { BRAND } from '@/data/constants';
import styles from '@/styles/PropertyDetail.module.css';

type Params = { id: string };

// Pre-render every property page at build time (static generation = best
// crawlability and performance).
export async function generateStaticParams(): Promise<Params[]> {
  const ids = await getAllListingIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) {
    return { title: 'Property Not Found' };
  }
  return {
    title: property.title,
    description:
      property.description ??
      `${property.title} in ${property.location}, ${property.city}.`,
  };
}

function formatPrice(price: number, type: 'buy' | 'rent') {
  const formatted = price.toLocaleString();
  return type === 'rent' ? `$${formatted}/mo` : `$${formatted}`;
}

export default async function PropertyDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const gallery = getPropertyGallery(property);
  const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    `Hello Abena Properties! I am interested in "${property.title}" (${formatPrice(
      property.price,
      property.type,
    )}). Please share more details.`,
  )}`;

  return (
    <article className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/properties" className={styles.back}>
          &#8249; Back to listings
        </Link>
        <span className={property.type === 'buy' ? styles.tagBuy : styles.tagRent}>
          {property.type === 'buy' ? 'For Sale' : 'For Rent'}
        </span>
      </div>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{property.title}</h1>
          <p className={styles.location}>
            {property.location}, {property.city}
          </p>
        </div>
        <p className={styles.price}>{formatPrice(property.price, property.type)}</p>
      </header>

      {/* Sliding gallery: card image + four extra photos */}
      <PropertyGallery images={gallery} title={property.title} />

      <div className={styles.cards}>
        {/* Card 1 — written details (Server Component, zero JS) */}
        <section className={styles.detailsCard}>
          <h2 className={styles.cardTitle}>Property Details</h2>

          <div className={styles.specGrid}>
            <div className={styles.spec}>
              <span className={styles.specValue}>{property.bedrooms}</span>
              <span className={styles.specLabel}>Bedrooms</span>
            </div>
            <div className={styles.spec}>
              <span className={styles.specValue}>{property.baths}</span>
              <span className={styles.specLabel}>Bathrooms</span>
            </div>
            <div className={styles.spec}>
              <span className={styles.specValue}>{property.squareFeet.toLocaleString()}</span>
              <span className={styles.specLabel}>Sq Ft</span>
            </div>
            <div className={styles.spec}>
              <span className={styles.specValue}>{property.levels}</span>
              <span className={styles.specLabel}>
                {property.levels === 1 ? 'Level' : 'Levels'}
              </span>
            </div>
          </div>

          <p className={styles.description}>
            {property.description ??
              `A premium ${property.type === 'buy' ? 'home for sale' : 'rental'} located in ${property.location}, ${property.city}. Contact our team for a private viewing and the full feature list.`}
          </p>

          <ul className={styles.features}>
            <li>Prime location in {property.location}</li>
            <li>{property.bedrooms} bedrooms &amp; {property.baths} bathrooms</li>
            <li>{property.squareFeet.toLocaleString()} sq ft across {property.levels} {property.levels === 1 ? 'level' : 'levels'}</li>
            <li>Vetted and ready for viewing</li>
          </ul>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.cta}>
            Enquire on WhatsApp
          </a>
        </section>

        {/* Card 2 — video facade (lazy / JIT). No video bytes load until click.
            To go live, pass embedUrl="https://www.youtube.com/embed/VIDEO_ID"
            or videoUrl="/videos/your-tour.mp4" (file in /public) below. */}
        <section className={styles.videoCard}>
          <h2 className={styles.cardTitle}>Video Tour</h2>
          <VideoFacade posterSrc={gallery[0]} title={property.title} />
          <p className={styles.videoNote}>
            Tap play to load the tour. Nothing video-related is downloaded until you do.
          </p>
        </section>
      </div>
    </article>
  );
}
