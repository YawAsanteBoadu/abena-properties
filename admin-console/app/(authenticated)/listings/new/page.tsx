import ListingForm from '@/components/ListingForm/ListingForm';

export default function NewListingPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>
        New Listing
      </h1>
      <ListingForm />
    </div>
  );
}
