'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './ClientsStoryCarousel.module.css';
import { testimonials } from '@/data/properties';

export default function ClientsStoryCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className={styles.section}>
      <div className={styles.carousel}>
        <h2 className={styles.title}>What Our Clients Say</h2>
        <div className={styles.slider}>
          <div
            className={styles.track}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((t) => (
              <div key={t.id} className={styles.slide}>
                <p className={styles.text}>&ldquo;{t.text}&rdquo;</p>
                <div className={styles.author}>
                  <div className={styles.authorInfo}>
                    <strong className={styles.name}>{t.name}</strong>
                    <span className={styles.role}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.controls}>
          <button onClick={prev} className={styles.arrow} aria-label="Previous">&larr;</button>
          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next} className={styles.arrow} aria-label="Next">&rarr;</button>
        </div>
      </div>
    </section>
  );
}
