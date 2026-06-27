import { BRAND } from '@/data/constants';
import styles from './CallButton.module.css';

interface CallButtonProps {
  variant?: 'nav' | 'cta';
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.01-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.1.31.03.66-.25 1.01l-2.2 2.21z" />
    </svg>
  );
}

export default function CallButton({ variant = 'nav' }: CallButtonProps) {
  const isCta = variant === 'cta';

  return (
    <a
      href={`tel:${BRAND.phone}`}
      className={isCta ? styles.cta : styles.nav}
      aria-label={`Call us at ${BRAND.phone}`}
    >
      <PhoneIcon />
      <span className={styles.label}>{isCta ? 'Call Us' : 'Call'}</span>
    </a>
  );
}
