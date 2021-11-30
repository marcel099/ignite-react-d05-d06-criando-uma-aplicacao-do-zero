import Link from 'next/link';

import styles from './styles.module.scss';

export function FooterPostNavigation() {
  return (
    <>
      <div className={styles.divider}/>
      <nav className={styles.postsNavigation}>
        <div className={styles.postAnterior}>
          <h3>Como utilizar hooks</h3>
          <Link href={`post`}>
            <a href="">Post anterior</a>
          </Link>
        </div>
        <div className={styles.postPosterior}>
          <h3>Criando um app CRA do zero</h3>
          <Link href={`post`}>
            <a href="">Próximo post</a>
          </Link>
        </div>
      </nav>
    </>
  )
}