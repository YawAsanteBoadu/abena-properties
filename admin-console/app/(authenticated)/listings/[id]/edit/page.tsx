import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import type { Listing } from '@/lib/types';
import ListingForm from '@/components/ListingForm/ListingForm';
import ImageUploader from '@/components/ImageUploader/ImageUploader';

type Params = { id: string };

export default async function EditListingPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  let listing: Listing;
  try {
    listing = await apiFetch<Listing>(`/api/admin/listings/${id}`);
  } catch {
    notFound();
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>
        Edit: {listing.title}
      </h1>
      <ListingForm listing={listing} />
      <ImageUploader listingId={listing.id} images={listing.images} />
    </div>
  );
}
