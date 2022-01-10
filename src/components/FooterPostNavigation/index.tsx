import Link from 'next/link';

import styles from './styles.module.scss';

interface LinkPost {
  first_publication_date: string | null;
  last_publication_date: string | null;
  uid?: string;
  data: {
    title: string;
  };
}

interface FooterPostNavigationProps {
  nextPost: LinkPost;
  previousPost: LinkPost;
}

export function FooterPostNavigation({nextPost, previousPost}: FooterPostNavigationProps) {
  return (
    <>
      <div className={styles.divider}/>
      <nav className={styles.postsNavigation}>
        { previousPost !== null && (
          <div className={styles.postAnterior}>
            <h3>{previousPost.data.title}</h3>
            <Link href={previousPost.uid}>
              <a href="">Post anterior</a>
            </Link>
          </div>
        )}
        { nextPost !== null && (
          <div className={styles.postPosterior}>
            <h3>{nextPost.data.title}</h3>
            <Link href={nextPost.uid}>
              <a href="">Próximo post</a>
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}