'use client';

import { useState } from 'react';
import PropertyCard from '@/components/PropertyCard/PropertyCard';
import type { Property } from '@/data/properties';
import styles from '@/styles/Listings.module.css';

type Filter = 'all' | 'buy' | 'rent';

export default function PropertiesExplorer({ properties }: { properties: Property[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all'
    ? properties
    : properties.filter((p) => p.type === filter);

  return (
    <section className={styles.section}>
      <div className={styles.filters}>
        {(['all', 'buy', 'rent'] as Filter[]).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'buy' ? 'For Sale' : 'For Rent'}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {filtered.map((prop) => (
          <PropertyCard key={prop.id} property={prop} />
        ))}
      </div>
    </section>
  );
}
