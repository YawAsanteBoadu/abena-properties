import styles from './DashboardCard.module.css';

interface DashboardCardProps {
  label: string;
  value: number;
  accent?: boolean;
}

export default function DashboardCard({ label, value, accent }: DashboardCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={`${styles.value} ${accent ? styles.accent : ''}`}>{value}</span>
    </div>
  );
}
