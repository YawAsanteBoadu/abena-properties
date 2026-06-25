import AdminNav from '@/components/AdminNav/AdminNav';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      <main style={{ padding: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        {children}
      </main>
    </>
  );
}
