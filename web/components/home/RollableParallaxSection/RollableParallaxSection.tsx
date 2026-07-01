import styles from './RollableParallaxSection.module.css';

export default function RollableParallaxSection() {
  return (
    <section className={styles.parallax}>
      <div className={styles.content}>
        <h2 className={styles.heading}>Building Dreams Since Day One</h2>
        <p className={styles.subtitle}>Where luxury meets comfort in every detail</p>
      </div>
    </section>
  );
}
