import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
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
