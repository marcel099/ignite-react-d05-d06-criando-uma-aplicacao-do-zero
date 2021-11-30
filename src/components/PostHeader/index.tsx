import Link from 'next/link';
import styles from './styles.module.scss';

export function PostHeader() {
  return (
    // <header className={styles.container}>
    <div className={styles.logoContainer}>
      <Link href="/">
        <a href="">
          <img src="../logo.svg" alt="logo" />
        </a>
      </Link>
    </div>
    // </header>
  )
}
