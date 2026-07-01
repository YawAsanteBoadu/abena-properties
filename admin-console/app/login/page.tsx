'use client';

import { useState, useTransition } from 'react';
import { loginAction } from '@/lib/actions';
import styles from './page.module.css';
import Image from 'next/image';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result && !result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Image
            src="/AbProperties_logo.png"
            alt="Abena Properties"
            width={220}
            height={80}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h1 className={styles.title}>Admin Login</h1>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
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
          <button type="submit" className={styles.button} disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
