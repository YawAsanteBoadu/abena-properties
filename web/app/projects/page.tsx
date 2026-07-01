import type { Metadata } from 'next';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import { getProjects } from '@/data/properties';
import styles from '@/styles/Projects.module.css';

export const metadata: Metadata = {
  title: 'Construction & Projects',
  description:
    'Ongoing construction and development projects by Abena Properties, tracked by completion status.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Construction &amp; Ongoing Projects</h1>
        <p className={styles.heroSubtitle}>
          Secure your unit early. Track each development by build stage and expected completion.
        </p>
      </section>
      <section className={styles.section}>
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}
