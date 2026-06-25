'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Counter.module.css';

interface CounterProps {
  end: number;
  label: string;
  duration?: number;
}

export default function Counter({ end, label, duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = end / steps;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return (
    <div ref={ref} className={styles.counter}>
      <span className={styles.number}>{count}+</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
