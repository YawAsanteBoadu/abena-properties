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
 *    lazy-loaded poster image is painted.
 *  - The real player is injected ONLY after an explicit user click.
 *  - When no video source is configured, a non-clickable "coming soon" state
 *    renders with the same poster+scrim treatment as the facade — polished,
 *    on-brand, but with no play button so the user is never misled.
 */
export default function VideoFacade({ posterSrc, title, embedUrl, videoUrl }: VideoFacadeProps) {
  const [activated, setActivated] = useState(false);
  const hasVideo = Boolean(embedUrl || videoUrl);

  // ---- No video source configured. Non-clickable poster + overlay message. ----
  if (!hasVideo) {
    return (
      <div
        className={styles.comingSoon}
        role="status"
        aria-label={`Video tour of ${title} coming soon`}
      >
        <Image
          src={posterSrc}
          alt={`${title} preview`}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
        <span className={styles.comingSoonScrim} aria-hidden="true" />
        <div className={styles.comingSoonContent}>
          <p className={styles.comingSoonTitle}>Video tour coming soon</p>
          <p className={styles.comingSoonText}>
            A walkthrough video for this property is not yet available. Contact
            our team to schedule an in-person or live virtual tour.
          </p>
        </div>
      </div>
    );
  }

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
  }

  return <div className={styles.player}>{media}</div>;
}