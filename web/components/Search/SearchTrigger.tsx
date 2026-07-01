'use client';

import { useEffect, useState } from 'react';
import { useSearch } from './SearchProvider';
import styles from './Search.module.css';

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function SearchTrigger() {
  const { open } = useSearch();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform));
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key === 'k') {
        e.preventDefault();
        open();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMac, open]);

  return (
    <>
      <button
        className={styles.triggerDesktop}
        onClick={open}
        aria-label="Search properties"
        aria-keyshortcuts={isMac ? 'Meta+k' : 'Control+k'}
      >
        <SearchIcon />
        <span className={styles.triggerText}>Search properties…</span>
        <kbd className={styles.kbd}>{isMac ? '⌘' : 'Ctrl'} K</kbd>
      </button>
      <button
        className={styles.triggerMobile}
        onClick={open}
        aria-label="Search properties"
      >
        <SearchIcon />
      </button>
    </>
  );
}
