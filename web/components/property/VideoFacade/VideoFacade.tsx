'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './VideoFacade.module.css';

interface VideoFacadeProps {
  /** Lightweight, pre-optimized poster image representing the property. */
  posterSrc: string;
  title: string;
  /**
   * Streaming embed URL (e.g. YouTube/Vimeo). When provided, clicking play
   * swaps the poster for an <iframe>. Leave undefined to use `videoUrl` or the
   * placeholder.
   */
  embedUrl?: string;
  /**
   * Self-hosted video file URL (mp4/webm placed in /public). When provided,
   * clicking play swaps the poster for a native HTML5 <video> element.
   */
  videoUrl?: string;
}

/**
 * Video Facade (lazy / JIT loading).
 *
 * Performance + SEO strategy:
 *  - Initial render ships ZERO video bytes and ZERO player APIs. Only a static,
 *    lazy-loaded poster image and a pure-CSS play button are painted.
 *  - The real player (iframe or <video>) is injected ONLY after an explicit
 *    user click — downstream of user intent — so crawlers measuring load
 *    metrics (LCP/TBT/INP) never download the heavy media on first paint.
 */
export default function VideoFacade({ posterSrc, title, embedUrl, videoUrl }: VideoFacadeProps) {
  const [activated, setActivated] = useState(false);

  // ---- Facade state: poster + CSS play button only. No video on the page. ----
  if (!activated) {
    return (
      <button
        type="button"
        className={styles.facade}
        onClick={() => setActivated(true)}
        aria-label={`Play video tour of ${title}`}
      >
        <Image
          src={posterSrc}
          alt={`${title} video tour preview`}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
        <span className={styles.scrim} aria-hidden="true" />
        <span className={styles.playButton} aria-hidden="true">
          <span className={styles.playTriangle} />
        </span>
        <span className={styles.label}>Watch Video Tour</span>
      </button>
    );
  }

  // ---- Activated: media is fetched now, only after the click. ----
  let media;
  if (embedUrl) {
    media = (
      <iframe
        className={styles.media}
        src={embedUrl}
        title={`${title} video tour`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  } else if (videoUrl) {
    media = (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        className={styles.media}
        src={videoUrl}
        poster={posterSrc}
        controls
        autoPlay
        playsInline
      />
    );
  } else {
    // No real video wired up yet. The facade swap is fully functional; drop in
    // an `embedUrl` (YouTube/Vimeo) or `videoUrl` (self-hosted file) to go live.
    media = (
      <div className={styles.placeholder} role="status">
        {/* PLACEHOLDER — insert a real video here.
            Option A: pass embedUrl="https://www.youtube.com/embed/VIDEO_ID"
            Option B: pass videoUrl="/videos/your-tour.mp4" (file in /public) */}
        <span className={styles.placeholderIcon} aria-hidden="true">&#9658;</span>
        <p className={styles.placeholderTitle}>Player ready — no video source set</p>
        <p className={styles.placeholderText}>
          Insert a real tour by passing an <code>embedUrl</code> or <code>videoUrl</code> to this card.
        </p>
      </div>
    );
  }

  return <div className={styles.player}>{media}</div>;
}
