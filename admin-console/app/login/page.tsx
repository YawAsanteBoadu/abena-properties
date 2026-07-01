import { loginAction } from '@/lib/actions';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>Abena Properties</div>
        <h1 className={styles.title}>Admin Login</h1>
        <form action={loginAction} className={styles.form}>
          <label className={styles.label}>
            Email
            <input
              type="email"
              name="email"
              required
              className={styles.input}
              placeholder="admin@abenaproperties.com"
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              type="password"
              name="password"
              required
              className={styles.input}
              placeholder="Enter password"
            />
          </label>
          <button type="submit" className={styles.button}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
