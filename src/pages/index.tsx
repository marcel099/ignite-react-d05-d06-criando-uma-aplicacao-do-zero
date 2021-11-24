import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import { FiCalendar, FiUser } from 'react-icons/fi'
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
  // console.log(postsPagination)

  return (
    <div className={styles.container}>
      <img src="./logo.svg" alt="logo" />

      <ul className={styles.postList}>
        {results.map(result => (
          <li key={result.uid} className={styles.post}>
            <strong>{result.data.title}</strong>
            <p>{result.data.subtitle}</p>
            <div className={styles.createdAt}>
              <FiCalendar />
              <time dateTime="">{result.first_publication_date}</time>
            </div>
            <div className={styles.author}>
              <FiUser />
              <span>{result.data.author}</span>
            </div>
          </li>
        ))}
      </ul>
      
      {
        next_page !== null ? (
          <button type="button">
            Carregar mais posts
          </button>
        ) : ''
      }
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );

  console.log(postsResponse)

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
    revalidate: 60 * 30 // 30 minutos
  }
};
