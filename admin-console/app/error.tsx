'use client';

import styles from './error.module.css';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.message}>
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className={styles.actions}>
          <button onClick={reset} className={styles.retryBtn}>
            Try Again
          </button>
          <a href="/" className={styles.homeLink}>
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
