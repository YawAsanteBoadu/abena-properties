import { apiFetch } from '@/lib/api';
import type { Listing } from '@/lib/types';
import DashboardCard from '@/components/DashboardCard/DashboardCard';
import styles from './page.module.css';

export default async function DashboardPage() {
  const listings = await apiFetch<Listing[]>('/api/admin/listings');

  const byCategory = {
    buy: listings.filter((l) => l.category === 'buy').length,
    rent: listings.filter((l) => l.category === 'rent').length,
    land: listings.filter((l) => l.category === 'land').length,
    project: listings.filter((l) => l.category === 'project').length,
    distress: listings.filter((l) => l.category === 'distress').length,
  };

  const byStatus = {
    published: listings.filter((l) => l.status === 'published').length,
    draft: listings.filter((l) => l.status === 'draft').length,
    archived: listings.filter((l) => l.status === 'archived').length,
  };

  return (
    <div>
      <h1 className={styles.heading}>Dashboard</h1>

      <h2 className={styles.subheading}>By Category</h2>
      <div className={styles.grid}>
        <DashboardCard label="For Sale" value={byCategory.buy} accent />
        <DashboardCard label="For Rent" value={byCategory.rent} accent />
        <DashboardCard label="Land" value={byCategory.land} />
        <DashboardCard label="Projects" value={byCategory.project} />
        <DashboardCard label="Distress" value={byCategory.distress} />
      </div>

      <h2 className={styles.subheading}>By Status</h2>
      <div className={styles.grid}>
        <DashboardCard label="Published" value={byStatus.published} accent />
        <DashboardCard label="Draft" value={byStatus.draft} />
        <DashboardCard label="Archived" value={byStatus.archived} />
      </div>

      <div className={styles.total}>
        Total Listings: <strong>{listings.length}</strong>
      </div>
    </div>
  );
}
