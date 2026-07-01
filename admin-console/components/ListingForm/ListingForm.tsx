'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createListingAction, updateListingAction } from '@/lib/actions';
import type { Listing, Category, CreateListingData } from '@/lib/types';
import styles from './ListingForm.module.css';

interface ListingFormProps {
  listing?: Listing;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'buy', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'land', label: 'Land' },
  { value: 'project', label: 'Project' },
  { value: 'distress', label: 'Distress Sale' },
];

export default function ListingForm({ listing }: ListingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [category, setCategory] = useState<Category>(listing?.category || 'buy');

  const isProperty = ['buy', 'rent', 'distress'].includes(category);
  const isLand = category === 'land';
  const isProject = category === 'project';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const form = new FormData(e.currentTarget);
    const data: CreateListingData = {
      title: form.get('title') as string,
      location: form.get('location') as string,
      city: form.get('city') as string,
      category,
      status: (form.get('status') as string) as CreateListingData['status'] || 'draft',
      description: (form.get('description') as string) || undefined,
      isHottest: form.get('isHottest') === 'on',
    };

    const price = form.get('price') as string;
    if (price) data.price = parseFloat(price);

    if (isProperty) {
      data.type = category === 'distress' ? 'buy' : category as 'buy' | 'rent';
      const origPrice = form.get('originalPrice') as string;
      if (origPrice) data.originalPrice = parseFloat(origPrice);
      const beds = form.get('bedrooms') as string;
      if (beds) data.bedrooms = parseInt(beds);
      const baths = form.get('baths') as string;
      if (baths) data.baths = parseInt(baths);
      const sqft = form.get('squareFeet') as string;
      if (sqft) data.squareFeet = parseInt(sqft);
      const levels = form.get('levels') as string;
      if (levels) data.levels = parseInt(levels);
    }

    if (isLand) {
      const size = form.get('size') as string;
      if (size) data.size = size;
    }

    if (isProject) {
      const comp = form.get('completion') as string;
      if (comp) data.completion = parseInt(comp);
      const exp = form.get('expectedCompletion') as string;
      if (exp) data.expectedCompletion = exp;
    }

    startTransition(async () => {
      try {
        if (listing) {
          await updateListingAction(listing.id, data);
        } else {
          await createListingAction(data);
        }
        router.push('/listings');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      }
    });
  }

  return (
    <div className={styles.card}>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              name="title"
              required
              defaultValue={listing?.title}
              className={styles.input}
              placeholder="Property title"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Location</label>
            <input
              name="location"
              required
              defaultValue={listing?.location}
              className={styles.input}
              placeholder="e.g. East Legon"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>City</label>
            <input
              name="city"
              required
              defaultValue={listing?.city}
              className={styles.input}
              placeholder="e.g. Accra"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={listing?.price}
              className={styles.input}
              placeholder={category === 'rent' ? 'Monthly rent' : 'Sale price'}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select name="status" className={styles.select} defaultValue={listing?.status || 'draft'}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {isProperty && (
          <>
            {category === 'distress' && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Original Price ($)</label>
                  <input
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    defaultValue={listing?.originalPrice}
                    className={styles.input}
                  />
                </div>
                <div />
              </div>
            )}
            <div className={styles.row3}>
              <div className={styles.field}>
                <label className={styles.label}>Bedrooms</label>
                <input name="bedrooms" type="number" defaultValue={listing?.bedrooms} className={styles.input} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Bathrooms</label>
                <input name="baths" type="number" defaultValue={listing?.baths} className={styles.input} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Sq Ft</label>
                <input name="squareFeet" type="number" defaultValue={listing?.squareFeet} className={styles.input} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Levels</label>
                <input name="levels" type="number" defaultValue={listing?.levels} className={styles.input} />
              </div>
              <div />
            </div>
          </>
        )}

        {isLand && (
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Size</label>
              <input
                name="size"
                defaultValue={listing?.size}
                className={styles.input}
                placeholder="e.g. 2 plots · 1,400 sqm"
              />
            </div>
            <div />
          </div>
        )}

        {isProject && (
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Completion (%)</label>
              <input
                name="completion"
                type="number"
                min="0"
                max="100"
                defaultValue={listing?.completion}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Expected Completion</label>
              <input
                name="expectedCompletion"
                defaultValue={listing?.expectedCompletion}
                className={styles.input}
                placeholder="e.g. Q4 2026"
              />
            </div>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            name="description"
            defaultValue={listing?.description}
            className={styles.textarea}
            placeholder="Describe the listing..."
          />
        </div>

        <label className={styles.checkbox}>
          <input type="checkbox" name="isHottest" defaultChecked={listing?.isHottest} />
          Mark as "Hottest" (featured on homepage)
        </label>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? 'Saving...' : listing ? 'Update Listing' : 'Create Listing'}
          </button>
          <button type="button" className={styles.cancelBtn} onClick={() => router.push('/listings')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
