import styles from './StatusBadge.module.css';

export default function StatusBadge({ status }: { status: string }) {
  const cls = status === 'published'
    ? styles.published
    : status === 'draft'
      ? styles.draft
      : styles.archived;

  return <span className={`${styles.badge} ${cls}`}>{status}</span>;
}
