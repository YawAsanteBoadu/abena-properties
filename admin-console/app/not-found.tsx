import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          padding: '2.5rem',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#4b5563', marginBottom: '1.5rem' }}>
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: '#800020',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
