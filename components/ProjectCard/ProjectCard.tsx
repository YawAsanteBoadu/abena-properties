import Image from 'next/image';
import styles from './ProjectCard.module.css';
import { Project } from '@/data/properties';

export default function ProjectCard({ project }: { project: Project }) {
  const status =
    project.completion >= 80 ? 'Final stage' : project.completion >= 40 ? 'In progress' : 'Early stage';

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.mediaContainer}>
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
        <span className={styles.tag}>PROJECT</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.location}>{project.location}, {project.city}</p>

        {/* Completion status replaces the price metadata used on sale listings */}
        <div className={styles.statusRow}>
          <span className={styles.completion}>{project.completion}% Complete</span>
          <span className={styles.status}>{status}</span>
        </div>
        <div className={styles.track} role="progressbar" aria-valuenow={project.completion} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.fill} style={{ width: `${project.completion}%` }} />
        </div>

        <p className={styles.eta}>Expected completion: <strong>{project.expectedCompletion}</strong></p>
        {project.description ? <p className={styles.desc}>{project.description}</p> : null}
      </div>
    </div>
  );
}
