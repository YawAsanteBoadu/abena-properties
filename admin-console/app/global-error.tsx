'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "'Poppins', sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: 0,
          background: '#f9fafb',
          color: '#1f2937',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
            padding: '2.5rem',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            borderTop: '4px solid #dc2626',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Application Error
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#4b5563', marginBottom: '1.5rem' }}>
            {error.message || 'A critical error occurred.'}
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#800020',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
