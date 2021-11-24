import { GetStaticProps } from 'next';
import Link from 'next/link'
import { FiCalendar, FiUser } from 'react-icons/fi'
import Prismic from '@prismicio/client'
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination: {
    next_page,
    results,
  },
}: HomeProps) {
  return (
    <div className={commonStyles.pageContainer}>
      <div className={`${commonStyles.contentContainer} ${styles.contentContainer}`}>
        <header className={styles.logoContainer}>
          <img src="./logo.svg" alt="logo" />
        </header>

        <main className={styles.postList}>
          {results.map(result => (
            <Link href={`post/${result.uid}`} key={result.uid}>
              <a href="" className={styles.post}>
                <strong className={styles.title}>
                  {result.data.title}
                </strong>
                <p className={styles.subtitle}>
                  {result.data.subtitle}
                </p>
                <div className={styles.info}>
                  <div className={styles.createdAt}>
                    <FiCalendar />
                    <time dateTime="">
                      {result.first_publication_date}
                    </time>
                  </div>
                  
                  <div className={styles.author}>
                    <FiUser />
                    <span>
                      {result.data.author}
                    </span>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </main>

        {
          next_page !== null ? (
            <footer className={styles.buttonContainer}>
              <button type="button">
                Carregar mais posts
              </button>
            </footer>
          ) : ''
        }
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    { pageSize: 3 }
  );

  const posts: Post[] = postsResponse.results.map(result => ({
    uid: result.uid,
    first_publication_date: format(
      new Date(result.first_publication_date),
      "dd MMM YYY",
      { locale: ptBR }
    ),
    data: {
      title: result.data.title,
      subtitle: result.data.subtitle,
      author: result.data.author,
    }
  }))

  const props: HomeProps = {
    postsPagination: {
      next_page: postsResponse.next_page,
      results: posts,
    }
  }

  return {
    props,
    revalidate: 60 * 30 // 30 minutes
  }
};
